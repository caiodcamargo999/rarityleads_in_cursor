const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');
const pino = require('pino');
const pinoPretty = require('pino-pretty');
const cron = require('node-cron');
const path = require('path');
const fs = require('fs');

// Import our modules
const SessionManager = require('./sessionManager');
const SupabaseClient = require('./supabaseClient');
const MessageQueue = require('./messageQueue');
const WebhookManager = require('./webhookManager');

// Initialize logger
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

class WhatsAppService {
  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
    
    this.port = process.env.PORT || 3001;
    this.sessions = new Map();
    this.sessionManager = new SessionManager(logger);
    this.supabase = new SupabaseClient();
    this.messageQueue = new MessageQueue();
    this.webhookManager = new WebhookManager(this.supabase);
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocketIO();
    this.setupCronJobs();
  }

  setupMiddleware() {
    // Security middleware
    this.app.use(helmet());
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true
    }));
    
    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
    
    // Request logging
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      next();
    });
  }

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        sessions: this.sessions.size,
        uptime: process.uptime()
      });
    });

    // Session management routes
    this.app.post('/api/sessions', this.createSession.bind(this));
    this.app.get('/api/sessions', this.getSessions.bind(this));
    this.app.get('/api/sessions/:sessionId', this.getSession.bind(this));
    this.app.delete('/api/sessions/:sessionId', this.deleteSession.bind(this));
    this.app.post('/api/sessions/:sessionId/connect', this.connectSession.bind(this));
    this.app.post('/api/sessions/:sessionId/disconnect', this.disconnectSession.bind(this));

    // Message routes
    this.app.post('/api/sessions/:sessionId/messages', this.sendMessage.bind(this));
    this.app.get('/api/sessions/:sessionId/messages', this.getMessages.bind(this));
    this.app.post('/api/sessions/:sessionId/messages/bulk', this.sendBulkMessages.bind(this));

    // Media routes
    this.app.post('/api/sessions/:sessionId/media', this.uploadMedia.bind(this));
    this.app.get('/api/sessions/:sessionId/media/:mediaId', this.getMedia.bind(this));

    // Webhook routes
    this.app.post('/api/webhooks/whatsapp', this.handleWebhook.bind(this));
    this.app.get('/api/webhooks/verify', this.verifyWebhook.bind(this));

    // Analytics routes
    this.app.get('/api/analytics/sessions/:sessionId', this.getSessionAnalytics.bind(this));
    this.app.get('/api/analytics/overview', this.getOverviewAnalytics.bind(this));

    // Error handling
    this.app.use((err, req, res, next) => {
      logger.error('Unhandled error:', err);
      res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });
  }

  setupSocketIO() {
    this.io.on('connection', (socket) => {
      logger.info('Client connected:', socket.id);

      // Join session room
      socket.on('join-session', (sessionId) => {
        socket.join(`session-${sessionId}`);
        logger.info(`Client ${socket.id} joined session ${sessionId}`);
      });

      // Leave session room
      socket.on('leave-session', (sessionId) => {
        socket.leave(`session-${sessionId}`);
        logger.info(`Client ${socket.id} left session ${sessionId}`);
      });

      // Handle real-time message sending
      socket.on('send-message', async (data) => {
        try {
          const { sessionId, message } = data;
          const session = this.sessions.get(sessionId);
          
          if (!session) {
            socket.emit('error', { message: 'Session not found' });
            return;
          }

          const result = await this.sessionManager.sendMessage(session, message);
          socket.emit('message-sent', result);
          
          // Notify other clients in the same session
          socket.to(`session-${sessionId}`).emit('message-received', result);
        } catch (error) {
          logger.error('Error sending message via socket:', error);
          socket.emit('error', { message: error.message });
        }
      });

      socket.on('disconnect', () => {
        logger.info('Client disconnected:', socket.id);
      });
    });
  }

  setupCronJobs() {
    // Clean up expired sessions every hour
    cron.schedule('0 * * * *', async () => {
      try {
        await this.cleanupExpiredSessions();
      } catch (error) {
        logger.error('Error cleaning up expired sessions:', error);
      }
    });

    // Sync sessions with database every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      try {
        await this.syncSessionsWithDatabase();
      } catch (error) {
        logger.error('Error syncing sessions with database:', error);
      }
    });

    // Process message queue every minute
    cron.schedule('* * * * *', async () => {
      try {
        await this.processMessageQueue();
      } catch (error) {
        logger.error('Error processing message queue:', error);
      }
    });
  }

  // Session Management Methods
  async createSession(req, res) {
    try {
      const { userId, phoneNumber, name } = req.body;
      
      if (!userId || !phoneNumber) {
        return res.status(400).json({
          error: 'Missing required fields: userId, phoneNumber'
        });
      }

      const sessionId = uuidv4();
      const session = await this.sessionManager.createSession(sessionId, {
        userId,
        phoneNumber,
        name: name || `WhatsApp ${phoneNumber}`,
        status: 'initializing'
      });

      this.sessions.set(sessionId, session);

      // Save to database
      await this.supabase.createWhatsAppSession({
        id: sessionId,
        user_id: userId,
        phone_number: phoneNumber,
        status: 'initializing',
        session_data: {},
        created_at: new Date().toISOString()
      });

      logger.info(`Created new session: ${sessionId} for user: ${userId}`);
      
      res.status(201).json({
        sessionId,
        status: 'initializing',
        message: 'Session created successfully'
      });
    } catch (error) {
      logger.error('Error creating session:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getSessions(req, res) {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const sessions = await this.supabase.getWhatsAppSessions(userId);
      
      res.json({
        sessions: sessions.map(session => ({
          id: session.id,
          phoneNumber: session.phone_number,
          status: session.status,
          lastActivity: session.last_activity,
          createdAt: session.created_at
        }))
      });
    } catch (error) {
      logger.error('Error getting sessions:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getSession(req, res) {
    try {
      const { sessionId } = req.params;
      const session = this.sessions.get(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      res.json({
        id: sessionId,
        status: session.status,
        phoneNumber: session.phoneNumber,
        qrCode: session.qrCode,
        lastActivity: session.lastActivity
      });
    } catch (error) {
      logger.error('Error getting session:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteSession(req, res) {
    try {
      const { sessionId } = req.params;
      const session = this.sessions.get(sessionId);
      
      if (session) {
        await this.sessionManager.disconnectSession(session);
        this.sessions.delete(sessionId);
      }

      // Delete from database
      await this.supabase.deleteWhatsAppSession(sessionId);
      
      logger.info(`Deleted session: ${sessionId}`);
      res.json({ message: 'Session deleted successfully' });
    } catch (error) {
      logger.error('Error deleting session:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async connectSession(req, res) {
    try {
      const { sessionId } = req.params;
      const session = this.sessions.get(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const result = await this.sessionManager.connectSession(session);
      
      // Update database
      await this.supabase.updateWhatsAppSession(sessionId, {
        status: result.status,
        qr_code: result.qrCode,
        last_activity: new Date().toISOString()
      });

      // Emit to connected clients
      this.io.to(`session-${sessionId}`).emit('session-updated', result);
      
      res.json(result);
    } catch (error) {
      logger.error('Error connecting session:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async disconnectSession(req, res) {
    try {
      const { sessionId } = req.params;
      const session = this.sessions.get(sessionId);
      
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      await this.sessionManager.disconnectSession(session);
      
      // Update database
      await this.supabase.updateWhatsAppSession(sessionId, {
        status: 'disconnected',
        last_activity: new Date().toISOString()
      });

      // Emit to connected clients
      this.io.to(`session-${sessionId}`).emit('session-disconnected');
      
      res.json({ message: 'Session disconnected successfully' });
    } catch (error) {
      logger.error('Error disconnecting session:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Message Management Methods
  async sendMessage(req, res) {
    try {
      const { sessionId } = req.params;
      const { to, message, type = 'text' } = req.body;
      
      const session = this.sessions.get(sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const result = await this.sessionManager.sendMessage(session, {
        to,
        message,
        type
      });

      // Save message to database
      await this.supabase.createMessage({
        user_id: session.userId,
        lead_id: null, // Will be updated when lead is identified
        campaign_id: null,
        channel: 'whatsapp',
        channel_session_id: sessionId,
        direction: 'sent',
        content: { to, message, type },
        status: 'sent',
        external_id: result.messageId,
        timestamp: new Date().toISOString()
      });

      // Emit to connected clients
      this.io.to(`session-${sessionId}`).emit('message-sent', result);
      
      res.json(result);
    } catch (error) {
      logger.error('Error sending message:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async sendBulkMessages(req, res) {
    try {
      const { sessionId } = req.params;
      const { messages } = req.body;
      
      const session = this.sessions.get(sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const results = [];
      for (const messageData of messages) {
        try {
          const result = await this.sessionManager.sendMessage(session, messageData);
          results.push({ ...result, success: true });
        } catch (error) {
          results.push({ 
            to: messageData.to, 
            success: false, 
            error: error.message 
          });
        }
      }

      res.json({ results });
    } catch (error) {
      logger.error('Error sending bulk messages:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getMessages(req, res) {
    try {
      const { sessionId } = req.params;
      const { limit = 50, offset = 0 } = req.query;
      
      const messages = await this.supabase.getMessages({
        channel_session_id: sessionId,
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
      
      res.json({ messages });
    } catch (error) {
      logger.error('Error getting messages:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Media Management Methods
  async uploadMedia(req, res) {
    try {
      const { sessionId } = req.params;
      const { file } = req;
      
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const session = this.sessions.get(sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const mediaId = await this.sessionManager.uploadMedia(session, file);
      
      res.json({ mediaId });
    } catch (error) {
      logger.error('Error uploading media:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getMedia(req, res) {
    try {
      const { sessionId, mediaId } = req.params;
      
      const session = this.sessions.get(sessionId);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      const media = await this.sessionManager.getMedia(session, mediaId);
      
      res.set('Content-Type', media.mimetype);
      res.send(media.data);
    } catch (error) {
      logger.error('Error getting media:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Webhook Methods
  async handleWebhook(req, res) {
    try {
      const { body } = req;
      
      // Process incoming webhook
      await this.webhookManager.processWebhook(body);
      
      res.status(200).json({ status: 'ok' });
    } catch (error) {
      logger.error('Error handling webhook:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async verifyWebhook(req, res) {
    try {
      const { mode, challenge, verify_token } = req.query;
      
      if (mode === 'subscribe' && verify_token === process.env.WEBHOOK_VERIFY_TOKEN) {
        res.status(200).send(challenge);
      } else {
        res.status(403).json({ error: 'Verification failed' });
      }
    } catch (error) {
      logger.error('Error verifying webhook:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Analytics Methods
  async getSessionAnalytics(req, res) {
    try {
      const { sessionId } = req.params;
      const { startDate, endDate } = req.query;
      
      const analytics = await this.supabase.getSessionAnalytics(sessionId, {
        startDate: startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: endDate || new Date().toISOString()
      });
      
      res.json(analytics);
    } catch (error) {
      logger.error('Error getting session analytics:', error);
      res.status(500).json({ error: error.message });
    }
  }

  async getOverviewAnalytics(req, res) {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const analytics = await this.supabase.getOverviewAnalytics(userId);
      
      res.json(analytics);
    } catch (error) {
      logger.error('Error getting overview analytics:', error);
      res.status(500).json({ error: error.message });
    }
  }

  // Utility Methods
  async cleanupExpiredSessions() {
    const now = new Date();
    const expiredSessions = [];

    for (const [sessionId, session] of this.sessions) {
      const lastActivity = new Date(session.lastActivity);
      const hoursSinceActivity = (now - lastActivity) / (1000 * 60 * 60);
      
      if (hoursSinceActivity > 24) { // 24 hours
        expiredSessions.push(sessionId);
      }
    }

    for (const sessionId of expiredSessions) {
      try {
        await this.deleteSession({ params: { sessionId } }, { json: () => {} });
        logger.info(`Cleaned up expired session: ${sessionId}`);
      } catch (error) {
        logger.error(`Error cleaning up session ${sessionId}:`, error);
      }
    }
  }

  async syncSessionsWithDatabase() {
    try {
      const dbSessions = await this.supabase.getAllWhatsAppSessions();
      
      for (const dbSession of dbSessions) {
        if (!this.sessions.has(dbSession.id)) {
          // Session exists in DB but not in memory - restore it
          const session = await this.sessionManager.restoreSession(dbSession);
          if (session) {
            this.sessions.set(dbSession.id, session);
            logger.info(`Restored session from database: ${dbSession.id}`);
          }
        }
      }
    } catch (error) {
      logger.error('Error syncing sessions with database:', error);
    }
  }

  async processMessageQueue() {
    try {
      const messages = await this.messageQueue.getPendingMessages();
      
      for (const message of messages) {
        try {
          const session = this.sessions.get(message.sessionId);
          if (session) {
            await this.sessionManager.sendMessage(session, message);
            await this.messageQueue.markMessageAsSent(message.id);
          }
        } catch (error) {
          logger.error(`Error processing queued message ${message.id}:`, error);
          await this.messageQueue.markMessageAsFailed(message.id, error.message);
        }
      }
    } catch (error) {
      logger.error('Error processing message queue:', error);
    }
  }

  async start() {
    try {
      // Initialize database connection
      await this.supabase.initialize();
      
      // Load existing sessions from database
      await this.syncSessionsWithDatabase();
      
      // Start server
      this.server.listen(this.port, () => {
        logger.info(`WhatsApp service started on port ${this.port}`);
        logger.info(`Health check available at http://localhost:${this.port}/health`);
      });
    } catch (error) {
      logger.error('Failed to start WhatsApp service:', error);
      process.exit(1);
    }
  }

  async stop() {
    try {
      // Disconnect all sessions
      for (const [sessionId, session] of this.sessions) {
        await this.sessionManager.disconnectSession(session);
      }
      
      // Close server
      this.server.close(() => {
        logger.info('WhatsApp service stopped');
        process.exit(0);
      });
    } catch (error) {
      logger.error('Error stopping WhatsApp service:', error);
      process.exit(1);
    }
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  service.stop();
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  service.stop();
});

// Start the service
const service = new WhatsAppService();
service.start();

module.exports = service;