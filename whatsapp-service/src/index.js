import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { WebSocketServer } from 'ws';
import { create } from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import pino from 'pino';
import cron from 'node-cron';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// WebSocket server
const wss = new WebSocketServer({ port: 3002 });

// Session storage
const sessions = new Map();
const sessionDataPath = path.join(__dirname, '../sessions');

// Ensure sessions directory exists
fs.ensureDirSync(sessionDataPath);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || token !== process.env.WHATSAPP_SERVICE_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

// Apply authentication to all routes
app.use(authenticateToken);

// Helper function to save session data
const saveSessionData = async (sessionId, data) => {
  try {
    const filePath = path.join(sessionDataPath, `${sessionId}.json`);
    await fs.writeJson(filePath, data, { spaces: 2 });
    logger.info(`Session data saved for ${sessionId}`);
  } catch (error) {
    logger.error(`Error saving session data for ${sessionId}:`, error);
  }
};

// Helper function to load session data
const loadSessionData = async (sessionId) => {
  try {
    const filePath = path.join(sessionDataPath, `${sessionId}.json`);
    if (await fs.pathExists(filePath)) {
      return await fs.readJson(filePath);
    }
  } catch (error) {
    logger.error(`Error loading session data for ${sessionId}:`, error);
  }
  return null;
};

// Helper function to delete session data
const deleteSessionData = async (sessionId) => {
  try {
    const filePath = path.join(sessionDataPath, `${sessionId}.json`);
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
      logger.info(`Session data deleted for ${sessionId}`);
    }
  } catch (error) {
    logger.error(`Error deleting session data for ${sessionId}:`, error);
  }
};

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  logger.info('WebSocket client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      logger.info('WebSocket message received:', data);
    } catch (error) {
      logger.error('Error parsing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    logger.info('WebSocket client disconnected');
  });
});

// Broadcast to all WebSocket clients
const broadcastToClients = (event, data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(JSON.stringify({ event, data }));
    }
  });
};

// Connect new WhatsApp session
app.post('/connect', async (req, res) => {
  try {
    const { sessionId, sessionName, phoneNumber } = req.body;

    if (!sessionId || !sessionName || !phoneNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    logger.info(`Starting WhatsApp connection for session: ${sessionId}`);

    // Check if session already exists
    if (sessions.has(sessionId)) {
      return res.status(400).json({ error: 'Session already exists' });
    }

    // Create Baileys session
    const sock = create({
      printQRInTerminal: false,
      logger: pino({ level: 'silent' }),
      browser: ['Rarity Leads', 'Chrome', '1.0.0'],
      auth: {
        creds: {},
        keys: {}
      }
    });

    // Store session reference
    sessions.set(sessionId, {
      sock,
      sessionName,
      phoneNumber,
      status: 'connecting',
      createdAt: new Date()
    });

    // Handle connection updates
    sock.ev.on('connection.update', async (update) => {
      logger.info(`Connection update for ${sessionId}:`, update);

      const session = sessions.get(sessionId);
      if (!session) return;

      if (update.qr) {
        // Generate QR code
        try {
          const qrCode = await QRCode.toDataURL(update.qr);
          session.qrCode = qrCode;
          session.status = 'connecting';
          
          // Broadcast QR code to clients
          broadcastToClients('qr_code', {
            sessionId,
            qrCode,
            status: 'connecting'
          });

          logger.info(`QR code generated for session: ${sessionId}`);
        } catch (error) {
          logger.error(`Error generating QR code for ${sessionId}:`, error);
        }
      }

      if (update.connection === 'open') {
        session.status = 'connected';
        session.qrCode = null;
        
        // Save session data
        const authInfo = sock.authState.creds;
        await saveSessionData(sessionId, authInfo);

        // Broadcast connection success
        broadcastToClients('connection_success', {
          sessionId,
          status: 'connected'
        });

        logger.info(`WhatsApp connected for session: ${sessionId}`);
      }

      if (update.connection === 'close') {
        session.status = 'disconnected';
        
        // Broadcast disconnection
        broadcastToClients('connection_lost', {
          sessionId,
          status: 'disconnected'
        });

        logger.info(`WhatsApp disconnected for session: ${sessionId}`);
      }
    });

    // Handle incoming messages
    sock.ev.on('messages.upsert', async (m) => {
      const msg = m.messages[0];
      if (!msg.key.fromMe && msg.message) {
        const session = sessions.get(sessionId);
        if (!session) return;

        // Extract message content
        let messageContent = '';
        let messageType = 'text';

        if (msg.message.conversation) {
          messageContent = msg.message.conversation;
        } else if (msg.message.extendedTextMessage) {
          messageContent = msg.message.extendedTextMessage.text;
        } else if (msg.message.imageMessage) {
          messageContent = 'Image message';
          messageType = 'image';
        } else if (msg.message.audioMessage) {
          messageContent = 'Audio message';
          messageType = 'audio';
        } else if (msg.message.videoMessage) {
          messageContent = 'Video message';
          messageType = 'video';
        } else if (msg.message.documentMessage) {
          messageContent = 'Document message';
          messageType = 'document';
        }

        // Broadcast incoming message
        broadcastToClients('incoming_message', {
          sessionId,
          messageId: msg.key.id,
          from: msg.key.remoteJid,
          content: messageContent,
          type: messageType,
          timestamp: new Date().toISOString()
        });

        logger.info(`Incoming message for session ${sessionId}: ${messageContent}`);
      }
    });

    // Handle message status updates
    sock.ev.on('messages.update', (updates) => {
      updates.forEach((update) => {
        if (update.update.status) {
          const session = sessions.get(sessionId);
          if (!session) return;

          broadcastToClients('message_status', {
            sessionId,
            messageId: update.key.id,
            status: update.update.status
          });

          logger.info(`Message status update for session ${sessionId}: ${update.update.status}`);
        }
      });
    });

    // Start the connection
    await sock.start();

    // Return initial response
    res.json({
      success: true,
      sessionId,
      message: 'WhatsApp connection initiated'
    });

  } catch (error) {
    logger.error('Error connecting WhatsApp session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Disconnect session
app.post('/disconnect', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    logger.info(`Disconnecting WhatsApp session: ${sessionId}`);

    // Close Baileys connection
    await session.sock.logout();
    await session.sock.end();

    // Remove from sessions map
    sessions.delete(sessionId);

    // Delete session data
    await deleteSessionData(sessionId);

    // Broadcast disconnection
    broadcastToClients('session_disconnected', {
      sessionId,
      status: 'disconnected'
    });

    res.json({
      success: true,
      message: 'Session disconnected successfully'
    });

  } catch (error) {
    logger.error('Error disconnecting session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reconnect session
app.post('/reconnect', async (req, res) => {
  try {
    const { sessionId, sessionName, phoneNumber } = req.body;

    if (!sessionId || !sessionName || !phoneNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    logger.info(`Reconnecting WhatsApp session: ${sessionId}`);

    // Load saved session data
    const savedAuth = await loadSessionData(sessionId);
    if (!savedAuth) {
      return res.status(404).json({ error: 'No saved session data found' });
    }

    // Create new Baileys session with saved auth
    const sock = create({
      printQRInTerminal: false,
      logger: pino({ level: 'silent' }),
      browser: ['Rarity Leads', 'Chrome', '1.0.0'],
      auth: savedAuth
    });

    // Store session reference
    sessions.set(sessionId, {
      sock,
      sessionName,
      phoneNumber,
      status: 'reconnecting',
      createdAt: new Date()
    });

    // Handle connection updates (same as connect)
    sock.ev.on('connection.update', async (update) => {
      logger.info(`Reconnection update for ${sessionId}:`, update);

      const session = sessions.get(sessionId);
      if (!session) return;

      if (update.qr) {
        try {
          const qrCode = await QRCode.toDataURL(update.qr);
          session.qrCode = qrCode;
          session.status = 'reconnecting';
          
          broadcastToClients('qr_code', {
            sessionId,
            qrCode,
            status: 'reconnecting'
          });

          logger.info(`QR code generated for reconnection: ${sessionId}`);
        } catch (error) {
          logger.error(`Error generating QR code for reconnection ${sessionId}:`, error);
        }
      }

      if (update.connection === 'open') {
        session.status = 'connected';
        session.qrCode = null;
        
        // Update saved session data
        const authInfo = sock.authState.creds;
        await saveSessionData(sessionId, authInfo);

        broadcastToClients('connection_success', {
          sessionId,
          status: 'connected'
        });

        logger.info(`WhatsApp reconnected for session: ${sessionId}`);
      }

      if (update.connection === 'close') {
        session.status = 'disconnected';
        
        broadcastToClients('connection_lost', {
          sessionId,
          status: 'disconnected'
        });

        logger.info(`WhatsApp disconnected during reconnection: ${sessionId}`);
      }
    });

    // Start the connection
    await sock.start();

    res.json({
      success: true,
      sessionId,
      message: 'WhatsApp reconnection initiated'
    });

  } catch (error) {
    logger.error('Error reconnecting session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Send message
app.post('/send-message', async (req, res) => {
  try {
    const { sessionId, phoneNumber, message } = req.body;

    if (!sessionId || !phoneNumber || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const session = sessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.status !== 'connected') {
      return res.status(400).json({ error: 'Session not connected' });
    }

    logger.info(`Sending message via session ${sessionId} to ${phoneNumber}`);

    // Format phone number
    const formattedNumber = phoneNumber.includes('@s.whatsapp.net') 
      ? phoneNumber 
      : `${phoneNumber}@s.whatsapp.net`;

    // Send message
    const messageId = uuidv4();
    await session.sock.sendMessage(formattedNumber, {
      text: message
    }, {
      messageId
    });

    // Broadcast message sent
    broadcastToClients('message_sent', {
      sessionId,
      messageId,
      to: phoneNumber,
      content: message,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      messageId,
      message: 'Message sent successfully'
    });

  } catch (error) {
    logger.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get session status
app.get('/session-status/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      sessionId,
      status: session.status,
      sessionName: session.sessionName,
      phoneNumber: session.phoneNumber,
      createdAt: session.createdAt,
      qrCode: session.qrCode
    });

  } catch (error) {
    logger.error('Error getting session status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all sessions
app.get('/sessions', (req, res) => {
  try {
    const sessionsList = Array.from(sessions.entries()).map(([sessionId, session]) => ({
      sessionId,
      status: session.status,
      sessionName: session.sessionName,
      phoneNumber: session.phoneNumber,
      createdAt: session.createdAt
    }));

    res.json({
      sessions: sessionsList,
      total: sessionsList.length
    });

  } catch (error) {
    logger.error('Error getting sessions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    sessions: sessions.size,
    websocketClients: wss.clients.size
  });
});

// Cleanup expired sessions (run every hour)
cron.schedule('0 * * * *', async () => {
  logger.info('Running session cleanup...');
  
  const now = new Date();
  const expiredSessions = [];

  for (const [sessionId, session] of sessions.entries()) {
    // Consider sessions inactive after 24 hours
    const hoursSinceCreation = (now - session.createdAt) / (1000 * 60 * 60);
    
    if (hoursSinceCreation > 24 && session.status === 'disconnected') {
      expiredSessions.push(sessionId);
    }
  }

  for (const sessionId of expiredSessions) {
    try {
      const session = sessions.get(sessionId);
      if (session) {
        await session.sock.logout();
        await session.sock.end();
      }
      sessions.delete(sessionId);
      await deleteSessionData(sessionId);
      
      broadcastToClients('session_expired', { sessionId });
      logger.info(`Expired session cleaned up: ${sessionId}`);
    } catch (error) {
      logger.error(`Error cleaning up expired session ${sessionId}:`, error);
    }
  }

  logger.info(`Session cleanup completed. Removed ${expiredSessions.length} expired sessions`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  
  // Close all sessions
  for (const [sessionId, session] of sessions.entries()) {
    try {
      await session.sock.logout();
      await session.sock.end();
      logger.info(`Session ${sessionId} closed`);
    } catch (error) {
      logger.error(`Error closing session ${sessionId}:`, error);
    }
  }

  // Close WebSocket server
  wss.close(() => {
    logger.info('WebSocket server closed');
  });

  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  logger.info(`WhatsApp microservice running on port ${PORT}`);
  logger.info(`WebSocket server running on port 3002`);
  logger.info(`Sessions directory: ${sessionDataPath}`);
}); 