import makeWASocket, { 
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
  makeInMemoryStore,
  Browsers
} from '@whiskeysockets/baileys';
import { createClient } from '@supabase/supabase-js';
import express from 'express';
import { WebSocketServer } from 'ws';
import QRCode from 'qrcode';
import pino from 'pino';
import cors from 'cors';
import helmet from 'helmet';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { promises as fs } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const logger = pino({ level: 'info' });

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Express setup
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// WebSocket for real-time QR codes
const wss = new WebSocketServer({ port: 3011 });

// Store for WhatsApp connections
const connections = new Map();
const stores = new Map();

// Session management
class WhatsAppSession {
  constructor(sessionId, userId) {
    this.sessionId = sessionId;
    this.userId = userId;
    this.sock = null;
    this.store = makeInMemoryStore({ logger });
    this.qr = null;
    this.status = 'initializing';
    stores.set(sessionId, this.store);
  }

  async init() {
    const sessionPath = join(__dirname, 'sessions', this.sessionId);
    await fs.mkdir(sessionPath, { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    this.sock = makeWASocket({
      version,
      logger,
      printQRInTerminal: false,
      auth: state,
      browser: Browsers.ubuntu('Chrome'),
      generateHighQualityLinkPreview: true,
      getMessage: async (key) => {
        if (this.store) {
          const msg = await this.store.loadMessage(key.remoteJid, key.id);
          return msg?.message || undefined;
        }
        return undefined;
      }
    });

    this.store.bind(this.sock.ev);

    // Connection events
    this.sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        this.qr = qr;
        this.status = 'qr_ready';
        
        // Generate QR code
        const qrDataUrl = await QRCode.toDataURL(qr);
        
        // Send to connected WebSocket clients
        this.broadcastUpdate({
          type: 'qr',
          sessionId: this.sessionId,
          qr: qrDataUrl
        });

        // Update database
        await supabase
          .from('whatsapp_sessions')
          .update({ 
            status: 'qr_ready',
            updated_at: new Date().toISOString()
          })
          .eq('id', this.sessionId);
      }

      if (connection === 'close') {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        
        if (shouldReconnect) {
          logger.info(`Reconnecting session ${this.sessionId}...`);
          await this.init();
        } else {
          this.status = 'logged_out';
          await this.cleanup();
        }
      }

      if (connection === 'open') {
        this.status = 'connected';
        logger.info(`Session ${this.sessionId} connected`);
        
        // Get phone number
        const phoneNumber = this.sock.user?.id.split(':')[0] || '';
        
        // Update database
        await supabase
          .from('whatsapp_sessions')
          .update({ 
            status: 'connected',
            phone_number: phoneNumber,
            session_data: { user: this.sock.user },
            updated_at: new Date().toISOString()
          })
          .eq('id', this.sessionId);

        this.broadcastUpdate({
          type: 'connected',
          sessionId: this.sessionId,
          phoneNumber
        });
      }
    });

    // Message events
    this.sock.ev.on('messages.upsert', async (m) => {
      const messages = m.messages;
      
      for (const msg of messages) {
        if (!msg.key.fromMe && msg.message) {
          await this.handleIncomingMessage(msg);
        }
      }
    });

    // Save credentials
    this.sock.ev.on('creds.update', saveCreds);
  }

  async handleIncomingMessage(msg) {
    const from = msg.key.remoteJid;
    const messageContent = this.extractMessageContent(msg);
    
    // Forward to message orchestrator
    await fetch('http://localhost:3000/webhook/whatsapp', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'user-id': this.userId
      },
      body: JSON.stringify({
        channel: 'whatsapp',
        from,
        content: messageContent,
        timestamp: new Date(msg.messageTimestamp * 1000).toISOString(),
        sessionId: this.sessionId
      })
    });
  }

  extractMessageContent(msg) {
    const message = msg.message;
    
    if (message.conversation) {
      return { type: 'text', text: message.conversation };
    } else if (message.extendedTextMessage) {
      return { type: 'text', text: message.extendedTextMessage.text };
    } else if (message.imageMessage) {
      return { type: 'image', caption: message.imageMessage.caption };
    } else if (message.videoMessage) {
      return { type: 'video', caption: message.videoMessage.caption };
    } else if (message.audioMessage) {
      return { type: 'audio' };
    } else if (message.documentMessage) {
      return { type: 'document', fileName: message.documentMessage.fileName };
    } else if (message.locationMessage) {
      return { 
        type: 'location',
        latitude: message.locationMessage.degreesLatitude,
        longitude: message.locationMessage.degreesLongitude
      };
    }
    
    return { type: 'unknown', raw: message };
  }

  async sendMessage(to, content) {
    if (this.status !== 'connected') {
      throw new Error('Session not connected');
    }

    const jid = to.includes('@') ? to : `${to}@s.whatsapp.net`;
    
    let message;
    switch (content.type) {
      case 'text':
        message = { text: content.text };
        break;
      case 'image':
        message = { 
          image: content.media,
          caption: content.caption 
        };
        break;
      case 'video':
        message = { 
          video: content.media,
          caption: content.caption 
        };
        break;
      case 'document':
        message = { 
          document: content.media,
          fileName: content.fileName 
        };
        break;
      case 'template':
        message = await this.buildTemplateMessage(content.template);
        break;
      default:
        message = { text: content.text || 'Message' };
    }

    const result = await this.sock.sendMessage(jid, message);
    return { messageId: result.key.id, status: 'sent' };
  }

  async buildTemplateMessage(template) {
    // Build interactive message with buttons/lists
    if (template.buttons) {
      return {
        text: template.body,
        footer: template.footer,
        buttons: template.buttons.map((btn, idx) => ({
          buttonId: `btn_${idx}`,
          buttonText: { displayText: btn.text },
          type: 1
        }))
      };
    }
    
    return { text: template.body };
  }

  broadcastUpdate(data) {
    wss.clients.forEach(client => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(data));
      }
    });
  }

  async cleanup() {
    this.sock?.end();
    stores.delete(this.sessionId);
    connections.delete(this.sessionId);
    
    await supabase
      .from('whatsapp_sessions')
      .update({ 
        status: 'inactive',
        updated_at: new Date().toISOString()
      })
      .eq('id', this.sessionId);
  }
}

// API Routes
app.post('/sessions/create', async (req, res) => {
  try {
    const { userId } = req.body;
    
    // Create session in database
    const { data: session, error } = await supabase
      .from('whatsapp_sessions')
      .insert({
        user_id: userId,
        status: 'initializing'
      })
      .select()
      .single();

    if (error) throw error;

    // Initialize WhatsApp session
    const waSession = new WhatsAppSession(session.id, userId);
    connections.set(session.id, waSession);
    await waSession.init();

    res.json({ sessionId: session.id, status: 'initializing' });
  } catch (error) {
    logger.error('Create session error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/sessions/:sessionId/qr', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = connections.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    if (session.qr) {
      const qrDataUrl = await QRCode.toDataURL(session.qr);
      res.json({ qr: qrDataUrl, status: session.status });
    } else {
      res.json({ status: session.status });
    }
  } catch (error) {
    logger.error('Get QR error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/send', async (req, res) => {
  try {
    const { session, recipient, content } = req.body;
    
    const waSession = connections.get(session.id);
    if (!waSession) {
      // Try to restore session
      const restored = await restoreSession(session.id, session.user_id);
      if (!restored) {
        return res.status(404).json({ error: 'Session not found' });
      }
      waSession = restored;
    }

    const result = await waSession.sendMessage(recipient.phone, content);
    res.json(result);
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/sessions/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = connections.get(sessionId);
    
    if (session) {
      await session.cleanup();
    }

    res.json({ success: true });
  } catch (error) {
    logger.error('Delete session error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/sessions/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data: sessions, error } = await supabase
      .from('whatsapp_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(sessions);
  } catch (error) {
    logger.error('Get user sessions error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Restore sessions on startup
async function restoreSession(sessionId, userId) {
  try {
    const { data: session } = await supabase
      .from('whatsapp_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (session && session.status === 'connected') {
      const waSession = new WhatsAppSession(sessionId, userId);
      connections.set(sessionId, waSession);
      await waSession.init();
      return waSession;
    }
  } catch (error) {
    logger.error('Restore session error:', error);
  }
  return null;
}

async function restoreAllSessions() {
  const { data: sessions } = await supabase
    .from('whatsapp_sessions')
    .select('*')
    .eq('status', 'connected');

  if (sessions) {
    for (const session of sessions) {
      await restoreSession(session.id, session.user_id);
    }
  }
}

// WebSocket connection handler
wss.on('connection', (ws) => {
  logger.info('WebSocket client connected');
  
  ws.on('error', (error) => {
    logger.error('WebSocket error:', error);
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    activeSessions: connections.size
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  logger.info(`WhatsApp service running on port ${PORT}`);
  logger.info(`WebSocket server running on port 3011`);
  
  // Restore sessions
  await restoreAllSessions();
});