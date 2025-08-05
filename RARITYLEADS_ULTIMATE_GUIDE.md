# 🧠 Rarity Leads - Ultimate Guide

> **DESIGN NOTE:** All design-related content has been moved to `DESIGN_RULES.md`. Please refer to that file for all design system guidelines, UI/UX standards, and visual requirements.

This is the single source of truth for the Rarity Leads project. It covers vision, features, database, deployment, copywriting, and all technical and business steps for building, launching, and maintaining the platform.

---

## 📋 Table of Contents

1. [Strategic Vision & Business Goals](#-strategic-vision--business-goals)
2. [Personas & Needs](#-personas--needs)
3. [Technical Architecture](#️-technical-architecture)
4. [Integrations & APIs](#-integrations--apis)
5. [AI & Automation Features](#-ai--automation-features)
6. [Multichannel Communication](#-multichannel-communication)
7. [Prospecting & Intelligence](#-prospecting--intelligence)
8. [Analytics & Reporting](#-analytics--reporting)
9. [Security & Compliance](#-security--compliance)
10. [Internationalization](#-internationalization)
11. [Development Workflows](#️-development-workflows)
12. [Business Model](#-business-model)
13. [Support & Documentation](#-support--documentation)
14. [Legal & Compliance](#-legal--compliance)
15. [Roadmap & Growth Strategy](#-roadmap--growth-strategy)
16. [Testing & QA](#-testing--qa)
17. [WhatsApp Microservice](#-whatsapp-microservice)
18. [Deployment & Hosting](#-deployment--hosting)
19. [Authentication Flow & Persistent Login](#-authentication-flow--persistent-login)
20. [Supabase Schema & Migration Files](#-supabase-schema--migration-files)
21. [Performance Optimization Guidelines](#-performance-optimization-guidelines)
22. [Troubleshooting Guide](#-troubleshooting-guide)
23. [Sales Page Change Rule](#-sales-page-change-rule-2024)

---

## 🚀 Strategic Vision & Business Goals
Rarity Leads is a B2B SaaS lead prospecting platform powered by AI, focused on automation, personalization, and scale for client acquisition by agencies and service companies.

**Key goals:**
- Automate lead capture and qualification with AI
- Humanize outreach at scale
- Optimize campaigns with actionable analytics
- Deliver a seamless, multilingual, and accessible experience

---

## 👤 Personas & Needs
- **Agency Owner:** Predictable pipeline, less manual prospecting, clear ROI
- **Performance Manager:** Analytics, automation, optimization
- **SDR/Setter:** Qualified leads, automated follow-up
- **Client:** Fast response, smooth onboarding, trust

---

## 🏗️ Technical Architecture
- **Frontend:** Next.js, Tailwind CSS, Framer Motion (modular, premium SaaS UI)
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **Hosting:** Netlify (CDN, CI/CD)
- **Version Control:** GitHub
- **Automation:** Internal automation system (built-in workflows, AI-powered processes)
- **Auth:** Supabase Auth (Google OAuth, Email)

### Main Database Schema
- user_profiles, user_settings, leads, companies, campaigns, messages, analytics, integrations, user_activities
- public.profiles, public.clients, public.campaigns, public.leads, public.appointments, public.automation_sequences, public.conversations, public.lead_interactions, public.landing_pages, public.industries, public.campaign_creatives, public.sequence_steps
- **Requirements:** Timestamps, auth.uid() RLS, indexes, JSONB for flexible data.

---

## 🔌 Integrations & APIs
- **Lead Data:** Crunchbase, ZoomInfo, Clearbit, LinkedIn Sales Navigator, Econodata, Apollo
- **Communication:** WhatsApp Business API, Twilio, LinkedIn API
- **CRM:** HubSpot, Pipedrive, Salesforce
- **Ads:** Facebook Ads API, Google Ads API, Meta Ads API

---

## 🤖 AI & Automation Features
- **Lead Scoring:** Firmographics, technographics, engagement, contact quality, intent signals
- **AI Models:** Qualification, response prediction, best timing, message personalization
- **Workflows:**
  - Capture → Enrichment → Scoring → Qualification → Routing
  - Initial contact → Response detection → Follow-up → Human handoff
  - Monitoring → AI analysis → Suggestions → Auto-apply
  - Lead Qualification Flow: Capture → AI scoring → Route
  - Appointment Setting Flow: Qualify → Calendar slots → Confirm
  - Campaign Optimization Flow: Monitor → Suggest → Apply
- **Best practices:** Use AI for triage, automate repetitive tasks, human-in-the-loop for high-value actions.

---

## 📱 Multichannel Communication
- Multi-account WhatsApp, templates, media, 24/7 chatbot, opt-out
- Message sequences, delays, personalization, SMS/email fallback
- Prioritization: WhatsApp > LinkedIn > SMS > Email

---

## 🎯 Prospecting & Intelligence
- Decision-maker identification, role/department analysis
- Intent targeting: web activity, tech adoption, funding
- Sector intelligence: classification, trends, competitive analysis

---

## 📊 Analytics & Reporting
- Real-time metrics: pipeline, campaigns, channels, revenue
- Advanced analytics: predictive, ROI, engagement, AI recommendations
- Custom dashboards by profile (executive, sales, campaigns)

---

## 🔐 Security & Compliance
- GDPR, CCPA, SOC 2, ISO 27001, PCI DSS
- Multi-factor authentication, RBAC, encryption, consent, audit log

---

## 🌐 Internationalization
- Supported: EN, PT-BR, ES, FR
- Localization: currency, timezone, regional compliance, cultural adaptation

---



---

## 🛠️ Development Workflows
- **Git:** main (prod), feature, release, hotfix
- **CI/CD:** Push → Test → Build → Deploy (Netlify)
- **QA:** Code review, manual tests, Lighthouse, WCAG

---

## 💰 Business Model
- **Plans:** Starter, Professional, Enterprise
- **Revenue:** Subscription, API usage, professional services, data enrichment

---

## 🆘 Support & Documentation
- Knowledge base, tutorials, webinars, forum, 24/7 support
- Training: onboarding, advanced, certification

---

## 📝 Legal & Compliance
- Terms of use, privacy policy, certifications

---

## 📈 Roadmap & Growth Strategy
- Geographic and sector expansion, new AI features, mobile app, enterprise integrations
- **Deployment Roadmap:**
  - Phase 1: Homepage, auth, i18n, Supabase
  - Phase 2: Dashboard, sidebar, metrics, protected routes
  - Phase 3: Core features (lead capture, chatbot, WhatsApp, campaigns)
  - Phase 4: Analytics, reporting, advanced automations

---

## 🧪 Testing & QA
- Homepage: Multilingual, anchors
- Auth: Google/email, verification, redirection, route protection
- App: Sidebar, routing, session, logout
- UI/UX: Mobile, accessibility, RLS

---



---



---



---

## 📱 WhatsApp Microservice

Enterprise-grade WhatsApp integration microservice for the Rarity Leads SaaS platform. Built with Node.js, Baileys, and WebSocket for real-time communication.

### Features
- **Multi-Session Management**: Handle multiple WhatsApp connections per user
- **Session Persistence**: Automatic session restoration on restart
- **Real-time Communication**: WebSocket server for live updates
- **QR Code Generation**: Secure QR code generation for device pairing
- **Message Handling**: Send/receive messages with status tracking
- **Auto-reconnection**: Automatic reconnection with exponential backoff
- **Security**: JWT-based authentication and encrypted session storage

### Architecture
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  WhatsApp       │────▶│   Baileys       │
│   (Frontend)    │     │  Microservice   │     │   Library       │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                         │
         │                       ▼                         ▼
         │              ┌─────────────────┐     ┌─────────────────┐
         │              │   WebSocket     │     │   Session       │
         │              │    Server       │     │   Storage       │
         │              └─────────────────┘     └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│    Supabase     │     │   Real-time     │
│   (Database)    │     │   Updates       │
└─────────────────┘     └─────────────────┘
```

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd whatsapp-service

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Configure environment variables
nano .env
```

### Configuration
#### Environment Variables
```bash
# Service Configuration
PORT=3001
LOG_LEVEL=info
NODE_ENV=development

# Authentication
WHATSAPP_SERVICE_TOKEN=your-secret-token-here

# Session Storage
SESSIONS_PATH=./sessions

# WebSocket Configuration
WS_PORT=3002

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379

# Supabase Configuration (optional)
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

#### Security Considerations
- **Token Security**: Use a strong, randomly generated token
- **Session Encryption**: Session data is encrypted at rest
- **Network Security**: Use HTTPS in production
- **Access Control**: Implement proper authentication

### Usage
#### Development
```bash
# Start development server
npm run dev

# Start with nodemon (auto-restart)
npm run dev
```

#### Production
```bash
# Build and start
npm run build
npm start

# Using PM2
pm2 start src/index.js --name whatsapp-service

# Using Docker
docker build -t whatsapp-service .
docker run -p 3001:3001 -p 3002:3002 whatsapp-service
```

### API Reference
#### REST Endpoints

**Connect WhatsApp Session**
```http
POST /connect
Content-Type: application/json
Authorization: Bearer <token>

{
  "sessionId": "uuid",
  "sessionName": "Business Account",
  "phoneNumber": "+1234567890"
}
```

**Disconnect Session**
```http
POST /disconnect
Content-Type: application/json
Authorization: Bearer <token>

{
  "sessionId": "uuid"
}
```

**Send Message**
```http
POST /send-message
Content-Type: application/json
Authorization: Bearer <token>

{
  "sessionId": "uuid",
  "phoneNumber": "+1234567890",
  "message": "Hello from Rarity Leads!"
}
```

**Get Session Status**
```http
GET /session-status/:sessionId
Authorization: Bearer <token>
```

**List All Sessions**
```http
GET /sessions
Authorization: Bearer <token>
```

**Health Check**
```http
GET /health
```

#### WebSocket Events

**Client → Server**
```javascript
// Subscribe to session updates
{
  "event": "subscribe",
  "data": {
    "sessionId": "uuid"
  }
}
```

**Server → Client**
```javascript
// QR Code Generated
{
  "event": "qr_code",
  "data": {
    "sessionId": "uuid",
    "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
    "status": "connecting"
  }
}

// Connection Success
{
  "event": "connection_success",
  "data": {
    "sessionId": "uuid",
    "status": "connected"
  }
}

// Incoming Message
{
  "event": "incoming_message",
  "data": {
    "sessionId": "uuid",
    "messageId": "uuid",
    "from": "1234567890@s.whatsapp.net",
    "content": "Hello!",
    "type": "text",
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

### Session Management
#### Session Lifecycle
1. **Creation**: Session created when user initiates connection
2. **QR Generation**: QR code generated for device pairing
3. **Connection**: User scans QR code, session becomes active
4. **Persistence**: Session data saved to disk for restoration
5. **Disconnection**: Session marked as disconnected
6. **Cleanup**: Expired sessions automatically cleaned up

#### Session Storage
Sessions are stored in JSON files:
```
sessions/
├── session-1.json
├── session-2.json
└── session-3.json
```

Each file contains encrypted session data for restoration.

#### Auto-reconnection
- **Exponential Backoff**: Retry with increasing delays
- **Session Restoration**: Automatic restoration from saved data
- **Status Updates**: Real-time status updates via WebSocket

### Monitoring & Logging
#### Log Levels
- **error**: Critical errors and failures
- **warn**: Warning messages and recoverable errors
- **info**: General information and status updates
- **debug**: Detailed debugging information

#### Health Monitoring
- **Service Health**: `/health` endpoint for monitoring
- **Session Status**: Real-time session health tracking
- **Performance Metrics**: Response time and throughput

#### Error Handling
- **Graceful Degradation**: Service continues running on errors
- **Error Recovery**: Automatic recovery from common errors
- **Detailed Logging**: Comprehensive error logging

### Security
#### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Token Validation**: All requests validated
- **Secure Storage**: Encrypted session storage

#### Data Protection
- **Session Encryption**: Session data encrypted at rest
- **Network Security**: HTTPS/TLS in production
- **Access Control**: Proper authorization checks

#### Privacy
- **Message Privacy**: No message content logged
- **Data Minimization**: Only necessary data stored
- **GDPR Compliance**: Privacy-compliant data handling

### Deployment
#### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001 3002

CMD ["npm", "start"]
```

#### PM2 Deployment
```bash
# Install PM2
npm install -g pm2

# Start service
pm2 start src/index.js --name whatsapp-service

# Monitor
pm2 monit

# Logs
pm2 logs whatsapp-service
```

#### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: whatsapp-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: whatsapp-service
  template:
    metadata:
      labels:
        app: whatsapp-service
    spec:
      containers:
      - name: whatsapp-service
        image: whatsapp-service:latest
        ports:
        - containerPort: 3001
        - containerPort: 3002
        env:
        - name: PORT
          value: "3001"
        - name: WHATSAPP_SERVICE_TOKEN
          valueFrom:
            secretKeyRef:
              name: whatsapp-secrets
              key: token
```

### Testing
#### Unit Tests
```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

#### Integration Tests
```bash
# Test API endpoints
npm run test:api

# Test WebSocket connections
npm run test:websocket

# Test WhatsApp integration
npm run test:whatsapp
```

#### Load Testing
```bash
# Test with Artillery
npm run test:load

# Test with k6
npm run test:performance
```

### Troubleshooting
#### Common Issues

**QR Code Not Appearing**
```bash
# Check service logs
tail -f logs/app.log

# Verify WebSocket connection
wscat -c ws://localhost:3002

# Check session status
curl http://localhost:3001/session-status/session-id
```

**Messages Not Sending**
```bash
# Check session status
curl http://localhost:3001/session-status/session-id

# Verify phone number format
# Should be: +1234567890@s.whatsapp.net

# Check service health
curl http://localhost:3001/health
```

**Connection Drops**
```bash
# Check network connectivity
ping google.com

# Verify session persistence
ls -la sessions/

# Check auto-reconnection logs
grep "reconnect" logs/app.log
```

#### Debug Commands
```bash
# Check service status
curl http://localhost:3001/health

# List all sessions
curl -H "Authorization: Bearer token" http://localhost:3001/sessions

# Test WebSocket connection
wscat -c ws://localhost:3002

# View real-time logs
tail -f logs/app.log | grep -E "(error|warn|info)"
```

### Performance
#### Optimization Tips
- **Connection Pooling**: Reuse connections when possible
- **Message Queuing**: Queue messages for high volume
- **Session Caching**: Cache active sessions in memory
- **Load Balancing**: Use multiple instances for high load

#### Benchmarks
- **Concurrent Sessions**: 100+ sessions per instance
- **Message Throughput**: 1000+ messages per minute
- **Response Time**: < 100ms for API calls
- **WebSocket Latency**: < 50ms for real-time updates

### Roadmap
#### Planned Features
- **Message Templates**: Pre-built message templates
- **Auto-replies**: Automatic response system
- **Message Scheduling**: Scheduled message sending
- **Analytics**: Message analytics and insights
- **Multi-language**: Internationalization support

#### Scalability Improvements
- **Redis Integration**: Session and message caching
- **Load Balancing**: Multiple service instances
- **Database Integration**: Direct database operations
- **CDN Support**: Global content delivery

---

## 🚀 Deployment & Hosting

### Final Deploy Checklist (Quick Reference)

1. **QA & Accessibility**
   - All pages/routes are present and accessible
   - No forbidden styles (gradients, glass, non-Inter fonts)
   - All interactive elements are accessible (focus, aria-labels, keyboard)
   - All async states use animated Loading component
   - All overlays/menus/modals use animated transitions
   - No console errors or warnings
   - Internationalization and language switcher work
   - Route protection and redirects are in place
   - Build passes with no errors

2. **Build**
   - Run `npm run build` and ensure it completes successfully

3. **Push to GitHub**
   - Commit and push all changes to your main branch

4. **Deploy**
   - Connect your repository to Netlify (or Vercel)
   - Set build command: `npm run build`
   - Set publish directory: `.next` (Vercel auto-detects, Netlify may need config)
   - Add all required environment variables in the deploy platform dashboard
   - Trigger a deploy

5. **Post-Deploy**
   - Verify all pages load and are functional
   - No console errors in production
   - All interactive elements and animations work
   - Test on both desktop and mobile
   - Set up custom domain and SSL (optional)
   - Monitor analytics and error tracking (Netlify/Vercel dashboards)

---

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn** package manager
- **Git** for version control
- **Redis** 6+ for message queuing
- **PostgreSQL** 14+ (handled by Supabase)
- **GitHub** account for repository hosting
- **Supabase** account for database and auth
- **Netlify** account for frontend hosting
- **VPS/Cloud Provider** (DigitalOcean, AWS, etc.) for microservices

### Local Development Setup
1. Clone Repository
2. Install Dependencies (frontend and microservices)
3. Create `.env.local` in the root directory with Supabase, Redis, and microservices config
4. Start Development Servers (frontend, Redis, microservices)
5. Verify Setup (see all local URLs)

### Supabase Setup
- Create Supabase project
- Run schema in SQL Editor
- Configure authentication (email templates, Google OAuth, redirect URLs)
- Deploy Edge Functions
- Set up storage buckets
- Verify Row Level Security (RLS) is active

### Microservices Setup
- Deploy microservices to VPS/cloud
- Install Node.js, Redis, PM2, Nginx
- Clone repo, install dependencies, create production env file
- Start services with PM2
- Configure Nginx for reverse proxy
- Set up SSL with Certbot

### Netlify Deployment
- Connect repo to Netlify
- Set build command and publish directory
- Add environment variables
- Add custom domain and configure DNS
- Deploy (auto on push to main branch)

### Production Configuration
- Set all environment variables for frontend and backend
- Configure firewall and Fail2ban
- Set up monitoring tools (PM2, logrotate)
- Set up log rotation

### Monitoring & Maintenance
- Health checks for frontend and backend
- Log monitoring (PM2, Nginx)
- Database monitoring (Supabase dashboard)
- Backup strategy (database, files, sessions)
- Performance monitoring (system resources, Node.js processes)

### Scaling Considerations
- Horizontal scaling: multiple microservice instances, load balancer, Redis clustering
- Database scaling: read replicas, connection pooling, query/index optimization
- Monitoring scaling: centralized logging, APM tools, alerting

---

## 🔐 Authentication Flow & Persistent Login

### Overview
The Rarity Leads application implements a persistent login system that automatically redirects users based on their authentication status. Logged-in users are taken directly to the dashboard, while new users see the sales page.

### How It Works
1. **Main Page (`/`)**
   - Shows a loading spinner while checking authentication status
   - Checks if user is logged in using Supabase's `getUser()`
   - Redirects to dashboard (`/dashboard`) if authenticated
   - Shows sales page if not authenticated
   - Handles edge cases with a 3-second timeout
2. **Authentication Page (`/auth`)**
   - Checks if user is already logged in on page load
   - Redirects to dashboard if authenticated
   - Handles login/signup with error handling
   - Redirects to dashboard after successful authentication
3. **Dashboard Layout (`/dashboard`)**
   - Protects all dashboard routes by checking authentication
   - Redirects to auth page if not authenticated
   - Listens for auth state changes and handles sign-out events

### Key Features
- **Persistent Sessions**: Supabase sessions are automatically persisted (`persistSession: true`)
- **Automatic Token Refresh**: Tokens are refreshed automatically (`autoRefreshToken: true`)
- **Session Detection**: URL-based session detection (`detectSessionInUrl: true`)
- **Auth State Listener**: App listens for authentication state changes
- **Automatic Redirects**: Users are redirected immediately when signing in/out
- **Cleanup**: Proper cleanup of event listeners to prevent memory leaks
- **Graceful Degradation**: If auth check fails, users still see the sales page
- **Timeout Protection**: 3-second timeout prevents infinite loading
- **Error Logging**: Authentication errors are logged for debugging

### User Experience Flow
- **For New Users**: Visit `/` → See sales page → Sign up → Redirected to `/dashboard` → Future visits to `/` auto-redirect to dashboard
- **For Existing Users**: Visit `/` → Auto-redirect to dashboard → Session persists across browser sessions → Can sign out (redirected to `/auth`)
- **For Logged Out Users**: Visit `/` → See sales page → Login → Redirected to `/dashboard`

### Technical Implementation
- `src/app/page.tsx`: Auth check on mount, loading state, auth state change listener, timeout protection
- `src/lib/supabase.ts`: Persistent sessions, auto-refresh, session detection
- Auth state is synchronized across tabs/windows

### Security Considerations
- Client-side only auth checks for UX
- Server-side protection for dashboard routes
- Supabase handles token security and refresh
- Proper cleanup of auth listeners

### Testing the Implementation
1. Clear browser data and visit `/` → Should see sales page
2. Sign up/login → Should be redirected to dashboard
3. Close browser and reopen → Visit `/` → Should be redirected to dashboard
4. Sign out → Should be redirected to auth page
5. Visit `/` again → Should see sales page

### Troubleshooting
- **Infinite Loading**: Check network connection and Supabase config
- **Redirect Loop**: Ensure auth page doesn't redirect authenticated users
- **Session Not Persisting**: Check localStorage and Supabase settings
- **Debug Steps**: Check browser console, verify env vars, check localStorage, test different browsers

### Future Enhancements
- Remember Me option for extended session duration
- Multi-factor Authentication (2FA)
- Session management (view/manage active sessions)
- Offline support for authentication

---

## 🗄️ Supabase Schema & Migration Files

All Supabase schema, migration, and seed files for Rarity Leads are organized for clarity and version control. Use these files to set up, migrate, and manage your database schema in a modular way.

### Folder Structure

```
/supabase/
  README.md                # Setup and migration instructions
  /schema/
    001_create_tables.sql  # Create all main tables
    002_enable_rls.sql     # Enable Row Level Security (RLS)
    003_create_policies.sql# Create RLS policies
  /seed/
    seed_data.sql          # Example seed data for local/staging
```

### How to Use
- Run each file in order using the Supabase SQL Editor or CLI, as described in /supabase/README.md.
- The modular files replace the older monolithic files (e.g., supabase_schema.sql, supabase_whatsapp_schema.sql, etc.), which are now archived for reference.
- Always use the modular files for new migrations and updates.

### Purpose
- **001_create_tables.sql**: Creates all main tables with UUID PKs, foreign keys, and JSONB fields.
- **002_enable_rls.sql**: Enables RLS on all user-specific tables.
- **003_create_policies.sql**: Adds RLS policies for user and admin access.
- **seed_data.sql**: Provides example data for local/staging testing.

See /supabase/README.md for full instructions and best practices.

---

## 🏢 Universal Modal Interaction - ALL Internal Pages

### Overview
ALL internal pages in Rarity Leads implement a Notion-style modal interaction pattern where clicking on any item (company, lead, campaign, etc.) opens a detailed modal overlay instead of navigating to a separate page.

### Universal User Experience Flow
1. **List View**: Users see a grid/list of items with key information
2. **Item Click**: Clicking any item opens a modal with full details
3. **Inline Editing**: Users can toggle edit mode to modify information
4. **Real-time Updates**: Changes are saved and reflected immediately in the list
5. **Deep Linking**: Direct links to specific items (e.g., `/leads?id=123`) open the modal automatically

### Universal Editable Data Fields
- **Basic Information**: Name, category, status, location, dates
- **Contact Information**: Email, phone, website, social media
- **Key Contacts**: Add/remove contact persons with roles and details
- **Notes**: Rich text notes and descriptions
- **Tags**: Add/remove custom tags for categorization
- **Status**: Various status options (Active, Inactive, Draft, etc.)
- **Related Data**: Connected items, attachments, activity logs

### Universal Technical Implementation
- **Modal Components**: `[Entity]Modal` components handle all interactions
- **State Management**: Local editing state with optimistic UI updates
- **URL Synchronization**: Modal state syncs with URL parameters
- **Data Persistence**: Changes saved to Supabase with proper RLS
- **Performance**: No page reloads, seamless transitions

### Universal UX Features
- **Smooth Animations**: Framer Motion spring animations for modal entrance/exit
- **Keyboard Support**: ESC to close, Enter to save, proper focus management
- **Responsive Design**: Full-width modal on mobile, max-width on desktop
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Error Handling**: Toast notifications for success/error states

### Universal Performance Expectations
- **Modal Load Time**: < 200ms for modal opening
- **Save Response**: < 1s for data persistence
- **List Updates**: Instant reflection of changes
- **Memory Usage**: Efficient state management, no memory leaks
- **Mobile Performance**: Smooth 60fps animations on all devices

### Affected Pages & Components
- **Companies Page**: CompanyModal for company management
- **Leads Page**: LeadModal for lead details and editing
- **CRM Page**: LeadModal for pipeline lead management
- **Campaigns Page**: CampaignModal for campaign details
- **Analytics Page**: AnalyticsModal for detailed reports
- **Support Page**: ArticleModal for help content
- **Settings Pages**: Various modals for settings management
- **Outreach Pages**: MessageModal, AccountModal for channel management

---

## 🚫 Sales Page Change Rule (2024)
- No changes to the sales page (landing page) are allowed unless specifically requested in a prompt. All other UI/UX changes must not affect the sales page.

---



---

## 🚀 Performance Optimization Guidelines

### Core Web Vitals Optimization
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Frontend Performance
- **Code Splitting**: Implement dynamic imports for route-based splitting
- **Image Optimization**: Use Next.js Image component with proper sizing
- **Font Loading**: Preload critical fonts, use font-display: swap
- **Bundle Analysis**: Regular bundle size monitoring and optimization
- **Caching Strategy**: Implement proper cache headers and service workers

### Backend Performance
- **Database Optimization**: Proper indexing, query optimization
- **API Response Time**: < 200ms for all API endpoints
- **Connection Pooling**: Optimize database connections
- **CDN Usage**: Leverage Netlify's global CDN for static assets

### Monitoring & Analytics
- **Real User Monitoring (RUM)**: Track actual user performance
- **Error Tracking**: Monitor and alert on performance regressions
- **Performance Budgets**: Set and enforce performance budgets

---

## 🔧 Troubleshooting Guide

### Common Issues & Solutions

#### Authentication Issues
- **Session Not Persisting**: Check Supabase configuration and localStorage
- **Redirect Loops**: Verify auth state management and route protection
- **OAuth Failures**: Validate redirect URLs and provider configuration

#### Performance Issues
- **Slow Page Loads**: Check bundle size, image optimization, and CDN
- **High Memory Usage**: Monitor component re-renders and memory leaks
- **API Timeouts**: Optimize database queries and implement caching

#### Deployment Issues
- **Build Failures**: Check environment variables and dependency conflicts
- **Runtime Errors**: Monitor error logs and implement proper error boundaries
- **Database Connection Issues**: Verify Supabase configuration and RLS policies

#### WhatsApp Integration Issues
- **QR Code Not Appearing**: Check WebSocket connection and service status
- **Messages Not Sending**: Verify session status and phone number format
- **Connection Drops**: Monitor network connectivity and auto-reconnection

### Debug Tools & Commands
```bash
# Check service health
curl http://localhost:3001/health

# Monitor logs
tail -f logs/app.log

# Test WebSocket connection
wscat -c ws://localhost:3002

# Check bundle size
npm run build && npm run analyze
```

### Support Resources
- **Documentation**: This guide and related markdown files
- **Community**: GitHub issues and discussions
- **Monitoring**: Netlify analytics and error tracking
- **Backup**: Regular database and code backups

---

**This guide is a living document. Always consult it for the latest on building, deploying, and maintaining Rarity Leads.** 