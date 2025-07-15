# 🚀 Rarity Leads - Deployment Guide

## Architecture Overview

Rarity Leads is built with a microservices architecture for infinite scale and full control:

- **Frontend**: Next.js (App Router) hosted on Netlify
- **Backend**: Supabase (Auth, Database, Storage, Edge Functions) + Local Node.js microservices
- **Microservices**:
  - Message Orchestrator (Port 3000)
  - WhatsApp Service (Port 3001)
  - Instagram Service (Port 3002)
  - Facebook Service (Port 3003)
  - X (Twitter) Service (Port 3004)
  - LinkedIn Service (Port 3005)
  - Lead Enrichment Service (Port 3006)

## Prerequisites

- Node.js 18+ and npm
- Redis server (for message queuing)
- Supabase account
- Netlify account
- Domain name (optional)

## Step 1: Supabase Setup

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Save your project URL and keys:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for backend services)

### 1.2 Database Setup
1. Open SQL Editor in Supabase Dashboard
2. Run the migration files in order:
```sql
-- Run each file in the SQL editor:
-- 1. /supabase/schema/001_create_tables.sql
-- 2. /supabase/schema/002_enable_rls.sql
-- 3. /supabase/schema/003_create_policies.sql
-- 4. /supabase/schema/004_enhanced_tables.sql
```

### 1.3 Authentication Setup
1. Go to Authentication > Providers
2. Enable Email provider
3. Enable Google OAuth:
   - Add your Google OAuth credentials
   - Set redirect URLs:
     - `http://localhost:3000/auth/callback`
     - `https://your-domain.netlify.app/auth/callback`

### 1.4 Edge Functions Setup
Deploy the AI scoring function:
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Deploy edge functions
supabase functions deploy ai-score-lead --project-ref your-project-ref
```

## Step 2: Environment Configuration

### 2.1 Frontend (.env.local)
Create `.env.local` in the root directory:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Microservices URLs (for production, use your deployed URLs)
NEXT_PUBLIC_MESSAGE_ORCHESTRATOR_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_SERVICE_URL=http://localhost:3001
NEXT_PUBLIC_ENRICHMENT_SERVICE_URL=http://localhost:3006

# AI Provider (choose one)
NEXT_PUBLIC_AI_PROVIDER=openai # or 'anthropic'
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-key
NEXT_PUBLIC_ANTHROPIC_API_KEY=your-anthropic-key
```

### 2.2 Microservices (.env files)
Create `.env` in each service directory:

**services/message-orchestrator/.env**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
REDIS_URL=redis://localhost:6379
PORT=3000
```

**services/whatsapp-service/.env**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
FRONTEND_URL=http://localhost:3000
PORT=3001
```

**services/lead-enrichment/.env**
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
REDIS_URL=redis://localhost:6379
PORT=3006

# Enrichment APIs (optional - add the ones you have)
CLEARBIT_API_KEY=your-clearbit-key
APOLLO_API_KEY=your-apollo-key
LINKEDIN_API_KEY=your-linkedin-key
CRUNCHBASE_API_KEY=your-crunchbase-key
```

## Step 3: Local Development

### 3.1 Install Dependencies
```bash
# Frontend
npm install

# Each microservice
cd services/message-orchestrator && npm install
cd ../whatsapp-service && npm install
cd ../lead-enrichment && npm install
```

### 3.2 Start Redis
```bash
# macOS
brew services start redis

# Linux
sudo systemctl start redis

# Docker
docker run -d -p 6379:6379 redis:alpine
```

### 3.3 Start Services
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Message Orchestrator
cd services/message-orchestrator && npm start

# Terminal 3: WhatsApp Service
cd services/whatsapp-service && npm start

# Terminal 4: Lead Enrichment
cd services/lead-enrichment && npm start
```

## Step 4: Production Deployment

### 4.1 Frontend Deployment (Netlify)

1. **Connect GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/rarity-leads.git
   git push -u origin main
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect your GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Add environment variables from `.env.local`

3. **Configure Domain**
   - Add custom domain in Netlify settings
   - Update DNS records

### 4.2 Microservices Deployment Options

#### Option A: VPS Deployment (Recommended)
1. **Setup VPS** (DigitalOcean, Linode, AWS EC2)
   ```bash
   # SSH into your server
   ssh root@your-server-ip

   # Install Node.js and PM2
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   npm install -g pm2

   # Install Redis
   sudo apt-get install redis-server
   ```

2. **Deploy Services**
   ```bash
   # Clone repository
   git clone https://github.com/your-username/rarity-leads.git
   cd rarity-leads

   # Setup each service
   cd services/message-orchestrator
   npm install
   pm2 start index.js --name message-orchestrator

   cd ../whatsapp-service
   npm install
   pm2 start index.js --name whatsapp-service

   cd ../lead-enrichment
   npm install
   pm2 start index.js --name lead-enrichment

   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

3. **Setup Nginx Reverse Proxy**
   ```nginx
   server {
       listen 80;
       server_name api.yourdomain.com;

       location /orchestrator/ {
           proxy_pass http://localhost:3000/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location /whatsapp/ {
           proxy_pass http://localhost:3001/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
       }

       location /enrichment/ {
           proxy_pass http://localhost:3006/;
       }
   }
   ```

#### Option B: Docker Deployment
1. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     redis:
       image: redis:alpine
       ports:
         - "6379:6379"
     
     message-orchestrator:
       build: ./services/message-orchestrator
       ports:
         - "3000:3000"
       environment:
         - REDIS_URL=redis://redis:6379
       depends_on:
         - redis
     
     whatsapp-service:
       build: ./services/whatsapp-service
       ports:
         - "3001:3001"
       volumes:
         - ./whatsapp-sessions:/app/sessions
     
     lead-enrichment:
       build: ./services/lead-enrichment
       ports:
         - "3006:3006"
       environment:
         - REDIS_URL=redis://redis:6379
       depends_on:
         - redis
   ```

2. **Deploy with Docker**
   ```bash
   docker-compose up -d
   ```

### 4.3 Update Frontend Environment Variables
Update your Netlify environment variables to point to production services:
```env
NEXT_PUBLIC_MESSAGE_ORCHESTRATOR_URL=https://api.yourdomain.com/orchestrator
NEXT_PUBLIC_WHATSAPP_SERVICE_URL=https://api.yourdomain.com/whatsapp
NEXT_PUBLIC_ENRICHMENT_SERVICE_URL=https://api.yourdomain.com/enrichment
```

## Step 5: Post-Deployment

### 5.1 SSL Configuration
```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d api.yourdomain.com
```

### 5.2 Monitoring Setup
```bash
# PM2 Monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30

# Setup monitoring dashboard
pm2 web
```

### 5.3 Backup Configuration
```bash
# Automated Supabase backups are included
# For session data backup:
0 2 * * * tar -czf /backups/whatsapp-sessions-$(date +\%Y\%m\%d).tar.gz /app/whatsapp-sessions
```

## Step 6: Testing

### 6.1 Health Checks
```bash
# Frontend
curl https://your-domain.netlify.app

# Message Orchestrator
curl http://api.yourdomain.com/orchestrator/health

# WhatsApp Service
curl http://api.yourdomain.com/whatsapp/health

# Lead Enrichment
curl http://api.yourdomain.com/enrichment/health
```

### 6.2 API Testing
Use the provided Postman collection or test with curl:
```bash
# Create API key in dashboard first
curl -X POST https://api.yourdomain.com/orchestrator/api/leads \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"company_name": "Test Corp", "domain": "test.com"}'
```

## Troubleshooting

### Common Issues

1. **WhatsApp QR Code not showing**
   - Check WebSocket connection on port 3011
   - Verify CORS settings in whatsapp-service

2. **Enrichment not working**
   - Verify Redis is running
   - Check API keys are set correctly
   - Monitor logs: `pm2 logs lead-enrichment`

3. **Messages not sending**
   - Check session status in WhatsApp service
   - Verify message queue in Redis: `redis-cli llen whatsapp-messages`

### Debug Commands
```bash
# Check all services
pm2 status

# View logs
pm2 logs [service-name]

# Restart service
pm2 restart [service-name]

# Monitor Redis
redis-cli monitor
```

## Security Checklist

- [ ] All services behind reverse proxy
- [ ] SSL certificates installed
- [ ] Environment variables secured
- [ ] Supabase RLS policies active
- [ ] API rate limiting configured
- [ ] Regular backups scheduled
- [ ] Monitoring alerts setup
- [ ] Firewall rules configured

## Support

For deployment support:
- Documentation: [docs.rarityleads.com](https://docs.rarityleads.com)
- Email: support@rarityleads.com
- GitHub Issues: [github.com/your-username/rarity-leads/issues](https://github.com/your-username/rarity-leads/issues)