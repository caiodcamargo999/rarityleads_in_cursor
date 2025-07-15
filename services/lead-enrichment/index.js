import express from 'express';
import { createClient } from '@supabase/supabase-js';
import Queue from 'bull';
import axios from 'axios';
import pLimit from 'p-limit';
import NodeCache from 'node-cache';
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

// Initialize Express
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// Cache for enrichment data (TTL: 24 hours)
const cache = new NodeCache({ stdTTL: 86400 });

// Rate limiting for API calls
const apiLimits = {
  clearbit: pLimit(10), // 10 concurrent requests
  apollo: pLimit(5),
  linkedin: pLimit(3),
  crunchbase: pLimit(5)
};

// Enrichment queue
const enrichmentQueue = new Queue('lead-enrichment', process.env.REDIS_URL);

// Enrichment providers configuration
const providers = {
  clearbit: {
    enabled: !!process.env.CLEARBIT_API_KEY,
    apiKey: process.env.CLEARBIT_API_KEY,
    baseUrl: 'https://company.clearbit.com/v2'
  },
  apollo: {
    enabled: !!process.env.APOLLO_API_KEY,
    apiKey: process.env.APOLLO_API_KEY,
    baseUrl: 'https://api.apollo.io/v1'
  },
  linkedin: {
    enabled: !!process.env.LINKEDIN_API_KEY,
    apiKey: process.env.LINKEDIN_API_KEY,
    baseUrl: 'https://api.linkedin.com/v2'
  },
  crunchbase: {
    enabled: !!process.env.CRUNCHBASE_API_KEY,
    apiKey: process.env.CRUNCHBASE_API_KEY,
    baseUrl: 'https://api.crunchbase.com/v4'
  }
};

// API Routes
app.post('/enrich', async (req, res) => {
  try {
    const { leadId, domain, email, companyName, sources = ['all'] } = req.body;
    const userId = req.headers['user-id'];

    if (!leadId || (!domain && !email && !companyName)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Add to enrichment queue
    const job = await enrichmentQueue.add({
      leadId,
      userId,
      domain,
      email,
      companyName,
      sources
    }, {
      priority: req.body.priority || 5,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      }
    });

    res.json({ jobId: job.id, status: 'queued' });
  } catch (error) {
    logger.error('Enrich request error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/status/:jobId', async (req, res) => {
  try {
    const job = await enrichmentQueue.getJob(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const state = await job.getState();
    const progress = job.progress();

    res.json({
      jobId: job.id,
      state,
      progress,
      result: job.returnvalue,
      failedReason: job.failedReason
    });
  } catch (error) {
    logger.error('Get status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Process enrichment queue
enrichmentQueue.process(async (job) => {
  const { leadId, userId, domain, email, companyName, sources } = job.data;

  try {
    // Check cache first
    const cacheKey = `${domain || email || companyName}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      logger.info(`Using cached data for ${cacheKey}`);
      await saveEnrichmentData(leadId, cachedData);
      return cachedData;
    }

    // Determine which sources to use
    const sourcesToUse = sources.includes('all') 
      ? Object.keys(providers).filter(p => providers[p].enabled)
      : sources.filter(s => providers[s]?.enabled);

    // Parallel enrichment from multiple sources
    const enrichmentPromises = sourcesToUse.map(source => 
      enrichFromSource(source, { domain, email, companyName })
        .catch(error => {
          logger.error(`${source} enrichment error:`, error);
          return { source, error: error.message };
        })
    );

    const results = await Promise.all(enrichmentPromises);

    // Merge results from all sources
    const mergedData = mergeEnrichmentData(results);
    
    // Extract decision makers
    const decisionMakers = extractDecisionMakers(mergedData);

    // Calculate initial AI score
    const aiScore = await calculateAIScore(leadId, mergedData);

    // Save to cache
    cache.set(cacheKey, { ...mergedData, decisionMakers, aiScore });

    // Save to database
    await saveEnrichmentData(leadId, { ...mergedData, decisionMakers, aiScore });

    // Update job progress
    job.progress(100);

    return { ...mergedData, decisionMakers, aiScore };
  } catch (error) {
    logger.error('Enrichment processing error:', error);
    throw error;
  }
});

async function enrichFromSource(source, { domain, email, companyName }) {
  const provider = providers[source];
  if (!provider.enabled) return null;

  const limiter = apiLimits[source];
  
  return limiter(async () => {
    switch (source) {
      case 'clearbit':
        return await enrichFromClearbit(domain, provider);
      
      case 'apollo':
        return await enrichFromApollo(domain, email, provider);
      
      case 'linkedin':
        return await enrichFromLinkedIn(companyName, provider);
      
      case 'crunchbase':
        return await enrichFromCrunchbase(domain, companyName, provider);
      
      default:
        return null;
    }
  });
}

async function enrichFromClearbit(domain, provider) {
  if (!domain) return null;

  try {
    const response = await axios.get(`${provider.baseUrl}/companies/find`, {
      params: { domain },
      headers: { Authorization: `Bearer ${provider.apiKey}` }
    });

    return {
      source: 'clearbit',
      company: {
        name: response.data.name,
        domain: response.data.domain,
        description: response.data.description,
        industry: response.data.category?.industry,
        employees: response.data.metrics?.employees,
        revenue: response.data.metrics?.estimatedAnnualRevenue,
        location: {
          city: response.data.geo?.city,
          state: response.data.geo?.state,
          country: response.data.geo?.country
        },
        techStack: response.data.tech || [],
        tags: response.data.tags || []
      }
    };
  } catch (error) {
    logger.error('Clearbit API error:', error);
    return null;
  }
}

async function enrichFromApollo(domain, email, provider) {
  try {
    const response = await axios.post(`${provider.baseUrl}/organizations/enrich`, {
      domain,
      email
    }, {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        'X-Api-Key': provider.apiKey
      }
    });

    const org = response.data.organization;
    
    return {
      source: 'apollo',
      company: {
        name: org.name,
        domain: org.primary_domain,
        industry: org.industry,
        employees: org.estimated_num_employees,
        revenue: org.annual_revenue,
        fundingStage: org.funding_stage,
        technologies: org.technologies || []
      },
      people: response.data.people || []
    };
  } catch (error) {
    logger.error('Apollo API error:', error);
    return null;
  }
}

async function enrichFromLinkedIn(companyName, provider) {
  // LinkedIn Sales Navigator API integration
  // Note: This requires LinkedIn Sales Navigator API access
  try {
    const response = await axios.get(`${provider.baseUrl}/organizations`, {
      params: { q: companyName },
      headers: { Authorization: `Bearer ${provider.apiKey}` }
    });

    return {
      source: 'linkedin',
      company: {
        name: response.data.elements[0]?.name,
        industry: response.data.elements[0]?.industries[0],
        size: response.data.elements[0]?.staffCount,
        specialties: response.data.elements[0]?.specialties
      }
    };
  } catch (error) {
    logger.error('LinkedIn API error:', error);
    return null;
  }
}

async function enrichFromCrunchbase(domain, companyName, provider) {
  try {
    const response = await axios.get(`${provider.baseUrl}/entities/organizations`, {
      params: {
        field_ids: 'name,short_description,num_employees_enum,revenue_range,categories,headquarters_location',
        query: companyName || domain
      },
      headers: { 'X-cb-user-key': provider.apiKey }
    });

    const org = response.data.entities[0];
    
    return {
      source: 'crunchbase',
      company: {
        name: org.properties.name,
        description: org.properties.short_description,
        employees: org.properties.num_employees_enum,
        revenue: org.properties.revenue_range,
        categories: org.properties.categories,
        headquarters: org.properties.headquarters_location
      }
    };
  } catch (error) {
    logger.error('Crunchbase API error:', error);
    return null;
  }
}

function mergeEnrichmentData(results) {
  const merged = {
    company: {},
    people: [],
    technologies: [],
    sources: []
  };

  for (const result of results) {
    if (!result || result.error) continue;

    merged.sources.push(result.source);

    // Merge company data
    if (result.company) {
      Object.assign(merged.company, result.company);
    }

    // Merge people data
    if (result.people) {
      merged.people.push(...result.people);
    }

    // Merge technologies
    if (result.company?.technologies || result.company?.techStack) {
      merged.technologies.push(...(result.company.technologies || result.company.techStack));
    }
  }

  // Deduplicate arrays
  merged.people = Array.from(new Set(merged.people.map(p => JSON.stringify(p)))).map(p => JSON.parse(p));
  merged.technologies = Array.from(new Set(merged.technologies));

  return merged;
}

function extractDecisionMakers(enrichmentData) {
  const decisionMakers = [];
  const executiveTitles = ['ceo', 'cto', 'cfo', 'cmo', 'coo', 'president', 'vp', 'director', 'head'];

  for (const person of enrichmentData.people || []) {
    const title = person.title?.toLowerCase() || '';
    const isDecisionMaker = executiveTitles.some(exec => title.includes(exec));

    if (isDecisionMaker) {
      decisionMakers.push({
        name: person.name,
        title: person.title,
        email: person.email,
        phone: person.phone,
        linkedin: person.linkedin_url,
        seniority: person.seniority_level
      });
    }
  }

  return decisionMakers;
}

async function calculateAIScore(leadId, enrichmentData) {
  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/ai-score-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ leadId, enrichmentData })
    });

    const result = await response.json();
    return result.score;
  } catch (error) {
    logger.error('AI scoring error:', error);
    return 50; // Default score
  }
}

async function saveEnrichmentData(leadId, data) {
  try {
    // Save enrichment data
    await supabase
      .from('lead_enrichments')
      .upsert({
        lead_id: leadId,
        source: 'multi-source',
        enrichment_data: data,
        ai_score: data.aiScore,
        decision_makers: data.decisionMakers
      });

    // Update lead with enriched data
    await supabase
      .from('leads')
      .update({
        data: {
          enriched: true,
          company: data.company,
          technologies: data.technologies,
          aiScore: data.aiScore
        }
      })
      .eq('id', leadId);

    // Track analytics event
    await supabase
      .from('analytics_events')
      .insert({
        event_type: 'lead_enriched',
        event_data: {
          leadId,
          sources: data.sources,
          aiScore: data.aiScore
        }
      });
  } catch (error) {
    logger.error('Save enrichment error:', error);
    throw error;
  }
}

// Batch enrichment endpoint
app.post('/enrich/batch', async (req, res) => {
  try {
    const { leads, sources = ['all'] } = req.body;
    const userId = req.headers['user-id'];

    if (!leads || !Array.isArray(leads)) {
      return res.status(400).json({ error: 'Invalid leads array' });
    }

    const jobs = [];
    for (const lead of leads) {
      const job = await enrichmentQueue.add({
        ...lead,
        userId,
        sources
      }, {
        priority: 3,
        attempts: 3
      });
      jobs.push(job.id);
    }

    res.json({ jobIds: jobs, count: jobs.length });
  } catch (error) {
    logger.error('Batch enrich error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    providers: Object.keys(providers).filter(p => providers[p].enabled),
    queueSize: enrichmentQueue.count()
  });
});

// Start server
const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  logger.info(`Lead enrichment service running on port ${PORT}`);
  logger.info(`Enabled providers: ${Object.keys(providers).filter(p => providers[p].enabled).join(', ')}`);
});