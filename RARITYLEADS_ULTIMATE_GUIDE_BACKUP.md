# 🧠 Rarity Leads - Ultimate Guide

> **IMPORTANT: All frontend and web design guidelines must strictly follow the system defined in DESIGN_RULES.md. Any mention of gradients, glassmorphism, vivid colors, excessive bold, or legacy styles is strictly forbidden and must be ignored. The design is dark, minimalist, tech-inspired, with no gradients, no glass, no bold above 500, flat sidebar, flat buttons, Inter font 400/500 only, allowed color palette, only subtle smooth animations, and a profile/theme/language panel in the bottom left corner.**

> **DESIGN RULE:** The entire project must use a minimalist, dark, non-colorful design. White, light, or colorful backgrounds are strictly forbidden. No example numbers (e.g., 12, 0, 7, etc.) should appear anywhere in the UI—only real data or zero. All UI/UX must be modern, tech-inspired, and include motion effects for a premium SaaS feel. The sidebar menu must always include every prospecting channel as in the dashboard. All buttons must be visually consistent, functional, and never broken. The Sign In button must always work and be visually correct.

> **MAJOR DESIGN REFERENCES:** The primary web and motion design reference for the entire project is [tradesflow.io](https://www.tradesflow.io/) - featuring clean typography, professional layout, subtle animations, and modern SaaS aesthetic. Secondary references include [tempo.new](https://www.tempo.new/), [codecademy.com](https://www.codecademy.com/), [sounext.xyz](https://www.sounext.xyz/), [console.anthropic.com/dashboard](https://console.anthropic.com/dashboard), and [docs.anthropic.com/en/docs/intro](https://docs.anthropic.com/en/docs/intro). All pages (Sales, Auth, Dashboard, Leads, etc.) must follow the minimalist, dark, tech-inspired, and motion-rich style of these references. All buttons and interactive elements must always work and have a premium, animated feel.

This is the single source of truth for the Rarity Leads project. It covers vision, features, design, database, deployment, copywriting, and all technical and business steps for building, launching, and maintaining the platform.

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
11. [Design System & Guidelines](#-design-system--guidelines)
12. [Navigation & UX](#-navigation--ux)
13. [Responsiveness](#-responsiveness)
14. [Development Workflows](#️-development-workflows)
15. [Business Model](#-business-model)
16. [Support & Documentation](#-support--documentation)
17. [Legal & Compliance](#-legal--compliance)
18. [Roadmap & Growth Strategy](#-roadmap--growth-strategy)
19. [Testing & QA](#-testing--qa)
20. [Sidebar & Header Transformation](#-sidebar--header-transformation-2025)
21. [UI/UX Improvements](#-uiux-improvements)
22. [Notion.com as Database & UX Reference](#️-notioncom-as-a-database--ux-reference)
23. [WhatsApp Microservice](#-whatsapp-microservice)
24. [Deployment & Hosting](#-deployment--hosting)
25. [Authentication Flow & Persistent Login](#-authentication-flow--persistent-login)
26. [Supabase Schema & Migration Files](#-supabase-schema--migration-files)
27. [Sales Page Change Rule](#-sales-page-change-rule-2024)

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
- **Frontend:** Next.js, Tailwind CSS, Framer Motion (modular, motion-rich, premium SaaS UI)
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **Hosting:** Netlify (CDN, CI/CD)
- **Version Control:** GitHub
- **Automation:** n8n
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

## 🎨 Design System & Guidelines
### Color Palette (Inspired by tempo.new and codecademy.com)
- Deep Blue: #0A0A23
- Slate Gray: #232136
- Light Gray: #E5E7EB
- Darker Purple: #6D28D9
- Glass Morphism Background: rgba(255,255,255,0.10)
- Text: #FFFFFF (primary), #A1A1AA (secondary)

### Gradients
- Primary: linear-gradient(135deg, #0A0A23 0%, #232136 40%, #8B5CF6 100%)
- Glass: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.12) 100%)

### Fonts
- 'Inter', BentoSans Regular

### Accessibility
- Mobile-first, SEO, WCAG 2.1

### Components
- Buttons: Pill-shaped, high-contrast dark backgrounds (#181825 or #232136), bold dark purple border/accent (#6D28D9 or #8B5CF6), white bold uppercase text, no underline, centered, strong contrast, modern SaaS look inspired by tempo.new
- Cards, grids, navigation, animations, glass morphism
- Pure HTML/CSS/JS: No frameworks, semantic naming, i18n JSON key-value
- Homepage: Hero, Features, Pricing, CTA, Trust Badges
- Auth: Unified register/login, Google OAuth, email/password, verification
- Dashboard/App: Sidebar, metrics, tabs, protected routes, session persistence, language switching

---

## 🧭 Navigation & UX
- Sidebar with icons, badges, status indicators
- Responsive menu: fixed sidebar (desktop), overlay (mobile)
- Automatic active states, clear navigation
- **All UI/UX is inspired by the modern, premium SaaS style of [tempo.new](https://www.tempo.new/) and the tech-focused, educational approach of [codecademy.com](https://www.codecademy.com/).**

---

## 📱 Responsiveness
- Desktop: full layout, hover, animations
- Tablet: adaptive grid, touch-friendly
- Mobile: stacked cards, overlay navigation

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

## 🎨 Sidebar & Header Transformation (2025)
### Sidebar
- Glass morphism: backdrop-filter blur(24px)
- Triple gradient background: Deep blue → Slate → Deep blue
- Animated accent line on the left
- Multi-layer box shadow for depth
- Responsive: perfect adaptation for mobile
- Logo: triple gradient, shimmer effect, text gradient, subtle elevation, 48px with 16px border-radius
- Navigation: glass cards with blur, transform + glow + scale on hover, gradient accent for active, platform color icons, gradient badges with pulse animation
- Minimalist scrollbar: 4px, semi-transparent white, smooth transitions

### Header
- Glass effect: backdrop-filter blur(24px)
- Gradient: dark slate with transparency
- Animated border at the base
- Subtle box shadow
- Optimized height
- Breadcrumb: glass card with blur, text gradient, font-weight 700, responsive, optimized padding
- Action buttons: glass cards, elevation + glow + scale on hover, gradient border on hover, notification dot with pulse + glow, smooth cubic-bezier transitions
- Language selector: advanced glass morphism, gradient hover, flag icons, scale + fade + slide animations, gradient highlight for active

### Animations
- Sidebar: accent glow (6s infinite), logo shimmer (4s), badge pulse (2s), nav hover (transform + glow)
- Header: notification pulse (2s), static but elegant border gradient, multi-layer button hover, dropdown (scale + fade + slide)

### Responsiveness
- Desktop: fixed sidebar, full header, all effects
- Tablet: collapsible sidebar, adapted header, touch-friendly, optimized effects
- Mobile: overlay sidebar, compact header, touch gestures, optimized performance

### Performance & Optimization
- GPU-accelerated transforms, will-change for animated elements, optimized backdrop-filter, cubic-bezier transitions
- Progressive enhancement, lazy loading of effects, reduced motion support, fallbacks for old browsers

### Anthropic Console & Docs
- **Anthropic Console & Docs:** [console.anthropic.com/dashboard](https://console.anthropic.com/dashboard) and [docs.anthropic.com/en/docs/intro](https://docs.anthropic.com/en/docs/intro) - Floating profile panel, minimalist sidebar, and clean navigation for SaaS apps

---

## 🎨 UI/UX Improvements
- Minimalist, clean design
- Fluid, intuitive navigation
- Direct, impactful copywriting
- Improved visual hierarchy
- Smooth micro-interactions
- Enhanced responsiveness

### Before vs After
- Welcome: "Good morning" (no emoji)
- Action buttons: context-rich, no fake numbers
- Stats cards: gradients, animated borders, all numbers start at zero
- Layout: fluid with animations
- Copywriting: results-oriented, human, motivational

### Design Improvements
- Welcome section: "Good morning. Ready to convert more leads today?" Stat highlight: "0 new leads this week"
- Action buttons: "Create Campaign" ("Start converting leads"), "Connect LinkedIn" ("Expand your reach")
- Stats cards: gradients, visual indicators, all numbers zero
- Analytics: responsive grid, contextual headers, animated progress bars, interactive micro-animations
- Activity feed: real avatars, animated status dots, human copy, improved spacing

### Copywriting
- All titles, subtitles, and labels are direct, human, and results-oriented
- All example numbers are set to zero to avoid confusion

### Micro-interactions & Animations
- Cards: smooth elevation, expanded shadow on hover
- Buttons: shimmer effect, elevation
- Activity items: subtle slide
- Navigation: transform and color transitions
- Loading: animated progress bars, shimmer effects, pulse status dots, button spinners
- Transitions: 0.3s-0.4s, cubic-bezier, translate/scale/opacity

### Responsiveness
- Desktop: full layout, fixed sidebar, 2fr 1fr analytics grid
- Tablet: collapsible sidebar, adaptive grid, reorganized buttons
- Mobile: stacked stats, column quick actions, single-column analytics, resized text
- Extra small: single-column stats, reduced padding, optimized fonts, touch-friendly

### Color System (thedankoe.com inspired)
- Background Primary: #0A0A23
- Background Secondary: #232136
- Card/Glass: rgba(255,255,255,0.08)
- Text Primary: #FFFFFF
- Text Secondary: #A1A1AA
- Accent Purple: #8B5CF6
- Border: #393552

### Performance & Accessibility
- Optimized CSS variables
- GPU-accelerated transforms
- Skeleton screens and shimmer effects
- Focus states, WCAG AA contrast, 44px touch targets, reduced motion support

---

## 🗂️ Notion.com as a Database & UX Reference

- Notion.com is a major reference for all database/list and page creation UX in Rarity Leads.
- The Leads feature and any list/database UI should follow Notion's approach to:
  - Creating new items/pages with a clean modal or inline form
  - Displaying a list of all previous items/queries (like Notion's database rows)
  - Allowing users to click any item to view its details/results
  - Organizing data in a visually clean, minimalist, and highly interactive way
- All future database/list features should be inspired by Notion's best practices for organization, discoverability, and user experience.

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

## 🚫 Sales Page Change Rule (2024)
- No changes to the sales page (landing page) are allowed unless specifically requested in a prompt. All other UI/UX changes must not affect the sales page.

---

## 📚 Web Design References
All visual and UI/UX decisions are inspired by:
- **PRIMARY REFERENCE:** [tradesflow.io](https://www.tradesflow.io/) - The main design inspiration featuring exceptional modern SaaS design, clean typography, professional layout, subtle animations, and premium user experience
- The modern, premium SaaS aesthetic of [tempo.new](https://www.tempo.new/)
- The tech-focused, educational, and professional design of [codecademy.com](https://www.codecademy.com/)
- The minimalist, dark, tech-inspired style of [sounext.xyz](https://www.sounext.xyz/)

## 🎯 Dashboard & UI/UX (Premium Summary)
- All dashboard numbers and metrics start at zero by default (no fake/example data).
- No emojis or informal greetings; all copy is clear, direct, and professional.
- Personalized greeting and call-to-action are context-aware and conversion-focused.
- Stats cards use glass morphism, gradients, and subtle hover effects.
- Analytics section features animated progress bars and responsive charts.
- Activity feed uses real avatars, animated status dots, and humanized language.
- Recent leads and campaigns are shown with real-time data, status badges, and quick actions.
- Sidebar and header use glass morphism, gradients, and a minimalist, modern layout.
- Navigation is intuitive, with dynamic badges and status indicators.
- Responsive design: desktop (full layout), tablet (adaptive grid), mobile (stacked cards, overlay navigation).
- All UI/UX follows the modern, premium SaaS style of tempo.new and the tech-focused, professional approach of codecademy.com.

---

**This guide is a living document. Always consult it for the latest on building, deploying, and maintaining Rarity Leads.** 