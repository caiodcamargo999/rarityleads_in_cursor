const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Import session manager
const { 
  createSession, 
  sendMessage, 
  getSessionStatus, 
  getUserSessions, 
  disconnectSession,
  restoreSessions,
  sessions 
} = require('./sessionManager');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Authentication middleware
async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

// WebSocket connection handling
const wsClients = new Map(); // Map to store WebSocket connections by user ID

wss.on('connection', async (ws, req) => {
  try {
    // Extract token from query string or headers
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get('token') || req.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      ws.close(1008, 'No token provided');
      return;
    }

    // Authenticate user
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) {
      ws.close(1008, 'Invalid token');
      return;
    }

    // Store WebSocket connection
    wsClients.set(user.id, ws);
    console.log(`WebSocket connected for user: ${user.id}`);

    // Send initial session data
    const userSessions = await getUserSessions(user.id);
    ws.send(JSON.stringify({
      type: 'sessions_update',
      data: userSessions
    }));

    // Handle WebSocket messages
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message);
        
        switch (data.type) {
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
          
          case 'create_session':
            const sessionId = uuidv4();
            await createSession(
              user.id,
              sessionId,
              (qr, sessionId) => {
                ws.send(JSON.stringify({
                  type: 'qr_code',
                  sessionId: sessionId,
                  qr: qr
                }));
              },
              (sessionId, phoneNumber) => {
                ws.send(JSON.stringify({
                  type: 'session_ready',
                  sessionId: sessionId,
                  phoneNumber: phoneNumber
                }));
              },
              (sessionId, messageData) => {
                ws.send(JSON.stringify({
                  type: 'message_received',
                  sessionId: sessionId,
                  message: messageData
                }));
              },
              (sessionId, status, phoneNumber) => {
                ws.send(JSON.stringify({
                  type: 'status_update',
                  sessionId: sessionId,
                  status: status,
                  phoneNumber: phoneNumber
                }));
              }
            );
            break;

          case 'send_message':
            const result = await sendMessage(
              data.sessionId,
              data.to,
              data.message,
              user.id
            );
            ws.send(JSON.stringify({
              type: 'message_sent',
              success: true,
              messageId: result.messageId
            }));
            break;

          case 'disconnect_session':
            await disconnectSession(data.sessionId);
            ws.send(JSON.stringify({
              type: 'session_disconnected',
              sessionId: data.sessionId
            }));
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({
          type: 'error',
          message: error.message
        }));
      }
    });

    // Handle WebSocket close
    ws.on('close', () => {
      wsClients.delete(user.id);
      console.log(`WebSocket disconnected for user: ${user.id}`);
    });

  } catch (error) {
    console.error('WebSocket connection error:', error);
    ws.close(1011, 'Internal server error');
  }
});

// REST API Endpoints

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    activeSessions: Object.keys(sessions).length
  });
});

// Get user's WhatsApp sessions
app.get('/api/sessions', authenticateUser, async (req, res) => {
  try {
    const sessions = await getUserSessions(req.user.id);
    res.json({ sessions });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Create a new WhatsApp session
app.post('/api/sessions', authenticateUser, async (req, res) => {
  try {
    const sessionId = uuidv4();
    
    // Start session creation (QR will be sent via WebSocket)
    createSession(
      req.user.id,
      sessionId,
      (qr, sessionId) => {
        // QR code will be sent via WebSocket
      },
      (sessionId, phoneNumber) => {
        // Session ready notification will be sent via WebSocket
      },
      (sessionId, messageData) => {
        // Incoming message will be sent via WebSocket
      },
      (sessionId, status, phoneNumber) => {
        // Status update will be sent via WebSocket
      }
    );

    res.json({ 
      sessionId: sessionId,
      message: 'Session creation started. Check WebSocket for QR code.'
    });
  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Get session status
app.get('/api/sessions/:sessionId/status', authenticateUser, async (req, res) => {
  try {
    const status = getSessionStatus(req.params.sessionId);
    res.json({ status });
  } catch (error) {
    console.error('Error getting session status:', error);
    res.status(500).json({ error: 'Failed to get session status' });
  }
});

// Disconnect session
app.delete('/api/sessions/:sessionId', authenticateUser, async (req, res) => {
  try {
    await disconnectSession(req.params.sessionId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting session:', error);
    res.status(500).json({ error: 'Failed to disconnect session' });
  }
});

// Send message via REST API (alternative to WebSocket)
app.post('/api/sessions/:sessionId/messages', authenticateUser, async (req, res) => {
  try {
    const { to, message } = req.body;
    
    if (!to || !message) {
      return res.status(400).json({ error: 'Missing required fields: to, message' });
    }

    const result = await sendMessage(req.params.sessionId, to, message, req.user.id);
    res.json(result);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a session
app.get('/api/sessions/:sessionId/messages', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('whatsapp_session_id', req.params.sessionId)
      .eq('user_id', req.user.id)
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) {
      throw error;
    }

    res.json({ messages: data || [] });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Get leads for a user
app.get('/api/leads', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ leads: data || [] });
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Create a new lead
app.post('/api/leads', authenticateUser, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('leads')
      .insert([{
        user_id: req.user.id,
        ...req.body
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({ lead: data });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Failed to create lead' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 3001;

// Restore sessions on startup
restoreSessions().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 WhatsApp Integration Server running on port ${PORT}`);
    console.log(`📱 WebSocket server ready for connections`);
    console.log(`🔐 Authentication required for all endpoints`);
    console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  });
}).catch(error => {
  console.error('Failed to restore sessions:', error);
  server.listen(PORT, () => {
    console.log(`🚀 WhatsApp Integration Server running on port ${PORT} (without session restoration)`);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});