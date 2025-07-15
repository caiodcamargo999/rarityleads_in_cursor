import express from 'express';
import { WebSocketServer } from 'ws';
import { createClient } from '@supabase/supabase-js';
import Queue from 'bull';
import Redis from 'redis';
import cors from 'cors';
import helmet from 'helmet';
import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Initialize Redis
const redis = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

await redis.connect();

// Initialize Express
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Message queue for each channel
const messageQueues = {
  whatsapp: new Queue('whatsapp-messages', process.env.REDIS_URL),
  instagram: new Queue('instagram-messages', process.env.REDIS_URL),
  facebook: new Queue('facebook-messages', process.env.REDIS_URL),
  x: new Queue('x-messages', process.env.REDIS_URL),
  linkedin: new Queue('linkedin-messages', process.env.REDIS_URL)
};

// WebSocket server for real-time updates
const wss = new WebSocketServer({ port: 8080 });

// Connected clients
const clients = new Map();

wss.on('connection', (ws, req) => {
  const userId = req.headers['user-id'];
  if (!userId) {
    ws.close();
    return;
  }

  clients.set(userId, ws);
  logger.info(`Client connected: ${userId}`);

  ws.on('close', () => {
    clients.delete(userId);
    logger.info(`Client disconnected: ${userId}`);
  });

  ws.on('message', async (data) => {
    try {
      const message = JSON.parse(data);
      await handleIncomingMessage(userId, message);
    } catch (error) {
      logger.error('WebSocket message error:', error);
      ws.send(JSON.stringify({ error: error.message }));
    }
  });
});

// REST API endpoints
app.post('/api/messages/send', async (req, res) => {
  try {
    const { channel, recipients, content, campaignId, templateId } = req.body;
    const userId = req.headers['user-id'];

    // Validate request
    if (!channel || !recipients || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Add messages to queue
    const messageIds = [];
    for (const recipient of recipients) {
      const messageData = {
        userId,
        recipient,
        content,
        campaignId,
        templateId,
        timestamp: new Date().toISOString()
      };

      const job = await messageQueues[channel].add(messageData, {
        priority: content.priority || 5,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000
        }
      });

      messageIds.push(job.id);

      // Store in database
      await supabase
        .from('message_queue')
        .insert({
          user_id: userId,
          channel,
          recipient_id: recipient.id,
          message_content: content,
          priority: content.priority || 5,
          status: 'queued'
        });
    }

    res.json({ success: true, messageIds });
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/messages/status/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.headers['user-id'];

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('id', messageId)
      .eq('user_id', userId)
      .single();

    if (error) throw error;

    res.json(data);
  } catch (error) {
    logger.error('Get message status error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/conversations/:leadId', async (req, res) => {
  try {
    const { leadId } = req.params;
    const userId = req.headers['user-id'];

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('lead_id', leadId)
      .eq('user_id', userId)
      .order('timestamp', { ascending: true });

    if (error) throw error;

    res.json(data);
  } catch (error) {
    logger.error('Get conversation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Process messages from queues
Object.entries(messageQueues).forEach(([channel, queue]) => {
  queue.process(async (job) => {
    const { userId, recipient, content, campaignId } = job.data;

    try {
      // Get channel session
      const session = await getChannelSession(userId, channel, recipient);
      
      if (!session || session.status !== 'active') {
        throw new Error(`No active ${channel} session found`);
      }

      // Send message through appropriate channel service
      const result = await sendChannelMessage(channel, session, recipient, content);

      // Update message status
      await supabase
        .from('messages')
        .insert({
          user_id: userId,
          lead_id: recipient.leadId,
          direction: 'sent',
          content,
          status: 'delivered',
          timestamp: new Date().toISOString()
        });

      // Send real-time update
      const client = clients.get(userId);
      if (client) {
        client.send(JSON.stringify({
          type: 'message_sent',
          channel,
          recipient,
          messageId: result.messageId,
          status: 'delivered'
        }));
      }

      // Track analytics event
      await supabase
        .from('analytics_events')
        .insert({
          user_id: userId,
          event_type: 'message_sent',
          event_data: {
            channel,
            campaignId,
            success: true
          },
          channel,
          campaign_id: campaignId
        });

      return result;
    } catch (error) {
      logger.error(`${channel} message error:`, error);

      // Update error status
      await supabase
        .from('message_queue')
        .update({
          status: 'failed',
          error_log: { error: error.message, attempts: job.attemptsMade }
        })
        .eq('id', job.id);

      throw error;
    }
  });
});

async function getChannelSession(userId, channel, recipient) {
  if (channel === 'whatsapp') {
    const { data } = await supabase
      .from('whatsapp_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    return data;
  } else {
    const { data } = await supabase
      .from('social_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('platform', channel)
      .eq('status', 'active')
      .single();
    return data;
  }
}

async function sendChannelMessage(channel, session, recipient, content) {
  // Route to appropriate channel service
  const channelServices = {
    whatsapp: 'http://localhost:3001',
    instagram: 'http://localhost:3002',
    facebook: 'http://localhost:3003',
    x: 'http://localhost:3004',
    linkedin: 'http://localhost:3005'
  };

  const serviceUrl = channelServices[channel];
  
  try {
    const response = await fetch(`${serviceUrl}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session,
        recipient,
        content
      })
    });

    if (!response.ok) {
      throw new Error(`Channel service error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    logger.error(`Error sending to ${channel} service:`, error);
    throw error;
  }
}

async function handleIncomingMessage(userId, message) {
  const { channel, from, content, timestamp } = message;

  // Find lead by channel identifier
  const { data: lead } = await supabase
    .from('leads')
    .select('*')
    .eq('user_id', userId)
    .eq(`data->>${channel}_id`, from)
    .single();

  if (!lead) {
    // Create new lead if not exists
    const { data: newLead } = await supabase
      .from('leads')
      .insert({
        user_id: userId,
        data: { [`${channel}_id`]: from, source: channel },
        status: 'new'
      })
      .select()
      .single();

    lead = newLead;
  }

  // Store message
  await supabase
    .from('messages')
    .insert({
      user_id: userId,
      lead_id: lead.id,
      direction: 'received',
      content,
      timestamp
    });

  // Send real-time update
  const client = clients.get(userId);
  if (client) {
    client.send(JSON.stringify({
      type: 'message_received',
      channel,
      leadId: lead.id,
      from,
      content,
      timestamp
    }));
  }

  // Track analytics
  await supabase
    .from('analytics_events')
    .insert({
      user_id: userId,
      event_type: 'message_received',
      event_data: { channel, leadId: lead.id },
      channel,
      lead_id: lead.id
    });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    queues: Object.keys(messageQueues),
    connectedClients: clients.size
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Message orchestrator running on port ${PORT}`);
  logger.info(`WebSocket server running on port 8080`);
});