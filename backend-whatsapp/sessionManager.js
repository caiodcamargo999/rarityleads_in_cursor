const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const QRCode = require('qrcode');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

class SessionManager {
  constructor(logger) {
    this.logger = logger;
    this.sessions = new Map();
    this.authStates = new Map();
    this.sessionDir = path.join(__dirname, 'sessions');
    this.ensureSessionDirectory();
  }

  async ensureSessionDirectory() {
    try {
      await fs.mkdir(this.sessionDir, { recursive: true });
    } catch (error) {
      this.logger.error('Error creating session directory:', error);
    }
  }

  async createSession(sessionId, config) {
    try {
      this.logger.info(`Creating new WhatsApp session: ${sessionId}`);
      
      const session = {
        id: sessionId,
        userId: config.userId,
        phoneNumber: config.phoneNumber,
        name: config.name,
        status: 'initializing',
        qrCode: null,
        lastActivity: new Date(),
        socket: null,
        messageHandlers: new Map(),
        mediaHandlers: new Map(),
        config: config
      };

      this.sessions.set(sessionId, session);
      
      // Initialize auth state
      const authState = await this.initializeAuthState(sessionId);
      this.authStates.set(sessionId, authState);
      
      return session;
    } catch (error) {
      this.logger.error(`Error creating session ${sessionId}:`, error);
      throw error;
    }
  }

  async initializeAuthState(sessionId) {
    try {
      const sessionPath = path.join(this.sessionDir, sessionId);
      await fs.mkdir(sessionPath, { recursive: true });
      
      const authState = await useMultiFileAuthState(sessionPath);
      return authState;
    } catch (error) {
      this.logger.error(`Error initializing auth state for session ${sessionId}:`, error);
      throw error;
    }
  }

  async connectSession(session) {
    try {
      this.logger.info(`Connecting session: ${session.id}`);
      
      const authState = this.authStates.get(session.id);
      if (!authState) {
        throw new Error('Auth state not found');
      }

      // Create WhatsApp socket
      const sock = makeWASocket({
        auth: authState.state,
        printQRInTerminal: false,
        logger: this.logger.child({ sessionId: session.id }),
        browser: ['Rarity Leads', 'Chrome', '1.0.0'],
        connectTimeoutMs: 60000,
        keepAliveIntervalMs: 30000,
        emitOwnEvents: false,
        defaultQueryTimeoutMs: 60000,
        retryRequestDelayMs: 250,
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
          // Implement message retrieval from database if needed
          return null;
        }
      });

      // Store socket in session
      session.socket = sock;
      session.status = 'connecting';

      // Set up event handlers
      this.setupEventHandlers(session);

      // Generate QR code if needed
      if (!authState.state.creds.registered) {
        const qrCode = await this.generateQRCode(session);
        session.qrCode = qrCode;
        session.status = 'qr_ready';
      } else {
        session.status = 'connected';
        session.qrCode = null;
      }

      session.lastActivity = new Date();
      
      this.logger.info(`Session ${session.id} connection setup complete`);
      return {
        status: session.status,
        qrCode: session.qrCode,
        phoneNumber: session.phoneNumber
      };
    } catch (error) {
      this.logger.error(`Error connecting session ${session.id}:`, error);
      session.status = 'error';
      throw error;
    }
  }

  setupEventHandlers(session) {
    const sock = session.socket;
    const sessionId = session.id;

    // Connection updates
    sock.ev.on('connection.update', async (update) => {
      try {
        this.logger.info(`Connection update for session ${sessionId}:`, update.status);
        
        switch (update.status) {
          case 'connecting':
            session.status = 'connecting';
            break;
            
          case 'open':
            session.status = 'connected';
            session.qrCode = null;
            session.lastActivity = new Date();
            this.logger.info(`Session ${sessionId} connected successfully`);
            break;
            
          case 'close':
            session.status = 'disconnected';
            this.logger.info(`Session ${sessionId} disconnected`);
            break;
        }

        // Emit status update to connected clients
        this.emitToSession(sessionId, 'status_update', {
          sessionId,
          status: session.status,
          phoneNumber: session.phoneNumber
        });
      } catch (error) {
        this.logger.error(`Error handling connection update for session ${sessionId}:`, error);
      }
    });

    // QR code updates
    sock.ev.on('connection.update', async (update) => {
      if (update.qr) {
        try {
          const qrCode = await QRCode.toDataURL(update.qr);
          session.qrCode = qrCode;
          session.status = 'qr_ready';
          
          this.logger.info(`QR code generated for session ${sessionId}`);
          
          // Emit QR code to connected clients
          this.emitToSession(sessionId, 'qr_code', {
            sessionId,
            qrCode
          });
        } catch (error) {
          this.logger.error(`Error generating QR code for session ${sessionId}:`, error);
        }
      }
    });

    // Credentials updates
    sock.ev.on('creds.update', async () => {
      try {
        const authState = this.authStates.get(sessionId);
        if (authState) {
          await authState.saveCreds();
          this.logger.info(`Credentials saved for session ${sessionId}`);
        }
      } catch (error) {
        this.logger.error(`Error saving credentials for session ${sessionId}:`, error);
      }
    });

    // Message updates
    sock.ev.on('messages.upsert', async (m) => {
      try {
        for (const message of m.messages) {
          if (message.key.fromMe) continue; // Skip own messages
          
          const messageData = await this.processIncomingMessage(session, message);
          
          // Emit message to connected clients
          this.emitToSession(sessionId, 'message_received', {
            sessionId,
            message: messageData
          });
        }
      } catch (error) {
        this.logger.error(`Error processing incoming message for session ${sessionId}:`, error);
      }
    });

    // Message status updates
    sock.ev.on('messages.update', async (updates) => {
      try {
        for (const update of updates) {
          const messageData = {
            key: update.key,
            update: update.update
          };
          
          // Emit status update to connected clients
          this.emitToSession(sessionId, 'message_status_update', {
            sessionId,
            message: messageData
          });
        }
      } catch (error) {
        this.logger.error(`Error processing message status update for session ${sessionId}:`, error);
      }
    });

    // Presence updates
    sock.ev.on('presence.update', async (presence) => {
      try {
        // Emit presence update to connected clients
        this.emitToSession(sessionId, 'presence_update', {
          sessionId,
          presence
        });
      } catch (error) {
        this.logger.error(`Error processing presence update for session ${sessionId}:`, error);
      }
    });

    // Handle disconnection
    sock.ev.on('connection.update', async (update) => {
      if (update.lastDisconnect?.error instanceof Boom) {
        const { statusCode } = update.lastDisconnect.error.output;
        
        if (statusCode !== DisconnectReason.loggedOut) {
          this.logger.warn(`Session ${sessionId} disconnected, attempting to reconnect...`);
          // Implement reconnection logic here
        } else {
          this.logger.info(`Session ${sessionId} logged out`);
          session.status = 'logged_out';
        }
      }
    });
  }

  async generateQRCode(session) {
    try {
      // QR code will be generated in the connection.update event
      // This method is called when we need to manually generate one
      return null;
    } catch (error) {
      this.logger.error(`Error generating QR code for session ${session.id}:`, error);
      throw error;
    }
  }

  async sendMessage(session, messageData) {
    try {
      const { to, message, type = 'text', mediaId } = messageData;
      
      if (!session.socket) {
        throw new Error('Session not connected');
      }

      if (session.status !== 'connected') {
        throw new Error('Session not ready');
      }

      let messageOptions = {};
      let content = {};

      switch (type) {
        case 'text':
          content = { text: message };
          break;
          
        case 'image':
          if (!mediaId) {
            throw new Error('Media ID required for image message');
          }
          const imageBuffer = await this.getMediaBuffer(mediaId);
          content = { image: imageBuffer };
          break;
          
        case 'video':
          if (!mediaId) {
            throw new Error('Media ID required for video message');
          }
          const videoBuffer = await this.getMediaBuffer(mediaId);
          content = { video: videoBuffer };
          break;
          
        case 'audio':
          if (!mediaId) {
            throw new Error('Media ID required for audio message');
          }
          const audioBuffer = await this.getMediaBuffer(mediaId);
          content = { audio: audioBuffer };
          break;
          
        case 'document':
          if (!mediaId) {
            throw new Error('Media ID required for document message');
          }
          const documentBuffer = await this.getMediaBuffer(mediaId);
          content = { document: documentBuffer };
          break;
          
        default:
          throw new Error(`Unsupported message type: ${type}`);
      }

      const result = await session.socket.sendMessage(to, content, messageOptions);
      
      session.lastActivity = new Date();
      
      this.logger.info(`Message sent via session ${session.id} to ${to}`);
      
      return {
        messageId: result.key.id,
        to,
        type,
        status: 'sent',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error(`Error sending message via session ${session.id}:`, error);
      throw error;
    }
  }

  async processIncomingMessage(session, message) {
    try {
      const messageData = {
        id: message.key.id,
        from: message.key.remoteJid,
        timestamp: new Date(message.messageTimestamp * 1000).toISOString(),
        type: this.getMessageType(message),
        content: await this.extractMessageContent(message),
        status: 'received'
      };

      session.lastActivity = new Date();
      
      this.logger.info(`Processed incoming message for session ${session.id}:`, messageData.id);
      
      return messageData;
    } catch (error) {
      this.logger.error(`Error processing incoming message for session ${session.id}:`, error);
      throw error;
    }
  }

  getMessageType(message) {
    if (message.message?.conversation) return 'text';
    if (message.message?.imageMessage) return 'image';
    if (message.message?.videoMessage) return 'video';
    if (message.message?.audioMessage) return 'audio';
    if (message.message?.documentMessage) return 'document';
    if (message.message?.stickerMessage) return 'sticker';
    if (message.message?.locationMessage) return 'location';
    if (message.message?.contactMessage) return 'contact';
    return 'unknown';
  }

  async extractMessageContent(message) {
    try {
      const msg = message.message;
      
      if (msg.conversation) {
        return { text: msg.conversation };
      }
      
      if (msg.imageMessage) {
        return {
          caption: msg.imageMessage.caption,
          mimetype: msg.imageMessage.mimetype,
          url: msg.imageMessage.url
        };
      }
      
      if (msg.videoMessage) {
        return {
          caption: msg.videoMessage.caption,
          mimetype: msg.videoMessage.mimetype,
          url: msg.videoMessage.url
        };
      }
      
      if (msg.audioMessage) {
        return {
          mimetype: msg.audioMessage.mimetype,
          url: msg.audioMessage.url
        };
      }
      
      if (msg.documentMessage) {
        return {
          fileName: msg.documentMessage.fileName,
          mimetype: msg.documentMessage.mimetype,
          url: msg.documentMessage.url
        };
      }
      
      if (msg.stickerMessage) {
        return {
          mimetype: msg.stickerMessage.mimetype,
          url: msg.stickerMessage.url
        };
      }
      
      if (msg.locationMessage) {
        return {
          latitude: msg.locationMessage.degreesLatitude,
          longitude: msg.locationMessage.degreesLongitude,
          name: msg.locationMessage.name,
          address: msg.locationMessage.address
        };
      }
      
      if (msg.contactMessage) {
        return {
          displayName: msg.contactMessage.displayName,
          vcard: msg.contactMessage.vcard
        };
      }
      
      return { type: 'unknown' };
    } catch (error) {
      this.logger.error('Error extracting message content:', error);
      return { type: 'error', error: error.message };
    }
  }

  async uploadMedia(session, file) {
    try {
      const mediaId = uuidv4();
      const mediaPath = path.join(this.sessionDir, session.id, 'media', mediaId);
      
      await fs.mkdir(path.dirname(mediaPath), { recursive: true });
      await fs.writeFile(mediaPath, file.buffer);
      
      session.mediaHandlers.set(mediaId, {
        path: mediaPath,
        mimetype: file.mimetype,
        filename: file.originalname
      });
      
      this.logger.info(`Media uploaded for session ${session.id}: ${mediaId}`);
      
      return mediaId;
    } catch (error) {
      this.logger.error(`Error uploading media for session ${session.id}:`, error);
      throw error;
    }
  }

  async getMedia(session, mediaId) {
    try {
      const mediaHandler = session.mediaHandlers.get(mediaId);
      if (!mediaHandler) {
        throw new Error('Media not found');
      }
      
      const data = await fs.readFile(mediaHandler.path);
      
      return {
        data,
        mimetype: mediaHandler.mimetype,
        filename: mediaHandler.filename
      };
    } catch (error) {
      this.logger.error(`Error getting media ${mediaId} for session ${session.id}:`, error);
      throw error;
    }
  }

  async getMediaBuffer(mediaId) {
    try {
      // This would typically fetch media from storage
      // For now, we'll return a placeholder
      throw new Error('Media buffer retrieval not implemented');
    } catch (error) {
      this.logger.error(`Error getting media buffer for ${mediaId}:`, error);
      throw error;
    }
  }

  async disconnectSession(session) {
    try {
      this.logger.info(`Disconnecting session: ${session.id}`);
      
      if (session.socket) {
        await session.socket.logout();
        session.socket = null;
      }
      
      session.status = 'disconnected';
      session.qrCode = null;
      session.lastActivity = new Date();
      
      // Clean up auth state
      const authState = this.authStates.get(session.id);
      if (authState) {
        this.authStates.delete(session.id);
      }
      
      this.logger.info(`Session ${session.id} disconnected successfully`);
    } catch (error) {
      this.logger.error(`Error disconnecting session ${session.id}:`, error);
      throw error;
    }
  }

  async restoreSession(dbSession) {
    try {
      this.logger.info(`Restoring session from database: ${dbSession.id}`);
      
      const session = await this.createSession(dbSession.id, {
        userId: dbSession.user_id,
        phoneNumber: dbSession.phone_number,
        name: `WhatsApp ${dbSession.phone_number}`,
        status: dbSession.status
      });
      
      // Try to connect the session
      await this.connectSession(session);
      
      return session;
    } catch (error) {
      this.logger.error(`Error restoring session ${dbSession.id}:`, error);
      return null;
    }
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId);
  }

  getAllSessions() {
    return Array.from(this.sessions.values());
  }

  getSessionsByUser(userId) {
    return Array.from(this.sessions.values()).filter(session => session.userId === userId);
  }

  emitToSession(sessionId, event, data) {
    // This would emit to connected WebSocket clients
    // Implementation depends on your WebSocket server setup
    this.logger.debug(`Emitting ${event} to session ${sessionId}:`, data);
  }

  async cleanupSession(sessionId) {
    try {
      const session = this.sessions.get(sessionId);
      if (session) {
        await this.disconnectSession(session);
        this.sessions.delete(sessionId);
        
        // Clean up session directory
        const sessionPath = path.join(this.sessionDir, sessionId);
        await fs.rm(sessionPath, { recursive: true, force: true });
        
        this.logger.info(`Session ${sessionId} cleaned up successfully`);
      }
    } catch (error) {
      this.logger.error(`Error cleaning up session ${sessionId}:`, error);
    }
  }

  getSessionStatus(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return null;
    }
    
    return {
      id: session.id,
      status: session.status,
      phoneNumber: session.phoneNumber,
      lastActivity: session.lastActivity,
      qrCode: session.qrCode
    };
  }
}

module.exports = SessionManager;