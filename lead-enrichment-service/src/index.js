import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { WebSocketServer } from 'ws';
import pino from 'pino';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Redis from 'redis';
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
const PORT = process.env.PORT || 3006;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));

// WebSocket server
const wss = new WebSocketServer({ port: process.env.WS_PORT || 3007 });

// Redis client
const redisClient = Redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.on('connect', () => logger.info('Connected to Redis'));

// Rate limiter
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'lead_enrichment',
  points: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  duration: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || token !== process.env.LEAD_ENRICHMENT_SERVICE_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};

// Apply authentication to all routes
app.use(authenticateToken);

// API Clients
const apolloClient = axios.create({
  baseURL: 'https://api.apollo.io/v1',
  headers: {
    'X-Api-Key': process.env.APOLLO_API_KEY,
    'Content-Type': 'application/json'
  }
});

const clearbitClient = axios.create({
  baseURL: 'https://company.clearbit.com/v2',
  headers: {
    'Authorization': `Bearer ${process.env.CLEARBIT_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

const crunchbaseClient = axios.create({
  baseURL: 'https://api.crunchbase.com/v3.1',
  headers: {
    'X-cb-user-key': process.env.CRUNCHBASE_API_KEY,
    'Content-Type': 'application/json'
  }
});

// Helper function to cache data
const cacheData = async (key, data, ttl = 3600) => {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
    logger.info(`Data cached for key: ${key}`);
  } catch (error) {
    logger.error(`Error caching data for key ${key}:`, error);
  }
};

// Helper function to get cached data
const getCachedData = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error(`Error getting cached data for key ${key}:`, error);
    return null;
  }
};

// Helper function to broadcast to WebSocket clients
const broadcastToClients = (event, data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ event, data }));
    }
  });
};

// Apollo.io enrichment
const enrichWithApollo = async (email, domain) => {
  try {
    const cacheKey = `apollo:${email || domain}`;
    const cached = await getCachedData(cacheKey);
    if (cached) return cached;

    const response = await apolloClient.post('/people/search', {
      api_key: process.env.APOLLO_API_KEY,
      page: 1,
      per_page: 1,
      ...(email && { email }),
      ...(domain && { organization_domains: [domain] })
    });

    const data = response.data?.people?.[0] || null;
    if (data) {
      await cacheData(cacheKey, data);
    }
    return data;
  } catch (error) {
    logger.error('Apollo enrichment error:', error.message);
    return null;
  }
};

// Clearbit enrichment
const enrichWithClearbit = async (domain) => {
  try {
    const cacheKey = `clearbit:${domain}`;
    const cached = await getCachedData(cacheKey);
    if (cached) return cached;

    const response = await clearbitClient.get(`/companies/find?domain=${domain}`);
    const data = response.data;
    
    if (data) {
      await cacheData(cacheKey, data);
    }
    return data;
  } catch (error) {
    logger.error('Clearbit enrichment error:', error.message);
    return null;
  }
};

// Crunchbase enrichment
const enrichWithCrunchbase = async (companyName) => {
  try {
    const cacheKey = `crunchbase:${companyName}`;
    const cached = await getCachedData(cacheKey);
    if (cached) return cached;

    const response = await crunchbaseClient.get(`/organizations?name=${encodeURIComponent(companyName)}`);
    const data = response.data?.data?.items?.[0] || null;
    
    if (data) {
      await cacheData(cacheKey, data);
    }
    return data;
  } catch (error) {
    logger.error('Crunchbase enrichment error:', error.message);
    return null;
  }
};

// AI scoring function
const calculateAIScore = (enrichedData) => {
  let score = 50; // Base score

  // Company size scoring
  if (enrichedData.companySize) {
    if (enrichedData.companySize === '1-10') score += 10;
    else if (enrichedData.companySize === '11-50') score += 15;
    else if (enrichedData.companySize === '51-200') score += 20;
    else if (enrichedData.companySize === '201-1000') score += 25;
    else if (enrichedData.companySize === '1000+') score += 30;
  }

  // Revenue scoring
  if (enrichedData.annualRevenue) {
    if (enrichedData.annualRevenue === '$1M-$10M') score += 10;
    else if (enrichedData.annualRevenue === '$10M-$50M') score += 15;
    else if (enrichedData.annualRevenue === '$50M-$100M') score += 20;
    else if (enrichedData.annualRevenue === '$100M+') score += 25;
  }

  // Role scoring
  if (enrichedData.jobTitle) {
    const title = enrichedData.jobTitle.toLowerCase();
    if (title.includes('ceo') || title.includes('founder') || title.includes('president')) score += 20;
    else if (title.includes('vp') || title.includes('director') || title.includes('head')) score += 15;
    else if (title.includes('manager') || title.includes('lead')) score += 10;
  }

  // Industry scoring
  if (enrichedData.industry) {
    const industry = enrichedData.industry.toLowerCase();
    if (industry.includes('technology') || industry.includes('software')) score += 15;
    else if (industry.includes('marketing') || industry.includes('advertising')) score += 10;
    else if (industry.includes('consulting') || industry.includes('services')) score += 5;
  }

  return Math.min(score, 100); // Cap at 100
};

// Main enrichment endpoint
app.post('/enrich', async (req, res) => {
  try {
    const { email, domain, companyName, description } = req.body;
    
    if (!email && !domain && !companyName) {
      return res.status(400).json({ error: 'At least one identifier is required' });
    }

    // Rate limiting
    await rateLimiter.consume(req.ip);

    const enrichmentId = uuidv4();
    broadcastToClients('enrichment_started', { id: enrichmentId, status: 'started' });

    // Parallel enrichment from multiple sources
    const [apolloData, clearbitData, crunchbaseData] = await Promise.allSettled([
      enrichWithApollo(email, domain),
      domain ? enrichWithClearbit(domain) : null,
      companyName ? enrichWithCrunchbase(companyName) : null
    ]);

    // Merge and deduplicate data
    const enrichedData = {
      id: enrichmentId,
      email: email || apolloData.value?.email,
      fullName: apolloData.value?.name || apolloData.value?.first_name + ' ' + apolloData.value?.last_name,
      jobTitle: apolloData.value?.title || apolloData.value?.job_title,
      companyName: companyName || clearbitData.value?.name || apolloData.value?.organization_name,
      location: apolloData.value?.location || apolloData.value?.city + ', ' + apolloData.value?.state,
      phone: apolloData.value?.phone,
      linkedinUrl: apolloData.value?.linkedin_url,
      companySize: clearbitData.value?.metrics?.employees,
      annualRevenue: clearbitData.value?.metrics?.annualRevenue,
      industry: clearbitData.value?.category?.industry || apolloData.value?.organization_industry,
      website: domain || clearbitData.value?.domain,
      source: 'multi-source-enrichment',
      enrichedAt: new Date().toISOString()
    };

    // Calculate AI score
    enrichedData.aiScore = calculateAIScore(enrichedData);

    // Determine priority
    if (enrichedData.aiScore >= 80) enrichedData.priority = 'high';
    else if (enrichedData.aiScore >= 60) enrichedData.priority = 'medium';
    else enrichedData.priority = 'low';

    // Suggest contact strategy
    enrichedData.suggestedContactStrategy = {
      bestChannel: enrichedData.linkedinUrl ? 'linkedin' : 'email',
      bestTime: '9:00 AM - 11:00 AM',
      bestDay: 'Tuesday - Thursday',
      messageTemplate: `Hi ${enrichedData.fullName?.split(' ')[0] || 'there'}, I noticed ${enrichedData.companyName} is in the ${enrichedData.industry} space. Would you be interested in discussing how we can help scale your ${description ? 'lead generation' : 'business'}?`
    };

    broadcastToClients('enrichment_completed', { id: enrichmentId, data: enrichedData });

    res.json({
      success: true,
      data: enrichedData,
      sources: {
        apollo: apolloData.status === 'fulfilled',
        clearbit: clearbitData.status === 'fulfilled',
        crunchbase: crunchbaseData.status === 'fulfilled'
      }
    });

  } catch (error) {
    if (error.name === 'RateLimiterError') {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    
    logger.error('Enrichment error:', error);
    res.status(500).json({ error: 'Enrichment failed', details: error.message });
  }
});

// Bulk enrichment endpoint
app.post('/enrich/bulk', async (req, res) => {
  try {
    const { leads } = req.body;
    
    if (!Array.isArray(leads) || leads.length === 0) {
      return res.status(400).json({ error: 'Leads array is required' });
    }

    if (leads.length > 50) {
      return res.status(400).json({ error: 'Maximum 50 leads per bulk enrichment' });
    }

    // Rate limiting
    await rateLimiter.consume(req.ip, leads.length);

    const results = [];
    const batchId = uuidv4();

    broadcastToClients('bulk_enrichment_started', { id: batchId, total: leads.length });

    for (let i = 0; i < leads.length; i++) {
      const lead = leads[i];
      try {
        const enrichedData = await enrichLead(lead);
        results.push({ ...enrichedData, originalLead: lead });
        
        broadcastToClients('bulk_enrichment_progress', { 
          id: batchId, 
          completed: i + 1, 
          total: leads.length 
        });
      } catch (error) {
        results.push({ error: error.message, originalLead: lead });
      }
    }

    broadcastToClients('bulk_enrichment_completed', { id: batchId, results });

    res.json({
      success: true,
      batchId,
      results,
      summary: {
        total: leads.length,
        successful: results.filter(r => !r.error).length,
        failed: results.filter(r => r.error).length
      }
    });

  } catch (error) {
    if (error.name === 'RateLimiterError') {
      return res.status(429).json({ error: 'Rate limit exceeded' });
    }
    
    logger.error('Bulk enrichment error:', error);
    res.status(500).json({ error: 'Bulk enrichment failed', details: error.message });
  }
});

// Helper function for single lead enrichment
const enrichLead = async (lead) => {
  const { email, domain, companyName } = lead;
  
  const [apolloData, clearbitData, crunchbaseData] = await Promise.allSettled([
    enrichWithApollo(email, domain),
    domain ? enrichWithClearbit(domain) : null,
    companyName ? enrichWithCrunchbase(companyName) : null
  ]);

  const enrichedData = {
    email: email || apolloData.value?.email,
    fullName: apolloData.value?.name || apolloData.value?.first_name + ' ' + apolloData.value?.last_name,
    jobTitle: apolloData.value?.title || apolloData.value?.job_title,
    companyName: companyName || clearbitData.value?.name || apolloData.value?.organization_name,
    location: apolloData.value?.location || apolloData.value?.city + ', ' + apolloData.value?.state,
    phone: apolloData.value?.phone,
    linkedinUrl: apolloData.value?.linkedin_url,
    companySize: clearbitData.value?.metrics?.employees,
    annualRevenue: clearbitData.value?.metrics?.annualRevenue,
    industry: clearbitData.value?.category?.industry || apolloData.value?.organization_industry,
    website: domain || clearbitData.value?.domain,
    source: 'multi-source-enrichment',
    enrichedAt: new Date().toISOString()
  };

  enrichedData.aiScore = calculateAIScore(enrichedData);
  
  if (enrichedData.aiScore >= 80) enrichedData.priority = 'high';
  else if (enrichedData.aiScore >= 60) enrichedData.priority = 'medium';
  else enrichedData.priority = 'low';

  return enrichedData;
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'lead-enrichment-service',
    version: '1.0.0'
  });
});

// Cache status endpoint
app.get('/cache/status', async (req, res) => {
  try {
    const info = await redisClient.info('memory');
    res.json({
      cache: 'redis',
      status: 'connected',
      info: info
    });
  } catch (error) {
    res.status(500).json({ error: 'Cache status check failed' });
  }
});

// WebSocket connection handling
wss.on('connection', (ws) => {
  logger.info('WebSocket client connected');
  
  ws.on('close', () => {
    logger.info('WebSocket client disconnected');
  });
});

// Start server
const startServer = async () => {
  try {
    await redisClient.connect();
    
    app.listen(PORT, () => {
      logger.info(`Lead Enrichment Service running on port ${PORT}`);
      logger.info(`WebSocket server running on port ${process.env.WS_PORT || 3007}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await redisClient.quit();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await redisClient.quit();
  process.exit(0);
});

startServer(); 