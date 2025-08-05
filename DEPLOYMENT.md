# 🚀 Rarity Leads - Deployment Guide

## 📋 Overview

This guide covers the complete deployment of the Rarity Leads platform, including the frontend, all microservices, and infrastructure components.

## 🏗️ Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│  Message        │────▶│   Redis         │
│   (Netlify)     │     │  Orchestrator   │     │  (Queue/Cache)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                         │
         │                       ▼                         ▼
         │              ┌─────────────────┐     ┌─────────────────┐
         │              │    WhatsApp     │     │   Lead          │
         │              │    Service      │     │   Enrichment    │
         │              └─────────────────┘     └─────────────────┘
         │                       │                         │
         ▼                       ▼                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Supabase     │     │    Social       │     │   External      │
│   (Database)    │     │    Services     │     │   APIs          │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 🎯 Deployment Phases

### Phase 1: Frontend Deployment (Netlify)
### Phase 2: Database Setup (Supabase)
### Phase 3: Microservices Deployment (VPS/Cloud)
### Phase 4: Infrastructure & Monitoring

---

## 🌐 Phase 1: Frontend Deployment (Netlify)

### Prerequisites
- GitHub repository with your code
- Netlify account

### Steps

#### 1. Connect Repository
1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "New site from Git"
3. Connect your GitHub account
4. Select your Rarity Leads repository

#### 2. Configure Build Settings
```
Build command: npm run build
Publish directory: .next
Node version: 18
```

#### 3. Environment Variables
Add the following environment variables in Netlify dashboard:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yejheyrdsucgzpzwxuxs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDg2NzQsImV4cCI6MjA2NDM4NDY3NH0.NzCJ8i3SKpABO6ykWRX3nHDYmjVB82KL1wfgaY3trM4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODgwODY3NCwiZXhwIjoyMDY0Mzg0NzA0fQ.5s0WmC8H4QonZXrdvfiWeJy_aPitvpxakyX-hWAl0UA

# Microservices URLs (Production)
MESSAGE_ORCHESTRATOR_URL=https://your-orchestrator-domain.com
MESSAGE_ORCHESTRATOR_TOKEN=your-production-orchestrator-token
WHATSAPP_SERVICE_URL=https://your-whatsapp-domain.com
WHATSAPP_SERVICE_TOKEN=your-production-whatsapp-token
ENRICHMENT_SERVICE_URL=https://your-enrichment-domain.com
LEAD_ENRICHMENT_SERVICE_TOKEN=your-production-enrichment-token

# API Keys
APOLLO_API_KEY=your-apollo-api-key
CLEARBIT_API_KEY=your-clearbit-api-key
CRUNCHBASE_API_KEY=your-crunchbase-api-key
LINKEDIN_API_KEY=your-linkedin-api-key
```

#### 4. Deploy
1. Click "Deploy site"
2. Wait for build to complete
3. Your site will be available at `https://your-site-name.netlify.app`

---

## 🗄️ Phase 2: Database Setup (Supabase)

### Prerequisites
- Supabase account

### Steps

#### 1. Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys

#### 2. Run Database Schema
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Execute the script

#### 3. Configure Authentication
1. Go to Authentication > Settings
2. Configure your site URL
3. Set up email templates
4. Configure OAuth providers (Google, etc.)

#### 4. Deploy Edge Functions
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy all functions
supabase functions deploy
```

---

## ☁️ Phase 3: Microservices Deployment (VPS/Cloud)

### Prerequisites
- VPS or cloud instance (DigitalOcean, AWS, etc.)
- Domain name
- SSL certificate

### Server Setup

#### 1. Initial Server Configuration
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Redis
sudo apt install redis-server -y
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

#### 2. Create Application User
```bash
# Create user
sudo adduser rarityleads
sudo usermod -aG sudo rarityleads

# Switch to user
su - rarityleads
```

#### 3. Clone and Setup Services
```bash
# Clone repository
git clone https://github.com/your-username/rarityleads.git
cd rarityleads

# Setup Message Orchestrator
cd message-orchestrator
npm install
cp env.example .env
# Edit .env with production values
pm2 start src/index.js --name "message-orchestrator"

# Setup WhatsApp Service
cd ../whatsapp-service
npm install
cp env.example .env
# Edit .env with production values
pm2 start src/index.js --name "whatsapp-service"

# Setup Lead Enrichment Service
cd ../lead-enrichment-service
npm install
cp env.example .env
# Edit .env with production values
pm2 start src/index.js --name "lead-enrichment-service"

# Save PM2 configuration
pm2 save
pm2 startup
```

#### 4. Nginx Configuration
Create `/etc/nginx/sites-available/rarityleads`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Message Orchestrator
    location /orchestrator/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WhatsApp Service
    location /whatsapp/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Lead Enrichment Service
    location /enrichment/ {
        proxy_pass http://localhost:3006/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket endpoints
    location /ws/orchestrator {
        proxy_pass http://localhost:3008;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    location /ws/whatsapp {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    location /ws/enrichment {
        proxy_pass http://localhost:3007;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

#### 5. Enable Site and SSL
```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/rarityleads /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

#### 6. Firewall Configuration
```bash
# Configure UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

---

## 📊 Phase 4: Infrastructure & Monitoring

### 1. PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart services
pm2 restart all
```

### 2. Redis Monitoring
```bash
# Monitor Redis
redis-cli monitor

# Check memory usage
redis-cli info memory
```

### 3. Nginx Monitoring
```bash
# Check status
sudo systemctl status nginx

# View logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 4. Health Checks
Create health check endpoints for monitoring:

```bash
# Test services
curl https://your-domain.com/orchestrator/health
curl https://your-domain.com/whatsapp/health
curl https://your-domain.com/enrichment/health
```

---

## 🔧 Environment Configuration

### Production Environment Variables

#### Message Orchestrator (.env)
```env
PORT=3000
LOG_LEVEL=info
NODE_ENV=production
MESSAGE_ORCHESTRATOR_TOKEN=your-secure-token
REDIS_URL=redis://localhost:6379
WS_PORT=3008

# Service URLs
WHATSAPP_SERVICE_URL=https://your-domain.com/whatsapp
WHATSAPP_SERVICE_TOKEN=your-whatsapp-token
ENRICHMENT_SERVICE_URL=https://your-domain.com/enrichment
LEAD_ENRICHMENT_SERVICE_TOKEN=your-enrichment-token
```

#### WhatsApp Service (.env)
```env
PORT=3001
LOG_LEVEL=info
NODE_ENV=production
WHATSAPP_SERVICE_TOKEN=your-secure-token
SESSIONS_PATH=/home/rarityleads/sessions
WS_PORT=3002
REDIS_URL=redis://localhost:6379
```

#### Lead Enrichment Service (.env)
```env
PORT=3006
LOG_LEVEL=info
NODE_ENV=production
LEAD_ENRICHMENT_SERVICE_TOKEN=your-secure-token
REDIS_URL=redis://localhost:6379
WS_PORT=3007

# API Keys
APOLLO_API_KEY=your-apollo-api-key
CLEARBIT_API_KEY=your-clearbit-api-key
CRUNCHBASE_API_KEY=your-crunchbase-api-key
LINKEDIN_API_KEY=your-linkedin-api-key
```

---

## 🚀 Deployment Checklist

### Frontend (Netlify)
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Site deployed successfully
- [ ] Custom domain configured (optional)

### Database (Supabase)
- [ ] Project created
- [ ] Schema executed
- [ ] Authentication configured
- [ ] Edge functions deployed
- [ ] RLS policies active

### Microservices (VPS)
- [ ] Server provisioned
- [ ] Node.js and Redis installed
- [ ] Services deployed with PM2
- [ ] Nginx configured
- [ ] SSL certificate installed
- [ ] Firewall configured

### Monitoring
- [ ] PM2 monitoring active
- [ ] Health checks working
- [ ] Logs accessible
- [ ] Backup strategy in place

---

## 🔄 Continuous Deployment

### GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: '.next'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-services:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v0.1.5
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.KEY }}
          script: |
            cd /home/rarityleads/rarityleads
            git pull origin main
            cd message-orchestrator && npm install && pm2 restart message-orchestrator
            cd ../whatsapp-service && npm install && pm2 restart whatsapp-service
            cd ../lead-enrichment-service && npm install && pm2 restart lead-enrichment-service
```

---

## 🆘 Troubleshooting

### Common Issues

#### 1. Service Not Starting
```bash
# Check PM2 logs
pm2 logs service-name

# Check if port is in use
sudo netstat -tulpn | grep :3000

# Restart service
pm2 restart service-name
```

#### 2. Redis Connection Issues
```bash
# Check Redis status
sudo systemctl status redis-server

# Test Redis connection
redis-cli ping

# Restart Redis
sudo systemctl restart redis-server
```

#### 3. Nginx Issues
```bash
# Check configuration
sudo nginx -t

# Check status
sudo systemctl status nginx

# View error logs
sudo tail -f /var/log/nginx/error.log
```

#### 4. SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check auto-renewal
sudo systemctl status certbot.timer
```

---

## 📞 Support

For deployment issues:
1. Check the logs: `pm2 logs`
2. Verify environment variables
3. Test health endpoints
4. Check firewall settings
5. Verify SSL certificate

For additional help, refer to:
- [Supabase Documentation](https://supabase.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [PM2 Documentation](https://pm2.keymetrics.io/docs)
- [Nginx Documentation](https://nginx.org/en/docs/) 