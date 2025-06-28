# Rarity Leads - Project Base Instructions

## Strategic Vision & Business Goals
Rarity Leads is an AI-powered SaaS platform by Rarity Agency, designed to revolutionize client acquisition for service-based businesses. Our mission is to automate and humanize lead capture, qualification, and follow-up, ensuring predictable lead generation and conversion.

**Key Business Goals:**
- Automate lead capture and qualification with AI.
- Humanize and personalize outreach at scale.
- Enable predictable, scalable client acquisition for agencies and service businesses.
- Deliver actionable analytics and campaign optimization.
- Provide a seamless, multilingual, and accessible user experience.

---

## User Personas & Their Needs
### 1. Agency Owner
- **Needs:** Predictable pipeline, less manual prospecting, clear ROI, scalable systems.
- **Pain Points:** Inconsistent lead flow, high acquisition cost, lack of visibility into team performance.

### 2. Performance Manager
- **Needs:** Campaign analytics, optimization tools, automation, reporting.
- **Pain Points:** Manual campaign management, fragmented data, slow feedback loops.

### 3. SDR/Setter
- **Needs:** Qualified leads, automated follow-ups, easy-to-use tools, less admin work.
- **Pain Points:** Wasting time on cold leads, repetitive manual messaging, low response rates.

### 4. Client
- **Needs:** Fast response, relevant offers, seamless onboarding, trust.
- **Pain Points:** Slow replies, generic outreach, lack of transparency, poor experience.

---

## Feature Specification - Modular Breakdown
### Feature 1: Automated Lead Capture & Qualification
- **User Story:** As an SDR, I want leads to be automatically captured and qualified so I can focus on closing deals.
- **Acceptance Criteria:**
  - Leads are captured from multiple sources (forms, APIs, integrations).
  - AI scoring and qualification is applied automatically.
  - Only qualified leads are routed to sales.
- **Technical Requirements:**
  - Integrations with web forms, APIs, and third-party sources.
  - AI/ML model for lead scoring (customizable rules).
  - Real-time processing and routing.

### Feature 2: AI-Powered Chatbot SDR
- **User Story:** As a business, I want an AI chatbot to engage, qualify, and book appointments with leads 24/7.
- **Acceptance Criteria:**
  - Chatbot can answer questions, qualify leads, and schedule calls.
  - Integrates with WhatsApp, web chat, and email.
  - Handover to human when needed.
- **Technical Requirements:**
  - NLP engine, WhatsApp Business API, calendar integration.
  - Customizable conversation flows.

### Feature 3: WhatsApp Automation Suite
- **User Story:** As a Performance Manager, I want to automate WhatsApp follow-ups so no lead is left behind.
- **Acceptance Criteria:**
  - Automated, personalized WhatsApp sequences.
  - Opt-out and compliance management.
  - Analytics on delivery, open, and reply rates.
- **Technical Requirements:**
  - WhatsApp Business API, sequence builder, analytics dashboard.

### Feature 4: Performance Media Campaign Manager
- **User Story:** As a Performance Manager, I want to launch and optimize paid campaigns from one place.
- **Acceptance Criteria:**
  - Integrate with Google Ads, Meta Ads.
  - Unified reporting and optimization suggestions.
- **Technical Requirements:**
  - Google/Meta Ads API, campaign builder, reporting engine.

### Feature 5: Landing Page Optimization Engine
- **User Story:** As an Agency Owner, I want to create and test landing pages to maximize conversions.
- **Acceptance Criteria:**
  - Drag-and-drop builder, A/B testing, analytics.
- **Technical Requirements:**
  - No-code builder, analytics, split-testing engine.

### Feature 6: Client Acquisition Analytics Dashboard
- **User Story:** As an Agency Owner, I want a dashboard to track all acquisition metrics in real time.
- **Acceptance Criteria:**
  - Real-time metrics, funnel visualization, exportable reports.
- **Technical Requirements:**
  - Data warehouse, charting library, export tools.

---

## Supabase Integration & Database Schema
- **Tables:**
  - public.profiles
  - public.clients
  - public.campaigns
  - public.leads
  - public.appointments
  - public.automation_sequences
  - public.conversations
  - public.lead_interactions
  - public.landing_pages
  - public.industries
  - public.campaign_creatives
  - public.sequence_steps
- **Requirements:**
  - Timestamps, auth.uid() RLS, indexes, JSONB for flexible data.

---

## API Documentation & Integration Points
- **Authentication:** Supabase Auth, JWT, RLS.
- **Core Endpoints:**
  - Leads: GET, POST, PUT
  - Campaigns: GET, POST, PUT
  - Conversations: GET, POST, PUT
  - Automation: GET, POST, PUT
  - Analytics: GET
- **External Integrations:** Facebook Ads API, WhatsApp Business API, Google Ads API, Meta Ads API.
- **Webhooks:** Lead created, lead qualified, appointment booked, campaign updated, conversation started.

---

## Automation Workflows & Best Practices
- **Lead Qualification Flow:**
  1. Capture lead
  2. AI scoring
  3. Route to SDR or nurture
- **Appointment Setting Flow:**
  1. Qualify lead
  2. Offer calendar slots
  3. Confirm and notify
- **Campaign Optimization Flow:**
  1. Monitor performance
  2. Suggest optimizations
  3. Apply changes
- **Best Practices:**
  - Use AI for first-touch and triage
  - Automate repetitive tasks
  - Human-in-the-loop for high-value actions

---

## Frontend Development Guidelines
- **Design System:**
  - Colors: #D50057, #9B00C8, #B044FF, #5DB5FF, #0046FF, #001A70
  - Font: BentoSans Regular (Google Fonts)
  - Accessibility: Mobile-first, SEO, WCAG 2.1
- **Technical Constraints:**
  - Pure HTML, CSS, JS (no frameworks)
  - i18n: JSON key-value, auto-detect browser language
  - Semantic HTML, clean class/ID naming
- **Homepage Structure:**
  - Hero, Features, Pricing, CTA, Trust Badges
  - Menu: Features, Pricing, Start for Free
- **Authentication Page:**
  - Unified register/login, Google OAuth, email/password, email verification
- **Dashboard/App:**
  - Sidebar, metrics, tabs, protected routes, session persistence, language switching

---

## Testing & QA Plan
- **Homepage:** Multilingual, scroll anchors
- **Auth:** Google/email, verification, redirection, route protection
- **App:** Sidebar, routing, session, logout
- **UI/UX:** Mobile, accessibility, RLS

---

## Deployment Roadmap
- **Phase 1:** Public homepage, auth page, i18n, Supabase setup
- **Phase 2:** Dashboard, sidebar, metrics, protected routes
- **Phase 3:** Core features (lead capture, chatbot, WhatsApp, campaigns)
- **Phase 4:** Analytics, reporting, advanced automations

---

**All code, features, and UI must strictly follow these base instructions.** 