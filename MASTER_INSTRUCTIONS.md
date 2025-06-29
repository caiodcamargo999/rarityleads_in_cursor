# Rarity Leads - Master Instructions

This document consolidates all essential instructions and knowledge for the Rarity Leads project, serving as the single source of truth for development, design, and deployment.

---

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
  - Colors: #a277ff (Roxo Primário), #232136 (Azul Escuro), #393552 (Cinza Escuro), #61ffca (Verde Água), #f694ff (Rosa Claro), #fff (Branco), #b8b8d1 (Cinza Claro)
  - Gradients: linear-gradient(135deg, #a277ff 0%, #61ffca 100%), linear-gradient(135deg, #f694ff 0%, #a277ff 100%)
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

---

## Project Overview (from .gemini/KnowledgeBase.md)

This is a lead generation platform that uses AI to help users find and qualify leads. The frontend is built with HTML, CSS, and vanilla JavaScript, and it uses Supabase for the backend.

## Development Workflow

### Running the Application

- **Development:** Use `npm run dev` to start the development server with `live-server` on port 3000.
- **Production:** Use `npm run start` to serve the files on port 8080.

### Testing

There are no automated tests configured. When adding new features, you should create or update an existing HTML file (like `dashboard-test.html`) to validate the functionality manually.

### Linting and Formatting

There are no specific linting or formatting rules. Please maintain the existing code style and format.

## Key Technologies and Libraries

### Supabase

- **Configuration:** The Supabase URL and anon key are located in `app-config.js`. **Never expose these keys in client-side code that is committed to the repository.**
- **Schema:** The database schema is defined in `supabase_schema.sql` and `supabase_schema_fixed.sql`. When making changes to the database, update these files accordingly.
- **Authentication:** The application uses Supabase Auth. The `auth-guard.js` file protects routes that require authentication.

### Internationalization (i18n)

- **Language Files:** The `i18n/` directory contains JSON files for each supported language.
- **Implementation:** The `i18n.js` file handles the translation logic. To add a new language, create a new JSON file in the `i18n/` directory and update `i18n.js` to include it.

## Code Conventions

- **JavaScript:** Use modern JavaScript (ES6+). All custom scripts are included at the end of the `<body>` tag in the HTML files.
- **CSS:** The project uses two main CSS files: `dashboard.css` for general styling and `rarity-design.css` for the design system. When adding new styles, decide which file is more appropriate.
- **File Naming:** Use kebab-case for all new files (e.g., `new-feature.html`).

## Deployment

Deployment is handled via Netlify's GitHub integration. Pushing to the `main` branch will trigger a new deployment. The `netlify.toml` file contains the deployment configuration.

---

## Gemini Code Assistant Knowledge Base (from .gemini/gemini-KnowledgeBase.md)

This document will be updated with information regarding bug fixes, UI/UX improvements, and other significant changes made to the project.

## Initial Setup

- **Date:** 2025-06-27
- **Operating System:** win32
- **Project Root:** C:\Users\55519\Desktop\DIGITAL MARKETING\SAAS AND APP DEVELOPMENT\Rarity Leads Saas\Rarity Leads in Cursor

## Project Overview (from GEMINI.md)

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Supabase (for database and authentication)
- **Key Libraries:** `@supabase/supabase-js`
- **Development Server:** `live-server`

## UI/UX Improvement Plan

**Goal:** Enhance the visual appeal and user experience across the application, focusing on consistency, readability, and modern aesthetics.

**Initial Steps:**
1.  **Analyze Existing CSS:** Reviewed `rarity-design.css` and `dashboard.css`.
    *   `rarity-design.css`: Defines core design system with CSS variables for colors, spacing, typography, and general component styles (buttons, cards, grid, flex, etc.). Includes responsive design rules and specific styles for authentication pages.
    *   `dashboard.css`: Focuses on dashboard layout (sidebar, header, content sections) and specific dashboard components (stats cards, analytics, activity lists, leads lists). Incorporates modern design elements like gradients, blur effects, and animations.
    *   **Overall Impression:** Both CSS files contribute to a modern design aesthetic with good use of gradients, shadows, and clear typography. The design system in `rarity-design.css` provides a strong base for consistency.

2.  **Identified Pages for Improvement:** All HTML pages will be improved systematically.

**General UI/UX Improvement Approach:**
*   **Consistency:** Ensure uniform appearance and behavior of common elements (buttons, forms, navigation, headers).
*   **Typography:** Optimize fonts, sizes, and spacing for improved legibility and visual hierarchy.
*   **Color Palette:** Apply a cohesive and appealing color scheme, leveraging existing CSS variables.
*   **Spacing & Layout:** Refine element spacing and overall layout for a cleaner, more organized look.
*   **Responsiveness:** Verify and enhance adaptability across various screen sizes (desktop, tablet, mobile).

## Page-Specific Improvements

### `index.html`
- **Description:** This page serves as a simple redirect to `dashboard.html`.
- **Improvements:** No UI/UX improvements are necessary as it's a functional redirect page with minimal visible content.

### `dashboard.html`
- **Description:** The main user dashboard, displaying key metrics, tabs for different views (funnel, calendar), and a sidebar navigation.
- **Improvements:**
    *   **Sidebar:**
        *   **Current State:** The sidebar is functional but visually basic. The logo is a simple text "Rarity Leads".
        *   **Transformation:**
            *   **Logo:** Replace text with an image (`rarity-logo.jpg`).
            *   **Header:** Add a subtle gradient background to the sidebar header.
            *   **Navigation Items:** Enhance hover and active states with a more prominent visual feedback (e.g., a glowing border or a subtle background change).
            *   **Icons:** Ensure Feather Icons are correctly integrated and styled.
            *   **Footer:** Improve the logout button's styling for better visual appeal and interaction.
    *   **Main Content:**
        *   **Header:**
            *   **Current State:** Basic header with title and user email.
            *   **Transformation:** Add a subtle background pattern or texture. Improve spacing and alignment of elements.
        *   **Metrics Grid:**
            *   **Current State:** Simple cards with metrics.
            *   **Transformation:** Add subtle animations on hover (e.g., slight lift, shadow change). Ensure consistent padding and alignment.
        *   **Tabs:**
            *   **Current State:** Functional tabs.
            *   **Transformation:** Enhance active tab indicator (e.g., a thicker, colored underline). Add smooth transition effects on tab change.
        *   **General:** Ensure consistent use of `rarity-design.css` variables for colors, fonts, and spacing.

## Bug Fixes

- **None yet.**

## Other Notes

- **Supabase Integration:** Ensure all UI elements correctly interact with Supabase for data fetching and authentication.
- **i18n:** All new UI elements must support internationalization.
