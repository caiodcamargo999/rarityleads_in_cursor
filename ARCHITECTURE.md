<<<<<<< HEAD
 
=======
# 🏗️ Rarity Leads - Architecture Documentation

## 📋 Table of Contents
- [System Overview](#system-overview)
- [Core Principles](#core-principles)
- [Technology Stack](#technology-stack)
- [Microservices Architecture](#microservices-architecture)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Scalability Strategy](#scalability-strategy)
- [API Design](#api-design)

## 🎯 System Overview

Rarity Leads is a distributed B2B lead generation platform built on microservices architecture, designed for infinite horizontal scaling without dependency on third-party automation services.

### Key Architectural Decisions
1. **No External Dependencies**: No n8n, Zapier, or Meta WhatsApp API
2. **Full Control**: Local backend automations with complete control
3. **Cost Efficiency**: Open-source solutions for messaging channels
4. **Infinite Scale**: Distributed architecture with independent services

## 🔑 Core Principles

### 1. Service Independence
Each microservice is completely independent:
- Own database connections
- Own authentication
- Own deployment lifecycle
- Own scaling rules

### 2. Message-Driven Architecture
- Asynchronous communication via message queues
- Redis for high-performance message brokering
- Event-driven updates via WebSockets

### 3. API-First Design
- RESTful APIs for synchronous operations
- WebSocket connections for real-time features
- OpenAPI specification for all endpoints

## 💻 Technology Stack

### Frontend
```
├── Framework: Next.js 14 (App Router)
├── Styling: TailwindCSS
├── Animations: Framer Motion
├── State: React Context + Hooks
├── Auth: Supabase Auth
└── Real-time: WebSocket clients
```

### Backend Services
```
├── Database: Supabase (PostgreSQL)
├── Auth: Supabase Auth
├── Storage: Supabase Storage
├── Edge Functions: Deno (Supabase)
├── Message Queue: Redis + Bull
├── Microservices: Node.js (ES Modules)
└── Real-time: WebSocket servers
```

### Infrastructure
```
├── Frontend Hosting: Netlify
├── Backend Hosting: VPS/Cloud (DigitalOcean/AWS)
├── CDN: Netlify Edge
├── SSL: Let's Encrypt
└── Monitoring: PM2 + Custom Dashboards
```

## 🔧 Microservices Architecture

### Service Map
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  Message        │────▶│     Redis       │
│   (Frontend)    │     │  Orchestrator   │     │  Message Queue  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                         │
         │                       ▼                         ▼
         │              ┌─────────────────┐       ┌─────────────────┐
         │              │    WhatsApp     │       │   Instagram     │
         │              │    Service      │       │    Service      │
         │              └─────────────────┘       └─────────────────┘
         │                       │                         │
         ▼                       ▼                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│    Supabase     │     │    Facebook     │     │   LinkedIn      │
│   (Database)    │     │    Service      │     │    Service      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                         │
         │                       ▼                         ▼
         │              ┌─────────────────┐     ┌─────────────────┐
         └──────────────│   X (Twitter)   │     │ Lead Enrichment │
                        │    Service      │     │    Service      │
                        └─────────────────┘     └─────────────────┘
```

### Service Descriptions

#### 1. Message Orchestrator (Port 3000)
**Purpose**: Central hub for all messaging operations
```javascript
Responsibilities:
- Message routing to appropriate channels
- Queue management and prioritization
- Delivery status tracking
- Fallback channel logic
- WebSocket server for real-time updates
```

#### 2. WhatsApp Service (Port 3001)
**Purpose**: Multi-account WhatsApp management
```javascript
Technologies:
- Baileys library for WhatsApp Web
- Session persistence
- QR code generation
- Message sending/receiving
- Media handling
```

#### 3. Social Media Services (Ports 3002-3005)
**Purpose**: Channel-specific messaging
```javascript
Instagram Service (3002):
- Instagram Private API
- Direct message handling
- Story replies

Facebook Service (3003):
- Messenger integration
- Page messaging

X Service (3004):
- Twitter API v2
- Direct messages

LinkedIn Service (3005):
- LinkedIn messaging
- InMail support
```

#### 4. Lead Enrichment Service (Port 3006)
**Purpose**: Multi-source data enrichment
```javascript
Data Sources:
- Clearbit
- Apollo
- LinkedIn Sales Navigator
- Crunchbase
Features:
- Parallel API calls
- Data deduplication
- AI scoring integration
- Caching layer
```

## 📊 Data Flow

### 1. Lead Creation Flow
```
User Input → Frontend → Supabase → Enrichment Service → AI Scoring → Database
```

### 2. Message Sending Flow
```
Frontend → Message Orchestrator → Redis Queue → Channel Service → Recipient
                    ↓
               WebSocket → Real-time UI Update
```

### 3. Lead Enrichment Flow
```
Lead ID → Enrichment Service → Parallel API Calls → Data Merge → AI Score → Cache → Database
```

## 🔒 Security Architecture

### Authentication & Authorization
```
┌─────────────────┐
│   User Login    │
└────────┬────────┘
         ▼
┌─────────────────┐
│ Supabase Auth   │──────▶ JWT Token
└────────┬────────┘
         ▼
┌─────────────────┐
│   RLS Policies  │──────▶ Row-level Security
└─────────────────┘
```

### API Security
- API Key authentication for external access
- Rate limiting per endpoint
- Request signing for webhooks
- CORS configuration per service

### Data Security
- Encryption at rest (Supabase)
- Encryption in transit (HTTPS/WSS)
- Session data encryption
- PII handling compliance

## 📈 Scalability Strategy

### Horizontal Scaling
```
Load Balancer (Nginx)
         │
    ┌────┴────┬────────┬────────┐
    ▼         ▼        ▼        ▼
Service 1  Service 2  Service 3  Service N
```

### Database Scaling
- Read replicas for analytics
- Connection pooling
- Materialized views for reports
- Partitioning for large tables

### Queue Scaling
- Redis Cluster for high availability
- Multiple queue workers per service
- Priority-based processing
- Dead letter queues

### Caching Strategy
- Service-level caching (Node-cache)
- Redis for shared cache
- CDN for static assets
- Database query caching

## 🔌 API Design

### RESTful Endpoints
```
POST   /api/leads                 Create lead
GET    /api/leads                 List leads
GET    /api/leads/:id            Get lead details
PATCH  /api/leads/:id            Update lead
POST   /api/leads/:id/enrich     Enrich lead data

POST   /api/messages/send        Send message
GET    /api/conversations/:id    Get conversation

POST   /api/campaigns            Create campaign
GET    /api/analytics/pipeline   Pipeline analytics
```

### WebSocket Events
```
Client → Server:
- subscribe: { channel: 'messages', leadId: '123' }
- send_message: { content: '...', recipient: '...' }

Server → Client:
- message_sent: { messageId: '...', status: 'delivered' }
- message_received: { from: '...', content: '...' }
- lead_updated: { leadId: '...', changes: {...} }
```

### Error Handling
```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Lead not found",
    "details": {
      "leadId": "123",
      "timestamp": "2024-01-15T10:00:00Z"
    }
  }
}
```

## 🚀 Deployment Architecture

### Production Environment
```
┌─────────────────────────────────────────────┐
│                   Internet                   │
└─────────────────┬───────────────────────────┘
                  │
         ┌────────▼────────┐
         │   Cloudflare    │ (DDoS Protection)
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │   Load Balancer │ (Nginx)
         └────────┬────────┘
                  │
    ┌─────────────┼─────────────┐
    │             │             │
┌───▼───┐    ┌───▼───┐    ┌───▼───┐
│Service│    │Service│    │Service│
│   1   │    │   2   │    │   N   │
└───┬───┘    └───┬───┘    └───┬───┘
    │             │             │
    └─────────────┼─────────────┘
                  │
         ┌────────▼────────┐
         │     Redis       │ (Queue + Cache)
         └────────┬────────┘
                  │
         ┌────────▼────────┐
         │    Supabase     │ (Database)
         └─────────────────┘
```

### Development Environment
```
Local Machine
    │
    ├── Frontend (Next.js) → localhost:3000
    ├── Message Orchestrator → localhost:3000
    ├── WhatsApp Service → localhost:3001
    ├── Lead Enrichment → localhost:3006
    ├── Redis → localhost:6379
    └── Supabase → Cloud
```

## 🔄 Continuous Integration/Deployment

### CI/CD Pipeline
```
GitHub Push → GitHub Actions → Build & Test → Deploy
                                      │
                                      ├── Frontend → Netlify
                                      └── Services → VPS/Cloud
```

### Deployment Strategy
- Blue-green deployment for zero downtime
- Rolling updates for microservices
- Database migrations via Supabase CLI
- Automated rollback on failure

## 📊 Monitoring & Observability

### Metrics Collection
```
Services → StatsD → Grafana Dashboard
    │
    └── Logs → Winston → Log Aggregator
```

### Key Metrics
- Request rate per service
- Queue depth and processing time
- Error rates and types
- Database query performance
- WebSocket connection count
- Memory and CPU usage

### Alerting Rules
- Service health checks failing
- Queue depth > threshold
- Error rate > 5%
- Response time > 2s
- Memory usage > 80%
- Database connections > 80%

## 🏆 Best Practices

### Code Organization
```
/services
  /message-orchestrator
    /src
      /controllers
      /services
      /utils
    index.js
    package.json
```

### Error Handling
- Graceful degradation
- Circuit breakers for external APIs
- Retry logic with exponential backoff
- Comprehensive error logging

### Testing Strategy
- Unit tests for business logic
- Integration tests for APIs
- End-to-end tests for critical flows
- Load testing for scalability

### Documentation
- OpenAPI specs for all APIs
- Service-level README files
- Architecture decision records
- Runbooks for common issues

---

This architecture is designed to support millions of users while maintaining full control and cost efficiency. Each component can be scaled independently based on demand, ensuring optimal resource utilization and performance.
>>>>>>> d7cb607cb02a9fa7b02a947c07e6d752835d0cdf

---

# 🚀 Leads Feature Spec (2024)

## Feature Objective
Design a smart and scalable /dashboard/leads page where users describe their target persona, and the system returns an enriched, AI-prioritized list of leads and their best contact strategies. These leads are saved automatically to a CRM-style pipeline.

### 🧱 FRONTEND (Next.js + TailwindCSS + Framer Motion)
- **Lead Input Form (top of page):**
  - Large text area with floating label: "Describe your ideal client (industry, role, location, budget, contact method, etc.)"
  - Optional filters (pill toggles/dropdowns):
    - Annual Revenue
    - Company Size
    - Country or City
    - Lead Role (e.g., CEO, Head of Marketing)
    - Preferred Contact Channel (WhatsApp, LinkedIn, Instagram, Facebook, X)
    - Business Needs (e.g. Paid Ads, Funnel, CRM, Outreach)
  - CTA Button: "Generate Leads" — with animated state (Framer Motion)

- **Results Grid (middle of page, after submission):**
  - Cards or rows showing:
    - Lead Full Name
    - Company + Role
    - Location + Timezone
    - Main Contact Channel (with icon)
    - Recommended Time + Day to Contact
    - Tags: “Needs Paid Ads”, “Ideal for SEO”
    - Option to “Save to Pipeline”

### 📁 BACKEND + SUPABASE
- **Tables to create:**
  - `lead_requests`: user_id, description_text, filters, status, created_at
  - `leads`: id, user_id, full_name, company_name, job_title, location, timezone, contact_channels, source, tags, suggested_services, best_contact_time, created_at
  - `crm_pipelines`: pipeline_id, user_id, lead_id, stage (To Contact, Contacted, In Conversation, Closed), notes, status, timestamps

- **Enrichment Logic:**
  - Use a Supabase Edge Function (`generate_leads.ts`) to:
    - Parse the user’s description input
    - Query the 4 data sources:
      - Apollo.io API
      - LinkedIn Sales Navigator API
      - Clearbit API
      - Crunchbase API
    - Rank results with LLM-enhanced scoring (e.g., GPT-4, Claude 4 Opus/Sonnet, Gemini 2.5 PRO)
    - Return top 20–30 enriched leads to the frontend

### 🧠 AI Role (LLM Prompt Logic)
- Analyze the user input + filters
- Score lead match based on ICP relevance
- Estimate the best time to contact based on time zone and role
- Suggest services the user’s company likely offers that solve their pain points

### ➕ Leads → CRM Flow
- When clicking “Save to Pipeline”, the lead is stored in:
  - `/dashboard/crm` under a new or existing pipeline
  - Pipeline board: columns = lead stages, cards = leads
  - Each lead retains full data, tags, contact channel and source

### 🧭 ROUTES STRUCTURE
| Route            | Description                  |
|------------------|-----------------------------|
| /leads           | Lead generation UI/results   |
| /dashboard/crm   | Pipeline/CRM board          |

### 🎨 UI Guidelines
- Visual design inspired by tradesflow.io and sounext.xyz
- Cards, toggles, dropdowns: animated with Framer Motion
- Minimalist, dark-themed interface
- Optimized for mobile + desktop responsiveness
- SEO-optimized with fast loading via App Router best practices

### ✅ Final Behavior Recap
1. User describes lead
2. Clicks “Generate Leads”
3. LLM + APIs return best matches
4. Leads display in frontend
5. User adds them to pipeline → CRM auto-populates
6. All data stored in Supabase + structured for messaging and analytics

---
