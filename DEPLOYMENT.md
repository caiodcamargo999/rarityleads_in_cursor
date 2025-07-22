# 🚀 Rarity Leads - Complete Deployment Guide

## ✅ Final Deploy Checklist (Quick Reference)

1. **QA & Accessibility**
   - [x] All pages/routes are present and accessible
   - [x] No forbidden styles (gradients, glass, non-Inter fonts)
   - [x] All interactive elements are accessible (focus, aria-labels, keyboard)
   - [x] All async states use animated Loading component
   - [x] All overlays/menus/modals use animated transitions
   - [x] No console errors or warnings
   - [x] Internationalization and language switcher work
   - [x] Route protection and redirects are in place
   - [x] Build passes with no errors

2. **Build**
   - [x] Run `npm run build` and ensure it completes successfully

3. **Push to GitHub**
   - [x] Commit and push all changes to your main branch

4. **Deploy**
   - [x] Connect your repository to Netlify (or Vercel)
   - [x] Set build command: `npm run build`
   - [x] Set publish directory: `.next` (Vercel auto-detects, Netlify may need config)
   - [x] Add all required environment variables in the deploy platform dashboard
   - [x] Trigger a deploy

5. **Post-Deploy**
   - [x] Verify all pages load and are functional
   - [x] No console errors in production
   - [x] All interactive elements and animations work
   - [x] Test on both desktop and mobile
   - [x] Set up custom domain and SSL (optional)
   - [x] Monitor analytics and error tracking (Netlify/Vercel dashboards)

---

This guide covers the complete deployment process for Rarity Leads, from local development to production.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Supabase Setup](#supabase-setup)
- [Microservices Setup](#microservices-setup)
- [Netlify Deployment](#netlify-deployment)
- [Production Configuration](#production-configuration)
- [Monitoring & Maintenance](#monitoring--maintenance)
- [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

### Required Software
- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn** package manager
- **Git** for version control
- **Redis** 6+ for message queuing
- **PostgreSQL** 14+ (handled by Supabase)

### Required Accounts
- **GitHub** account for repository hosting
- **Supabase** account for database and auth
- **Netlify** account for frontend hosting
- **VPS/Cloud Provider** (DigitalOcean, AWS, etc.) for microservices

## 🏠 Local Development Setup

### 1. Clone Repository
```bash
git clone https://github.com/caiodcamargo999/rarityleads_in_cursor.git
cd rarityleads_in_cursor
```

### 2. Install Dependencies
```bash
# Frontend dependencies
npm install

# Microservices dependencies
cd services
npm install
cd ..
```

### 3. Environment Configuration
Create `.env.local` in the root directory:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yejheyrdsucgzpzwxuxs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDg2NzQsImV4cCI6MjA2NDM4NDY3NH0.NzCJ8i3SKpABO6ykWRX3nHDYmjVB82KL1wfgaY3trM4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODgwODY3NCwiZXhwIjoyMDY0Mzg0Njc0fQ.5s0WmC8H4QonZXrdvfiWeJy_aPitvpxakyX-hWAl0UA

# Redis Configuration
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# Microservices Configuration
WHATSAPP_SERVICE_PORT=3001
INSTAGRAM_SERVICE_PORT=3002
FACEBOOK_SERVICE_PORT=3003
X_SERVICE_PORT=3004
LINKEDIN_SERVICE_PORT=3005
ORCHESTRATOR_SERVICE_PORT=3000

# AI Configuration (Optional)
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# External APIs (Optional)
CLEARBIT_API_KEY=your_clearbit_api_key
APOLLO_API_KEY=your_apollo_api_key
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

### 4. Start Development Servers
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Redis
redis-server

# Terminal 3: Microservices
cd services
npm run dev
```

### 5. Verify Setup
- Frontend: http://localhost:3000
- WhatsApp Service: http://localhost:3001
- Instagram Service: http://localhost:3002
- Facebook Service: http://localhost:3003
- X Service: http://localhost:3004
- LinkedIn Service: http://localhost:3005
- Orchestrator: http://localhost:3000

## 🗄️ Supabase Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and API keys

### 2. Database Schema Setup
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the complete schema from `supabase/schema.sql`

### 3. Authentication Configuration
1. Go to Authentication > Settings
2. Configure email templates
3. Set up Google OAuth provider
4. Configure redirect URLs:
   - Local: `http://localhost:3000/auth/callback`
   - Production: `https://rarityleads.netlify.app/auth/callback`

### 4. Edge Functions Deployment
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy Edge Functions
supabase functions deploy ai-scoring
supabase functions deploy lead-enrichment
supabase functions deploy message-automation
```

### 5. Storage Configuration
1. Go to Storage in Supabase dashboard
2. Create buckets for:
   - `session-backups` (for WhatsApp sessions)
   - `media` (for message attachments)
   - `exports` (for data exports)

### 6. Row Level Security (RLS)
Verify RLS policies are active:
```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## 🔧 Microservices Setup

### 1. Production Environment
For production, deploy microservices to a VPS or cloud provider:

#### DigitalOcean Droplet Setup
```bash
# Create a new droplet (Ubuntu 22.04 LTS)
# SSH into your droplet
ssh root@your-droplet-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs

# Install Redis
apt install redis-server -y
systemctl enable redis-server
systemctl start redis-server

# Install PM2 for process management
npm install -g pm2

# Install Nginx
apt install nginx -y
systemctl enable nginx
systemctl start nginx
```

### 2. Deploy Microservices
```bash
# Clone your repository
git clone https://github.com/caiodcamargo999/rarityleads_in_cursor.git
cd rarityleads_in_cursor/services

# Install dependencies
npm install

# Create production environment file
cp .env.example .env.production
# Edit .env.production with your production values

# Start services with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 3. Nginx Configuration
Create `/etc/nginx/sites-available/rarity-leads`:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

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

    # Instagram Service
    location /instagram/ {
        proxy_pass http://localhost:3002/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Facebook Service
    location /facebook/ {
        proxy_pass http://localhost:3003/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # X Service
    location /x/ {
        proxy_pass http://localhost:3004/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # LinkedIn Service
    location /linkedin/ {
        proxy_pass http://localhost:3005/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Orchestrator Service
    location / {
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
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/rarity-leads /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 4. SSL Certificate
```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d api.yourdomain.com
```

## 🌐 Netlify Deployment

### 1. Connect Repository
1. Go to [netlify.com](https://netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.`
   - Node version: 18

### 2. Environment Variables
In Netlify dashboard, go to Site settings > Environment variables:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
```

### 3. Custom Domain
1. Go to Domain management in Netlify
2. Add your custom domain
3. Configure DNS records as instructed

### 4. Deploy
Netlify will automatically deploy on every push to the main branch.

## ⚙️ Production Configuration

### 1. Environment Variables
Ensure all production environment variables are set:

#### Frontend (Netlify)
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

#### Backend (VPS)
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
REDIS_URL=redis://localhost:6379
NODE_ENV=production
PORT=3000
```

### 2. Security Configuration
```bash
# Firewall setup
ufw allow ssh
ufw allow 80
ufw allow 443
ufw enable

# Fail2ban setup
apt install fail2ban -y
systemctl enable fail2ban
systemctl start fail2ban
```

### 3. Monitoring Setup
```bash
# Install monitoring tools
npm install -g pm2-logrotate

# Configure PM2 monitoring
pm2 install pm2-server-monit
pm2 install pm2-logrotate

# Setup log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

## 📊 Monitoring & Maintenance

### 1. Health Checks
Create health check endpoints:
```bash
# Test frontend
curl https://yourdomain.com/api/health

# Test backend services
curl https://api.yourdomain.com/health
curl https://api.yourdomain.com/whatsapp/health
curl https://api.yourdomain.com/instagram/health
```

### 2. Log Monitoring
```bash
# View PM2 logs
pm2 logs

# View specific service logs
pm2 logs whatsapp-service
pm2 logs instagram-service

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 3. Database Monitoring
- Monitor Supabase dashboard for:
  - Database performance
  - Storage usage
  - API usage
  - Edge function execution

### 4. Backup Strategy
```bash
# Database backups (handled by Supabase)
# File backups
rsync -av /var/www/rarity-leads/ /backup/rarity-leads/

# Session backups
rsync -av /var/www/rarity-leads/services/sessions/ /backup/sessions/
```

### 5. Performance Monitoring
```bash
# Monitor system resources
htop
iotop
nethogs

# Monitor Node.js processes
pm2 monit
```

## 🔧 Troubleshooting

### Common Issues

#### 1. WhatsApp Service Not Connecting
```bash
# Check service status
pm2 status whatsapp-service

# Check logs
pm2 logs whatsapp-service

# Restart service
pm2 restart whatsapp-service
```

#### 2. Database Connection Issues
```bash
# Test Supabase connection
curl -H "apikey: your_anon_key" \
     https://your-project.supabase.co/rest/v1/leads
```

#### 3. Redis Connection Issues
```bash
# Test Redis connection
redis-cli ping

# Check Redis status
systemctl status redis-server
```

#### 4. Nginx Issues
```bash
# Test Nginx configuration
nginx -t

# Check Nginx status
systemctl status nginx

# View error logs
tail -f /var/log/nginx/error.log
```

#### 5. SSL Certificate Issues
```bash
# Check certificate status
certbot certificates

# Renew certificates
certbot renew --dry-run
```

### Performance Optimization

#### 1. Database Optimization
```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_leads_user_status ON leads(user_id, status);
CREATE INDEX CONCURRENTLY idx_messages_conversation_created ON messages(conversation_id, created_at);
```

#### 2. Caching Strategy
```bash
# Redis caching configuration
# Add to redis.conf
maxmemory 256mb
maxmemory-policy allkeys-lru
```

#### 3. CDN Configuration
- Configure Netlify CDN for static assets
- Use Supabase CDN for media files

### Security Best Practices

#### 1. API Security
```bash
# Rate limiting in Nginx
# Add to nginx.conf
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

#### 2. Environment Security
```bash
# Secure environment files
chmod 600 .env.production
chown www-data:www-data .env.production
```

#### 3. Regular Updates
```bash
# Update system packages
apt update && apt upgrade -y

# Update Node.js dependencies
npm update

# Update PM2
pm2 update
```

## 📈 Scaling Considerations

### 1. Horizontal Scaling
- Deploy multiple instances of microservices
- Use load balancer (HAProxy/Nginx)
- Implement Redis clustering

### 2. Database Scaling
- Use Supabase read replicas
- Implement connection pooling
- Optimize queries and indexes

### 3. Monitoring Scaling
- Implement centralized logging (ELK stack)
- Use APM tools (New Relic, DataDog)
- Set up alerting and notifications

## 🎯 Next Steps

1. **Set up monitoring and alerting**
2. **Implement automated backups**
3. **Configure CI/CD pipelines**
4. **Set up staging environment**
5. **Implement A/B testing**
6. **Add analytics and tracking**
7. **Optimize performance**
8. **Implement security audits**

---

**Need Help?**
- Check the [troubleshooting section](#troubleshooting)
- Review [Supabase documentation](https://supabase.com/docs)
- Check [Netlify documentation](https://docs.netlify.com)
- Contact support at support@rarityleads.com 