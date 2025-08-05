import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { WebSocketServer } from 'ws';
import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Redis from 'redis';
import Queue from 'bull';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));

// WebSocket server
const wss = new WebSocketServer({ port: process.env.WS_PORT || 3008 });

// Redis client
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Connected to Redis'));

// Bull queues
const messageQueue = new Queue('message-queue', process.env.REDIS_URL || 'redis://localhost:6379');
const enrichmentQueue = new Queue('enrichment-queue', process.env.REDIS_URL || 'redis://localhost:6379');
const notificationQueue = new Queue('notification-queue', process.env.REDIS_URL || 'redis://localhost:6379');

// Service configurations
const services = {
  whatsapp: {
    url: process.env.WHATSAPP_SERVICE_URL || 'http://localhost:3001',
    token: process.env.WHATSAPP_SERVICE_TOKEN
  },
  enrichment: {
    url: process.env.ENRICHMENT_SERVICE_URL || 'http://localhost:3006',
    token: process.env.LEAD_ENRICHMENT_SERVICE_TOKEN
  },
  instagram: {
    url: process.env.INSTAGRAM_SERVICE_URL || 'http://localhost:3002',
    token: process.env.INSTAGRAM_SERVICE_TOKEN
  },
  facebook: {
    url: process.env.FACEBOOK_SERVICE_URL || 'http://localhost:3003',
    token: process.env.FACEBOOK_SERVICE_TOKEN
  },
  linkedin: {
    url: process.env.LINKEDIN_SERVICE_URL || 'http://localhost:3004',
    token: process.env.LINKEDIN_SERVICE_TOKEN
  },
  twitter: {
    url: process.env.TWITTER_SERVICE_URL || 'http://localhost:3005',
    token: process.env.TWITTER_SERVICE_TOKEN
  }
};

// Rate limiter
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'message_orchestrator',
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || token !== process.env.MESSAGE_ORCHESTRATOR_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

// Apply authentication to all routes
app.use(authenticateToken);

// Helper function to broadcast to WebSocket clients
const broadcastToClients = (event, data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ event, data }));
    }
  });
};

// Message routing function
const routeMessage = async (message) => {
  const { channel, recipient, content, type = 'text', priority = 'normal' } = message;
  
  let targetService = null;
  
  switch (channel.toLowerCase()) {
    case 'whatsapp':
      targetService = services.whatsapp;
      break;
    case 'instagram':
      targetService = services.instagram;
      break;
    case 'facebook':
      targetService = services.facebook;
      break;
    case 'linkedin':
      targetService = services.linkedin;
      break;
    case 'twitter':
    case 'x':
      targetService = services.twitter;
      break;
    default:
      throw new Error(`Unsupported channel: ${channel}`);
  }

  try {
    const response = await axios.post(`${targetService.url}/send-message`, {
      recipient,
      content,
      type,
      priority
    }, {
      headers: {
        'Authorization': `Bearer ${targetService.token}`,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    return response.data;
  } catch (error) {
    logger.error(`Error sending message via ${channel}:`, error.message);
    throw error;
  }
};

// Queue processors
messageQueue.process(async (job) => {
  const { message } = job.data;
  logger.info(`Processing message job: ${job.id}`);
  
  try {
    const result = await routeMessage(message);
    
    // Send notification
    await notificationQueue.add('message_sent', {
      userId: message.userId,
      messageId: result.messageId,
      channel: message.channel,
      status: 'sent',
      timestamp: new Date().toISOString()
    });
    
    broadcastToClients('message_sent', {
      messageId: result.messageId,
      channel: message.channel,
      status: 'sent'
    });
    
    return result;
  } catch (error) {
    logger.error(`Message processing failed: ${error.message}`);
    
    // Send failure notification
    await notificationQueue.add('message_failed', {
      userId: message.userId,
      messageId: job.id,
      channel: message.channel,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    
    broadcastToClients('message_failed', {
      messageId: job.id,
      channel: message.channel,
      error: error.message
    });
    
    throw error;
  }
});

enrichmentQueue.process(async (job) => {
  const { leadData } = job.data;
  logger.info(`Processing enrichment job: ${job.id}`);
  
  try {
    const response = await axios.post(`${services.enrichment.url}/enrich`, leadData, {
      headers: {
        'Authorization': `Bearer ${services.enrichment.token}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000
    });
    
    const enrichedData = response.data.data;
    
    // Send notification
    await notificationQueue.add('enrichment_completed', {
      userId: leadData.userId,
      leadId: enrichedData.id,
      aiScore: enrichedData.aiScore,
      priority: enrichedData.priority,
      timestamp: new Date().toISOString()
    });
    
    broadcastToClients('enrichment_completed', {
      leadId: enrichedData.id,
      aiScore: enrichedData.aiScore,
      priority: enrichedData.priority
    });
    
    return enrichedData;
  } catch (error) {
    logger.error(`Enrichment processing failed: ${error.message}`);
    
    await notificationQueue.add('enrichment_failed', {
      userId: leadData.userId,
      leadId: job.id,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    
    broadcastToClients('enrichment_failed', {
      leadId: job.id,
      error: error.message
    });
    
    throw error;
  }
});

// Send message endpoint
app.post('/send-message', async (req, res) => {
  try {
    const { channel, recipient, content, type, priority, userId } = req.body;
    
    if (!channel || !recipient || !content) {
      return res.status(400).json({ error: 'Channel, recipient, and content are required' });
    }

    // Rate limiting
    await rateLimiter.consume(req.ip);

    const message = {
      id: uuidv4(),
      channel,
      recipient,
      content,
      type: type || 'text',
      priority: priority || 'normal',
      userId,
      timestamp: new Date().toISOString()
    };

    // Add to queue
    const job = await messageQueue.add('send_message', { message }, {
      priority: priority === 'high' ? 1 : priority === 'medium' ? 2 : 3,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    });

    broadcastToClients('message_queued', {
      messageId: message.id,
      jobId: job.id,
      channel,
      status: 'queued'
    });

    res.json({
      success: true,
      messageId: message.id,
      jobId: job.id,
      status: 'queued'
    });

  } catch (error) {
    if (error.name === 'RateLimiterError') {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    
    logger.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message', details: error.message });
  }
});

// Bulk message endpoint
app.post('/send-bulk-messages', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (messages.length > 100) {
      return res.status(400).json({ error: 'Maximum 100 messages per bulk send' });
    }

    // Rate limiting
    await rateLimiter.consume(req.ip, messages.length);

    const batchId = uuidv4();
    const jobs = [];

    for (const messageData of messages) {
      const message = {
        id: uuidv4(),
        ...messageData,
        timestamp: new Date().toISOString()
      };

      const job = await messageQueue.add('send_message', { message }, {
        priority: messageData.priority === 'high' ? 1 : messageData.priority === 'medium' ? 2 : 3,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        }
      });

      jobs.push({ messageId: message.id, jobId: job.id });
    }

    broadcastToClients('bulk_messages_queued', {
      batchId,
      totalMessages: messages.length,
      jobs
    });

    res.json({
      success: true,
      batchId,
      totalMessages: messages.length,
      jobs
    });

  } catch (error) {
    if (error.name === 'RateLimiterError') {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    
    logger.error('Bulk send error:', error);
    res.status(500).json({ error: 'Failed to send bulk messages', details: error.message });
  }
});

// Enrich lead endpoint
app.post('/enrich-lead', async (req, res) => {
  try {
    const { leadData } = req.body;
    
    if (!leadData) {
      return res.status(400).json({ error: 'Lead data is required' });
    }

    // Rate limiting
    await rateLimiter.consume(req.ip);

    const job = await enrichmentQueue.add('enrich_lead', { leadData }, {
      attempts: 2,
      backoff: {
        type: 'exponential',
        delay: 5000
      }
    });

    broadcastToClients('enrichment_queued', {
      jobId: job.id,
      status: 'queued'
    });

    res.json({
      success: true,
      jobId: job.id,
      status: 'queued'
    });

  } catch (error) {
    if (error.name === 'RateLimiterError') {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    
    logger.error('Enrich lead error:', error);
    res.status(500).json({ error: 'Failed to enrich lead', details: error.message });
  }
});

// Get queue status
app.get('/queue/status', async (req, res) => {
  try {
    const [messageQueueStatus, enrichmentQueueStatus, notificationQueueStatus] = await Promise.all([
      messageQueue.getJobCounts(),
      enrichmentQueue.getJobCounts(),
      notificationQueue.getJobCounts()
    ]);

    res.json({
      messageQueue: messageQueueStatus,
      enrichmentQueue: enrichmentQueueStatus,
      notificationQueue: notificationQueueStatus
    });
  } catch (error) {
    logger.error('Queue status error:', error);
    res.status(500).json({ error: 'Failed to get queue status' });
  }
});

// Get service health
app.get('/health', async (req, res) => {
  try {
    const healthChecks = await Promise.allSettled([
      axios.get(`${services.whatsapp.url}/health`),
      axios.get(`${services.enrichment.url}/health`),
      redisClient.ping()
    ]);

    const servicesHealth = {
      whatsapp: healthChecks[0].status === 'fulfilled',
      enrichment: healthChecks[1].status === 'fulfilled',
      redis: healthChecks[2].status === 'fulfilled'
    };

    const allHealthy = Object.values(servicesHealth).every(healthy => healthy);

    res.json({
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      service: 'message-orchestrator',
      version: '1.0.0',
      services: servicesHealth
    });
  } catch (error) {
    logger.error('Health check error:', error);
    res.status(500).json({ error: 'Health check failed' });
  }
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  logger.info('WebSocket client connected');
  
  // Send initial connection message
  ws.send(JSON.stringify({
    event: 'connected',
    data: {
      timestamp: new Date().toISOString(),
      service: 'message-orchestrator'
    }
  }));
  
  ws.on('close', () => {
    logger.info('WebSocket client disconnected');
  });
});

// Queue event listeners
messageQueue.on('completed', (job, result) => {
  logger.info(`Message job ${job.id} completed`);
});

messageQueue.on('failed', (job, err) => {
  logger.error(`Message job ${job.id} failed:`, err.message);
});

enrichmentQueue.on('completed', (job, result) => {
  logger.info(`Enrichment job ${job.id} completed`);
});

enrichmentQueue.on('failed', (job, err) => {
  logger.error(`Enrichment job ${job.id} failed:`, err.message);
});

// Start server
const startServer = async () => {
  try {
    await redisClient.connect();
    
    app.listen(PORT, () => {
      logger.info(`Message Orchestrator running on port ${PORT}`);
      logger.info(`WebSocket server running on port ${process.env.WS_PORT || 3008}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await messageQueue.close();
  await enrichmentQueue.close();
  await notificationQueue.close();
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await messageQueue.close();
  await enrichmentQueue.close();
  await notificationQueue.close();
  await redisClient.quit();
  process.exit(0);
});

startServer(); 