# 🧠 Rarity Leads - Ultimate Guide

> **IMPORTANT: All frontend and web design guidelines must strictly follow the system defined in DESIGN_RULES.md. Any mention of gradients, glassmorphism, vivid colors, excessive bold, or legacy styles is strictly forbidden and must be ignored. The design is dark, minimalist, tech-inspired, with no gradients, no glass, no bold above 500, flat sidebar, flat buttons, Inter font 400/500 only, allowed color palette, only subtle smooth animations, and a profile/theme/language panel in the bottom left corner.**

> **DESIGN RULE:** The entire project must use a minimalist, dark, non-colorful design. White, light, or colorful backgrounds are strictly forbidden. No example numbers (e.g., 12, 0, 7, etc.) should appear anywhere in the UI—only real data or zero. All UI/UX must be modern, tech-inspired, and include motion effects for a premium SaaS feel. The sidebar menu must always include every prospecting channel as in the dashboard. All buttons must be visually consistent, functional, and never broken. The Sign In button must always work and be visually correct.

> **MAJOR DESIGN REFERENCES:** The primary web and motion design reference for the entire project is [tradesflow.io](https://www.tradesflow.io/) - featuring clean typography, professional layout, subtle animations, and modern SaaS aesthetic. Secondary references include [tempo.new](https://www.tempo.new/), [codecademy.com](https://www.codecademy.com/), [sounext.xyz](https://www.sounext.xyz/), [console.anthropic.com/dashboard](https://console.anthropic.com/dashboard), and [docs.anthropic.com/en/docs/intro](https://docs.anthropic.com/en/docs/intro). All pages (Sales, Auth, Dashboard, Leads, etc.) must follow the minimalist, dark, tech-inspired, and motion-rich style of these references. All buttons and interactive elements must always work and have a premium, animated feel.

This is the single source of truth for the Rarity Leads project. It covers vision, features, design, database, deployment, copywriting, and all technical and business steps for building, launching, and maintaining the platform.

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

## 🚀 Deployment & Infrastructure
- Netlify: automatic deploy via GitHub
- Supabase: database, auth, storage, edge functions
- Monitoring: performance, errors, uptime, usage analytics

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

## 1. Project Overview
Rarity Leads is an AI-powered B2B lead generation platform with bulletproof authentication, multi-channel outreach, and a modern, premium SaaS design. Built with Next.js, Tailwind CSS, Framer Motion, and Supabase.

## 2. Strategic Vision & Personas
- **Vision:** Automate and humanize lead capture, qualification, and follow-up for agencies and service businesses.
- **Personas:**
  - Agency Owner: Predictable pipeline, less manual work, clear ROI
  - Performance Manager: Analytics, automation, reporting
  - SDR/Setter: Qualified leads, automated follow-ups
  - Client: Fast response, relevant offers, seamless onboarding

## 3. Features & Architecture
- **Frontend:** Next.js (React), Tailwind CSS, Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **Hosting:** Netlify (CDN, CI/CD)
- **Authentication:** Google OAuth, Email/Password, route protection, persistent sessions
- **Pages:**
  - Public: / (Home), /auth (Register/Login)
  - Protected: /dashboard, /analytics, /support, /prospecting/leads, /prospecting/companies, /approaching/whatsapp, /approaching/instagram, /approaching/facebook, /approaching/x, /approaching/linkedin
- **Core System Files:** Modular Next.js pages and components, Tailwind CSS config, Framer Motion variants, i18n JSON files

## 4. Design System & Copywriting
### Color Palette (Inspired by tempo.new)
- Deep Blue: #0A0A23
- Slate Gray: #232136
- Light Gray: #E5E7EB
- Darker Purple: #6D28D9
- Accent Orange: #F59E0B
- Accent Pink: #EC4899
- Glass Morphism: rgba(255,255,255,0.08-0.15)
- Text: #FFFFFF (primary), #A1A1AA (secondary)

### Gradients
- Primary: linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #F59E0B 100%)

### Fonts
- 'Inter', BentoSans Regular

### Accessibility
- Mobile-first, SEO, WCAG 2.1

### Components
- Buttons, cards, grids, navigation, modular React components, micro-interactions (motion-enabled)

### Copywriting (Landing Page)
- **Hero:**
  - Headline: "AI-powered warm lead hunting for faster deals, deeper conversations, and scalable outreach — with zero guesswork."
  - Subheadline: "Rarity Leads is your AI-native platform to attract, qualify, and close clients — without the manual grind."
  - CTA: "Start for Free"
- **Features:**
  - "AI-Powered SDR That Qualifies Leads for You"
  - "Smart WhatsApp Follow-ups, No Manual Messaging"
  - "Campaign Intelligence for Google and Meta"
- **Pricing:**
  - "Simple Pricing for Scalable Growth"
  - Starter, Pro, Enterprise (clear features, "Start for Free" CTA)
- **Final CTA:**
  - Headline: "Stop Chasing Leads. Start Closing."
  - Button: "Get Started"
  - Trust Badges: "4.9 Stars on Clutch", "1,200+ Clients", "AI-Powered and Human-Approved"

## 5. Supabase Setup (Database & Email)
### Database Setup
1. Go to your Supabase dashboard and open SQL Editor.
2. Copy and run the schema from `supabase_schema.sql`.
3. Verify tables: user_profiles, phone_numbers, whatsapp_accounts, leads, companies, campaigns, messages, campaign_analytics, etc.
4. Ensure RLS (Row Level Security) is enabled and policies are applied.
5. Test with:
   - Table creation
   - RLS enforcement
   - AI scoring function

### Email Setup
1. In Supabase Dashboard, go to Authentication > Settings > Email.
2. Configure SMTP (recommended for production):
   - SMTP Host: smtp.gmail.com (or your provider)
   - SMTP Port: 587
   - SMTP User: your-email@gmail.com
   - SMTP Pass: app-specific password
3. Enable email confirmations in Authentication > Settings.
4. Set up redirect URLs for your Netlify domain and localhost.
5. Customize email templates for verification.
6. Enable Google OAuth provider and configure allowed origins/redirects.
7. Test registration, email delivery, and Google OAuth.

## 6. Deployment (Step-by-Step)
### GitHub Repository
1. Clone or create your repository:
   ```bash
   git clone https://github.com/caiodcamargo999/rarityleads_in_cursor_2.git
   cd rarity-leads
   ```
2. Add remote, commit, and push changes as needed.

### Netlify Deployment
1. Connect your repo to Netlify.
2. Set build command: `npm run build`
3. Set publish directory: `.` (root)
4. Deploy site (auto-deploy on push to main branch)
5. Add custom domain and configure DNS if needed.
6. Set environment variables in Netlify dashboard.

## 7. Deployment Checklist
### Pre-Deployment
- [ ] All 13 pages work correctly
- [ ] Authentication flow tested
- [ ] Route protection working
- [ ] All social media pages load
- [ ] Support center FAQ functional
- [ ] Internationalization working
- [ ] Mobile responsiveness verified
- [ ] No console errors

### Configuration
- [ ] Supabase credentials correct in app-config.js
- [ ] netlify.toml redirects configured
- [ ] package.json scripts correct
- [ ] All file references updated

### GitHub
- [ ] Repo ready, all files committed
- [ ] Push to main branch

### Netlify
- [ ] Site deployed, custom domain set
- [ ] Environment variables set

### Supabase
- [ ] Google OAuth enabled
- [ ] Email confirmations enabled
- [ ] Redirect URLs set
- [ ] Email templates customized

### Testing
- [ ] Homepage loads
- [ ] Registration/login works
- [ ] Route protection enforced
- [ ] All pages accessible
- [ ] Mobile responsive
- [ ] Performance optimized

## 8. Testing & QA
- Authentication: Google OAuth, email/password, email verification, session persistence
- Page Functionality: All pages load, navigation works, responsive design, i18n
- Security: Protected routes, redirects, session validation, sign-out
- Performance: Load time < 2s, Lighthouse 95+, mobile responsive, cross-browser
- Monitoring: Netlify analytics, error tracking, user feedback
- Backup: GitHub, Netlify, Supabase

## 9. Support & Maintenance
- Netlify analytics and monitoring
- Error tracking via browser console
- User feedback via support page
- Code and data backed up on GitHub and Supabase
- Supabase data backup enabled

## 10. Roadmap & Next Steps
- Add custom domain
- Integrate Google Analytics
- Set up uptime monitoring
- Optimize SEO and meta tags
- Implement caching strategies
- Expand features: A/B testing, performance audit, accessibility, dark/light toggle, mobile app

---

**This guide is a living document. Always consult it for the latest on building, deploying, and maintaining Rarity Leads.** 

## Web Design References
All visual and UI/UX decisions are inspired by:
- **PRIMARY REFERENCE:** [tradesflow.io](https://www.tradesflow.io/) - The main design inspiration featuring exceptional modern SaaS design, clean typography, professional layout, subtle animations, and premium user experience
- The modern, premium SaaS aesthetic of [tempo.new](https://www.tempo.new/)
- The tech-focused, educational, and professional design of [codecademy.com](https://www.codecademy.com/)
- The minimalist, dark, tech-inspired style of [sounext.xyz](https://www.sounext.xyz/)

## Dashboard & UI/UX (Premium Summary)
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

## Supabase Setup (Database & Email)
- See the database schema in `supabase_schema.sql`.
- Enable RLS (Row Level Security) and apply policies.
- Configure SMTP for email confirmations and Google OAuth for authentication.
- Set up redirect URLs for Netlify and localhost.
- Test registration, email delivery, and Google OAuth.

## Deployment (Step-by-Step)
1. Clone or create your GitHub repository.
2. Connect your repo to Netlify.
3. Set build command: `npm run build` and publish directory: `.`
4. Deploy site (auto-deploy on push to main branch).
5. Add custom domain and configure DNS if needed.
6. Set environment variables in Netlify dashboard.

## Deployment Checklist
- All pages work correctly
- Authentication and route protection tested
- All social media and support pages load
- Internationalization and mobile responsiveness verified
- No console errors
- Supabase credentials and Netlify config correct
- Google OAuth and email confirmations enabled
- All tests passed, site is live and functional

## Testing & QA
- Authentication: Google OAuth, email/password, email verification, session persistence
- Page Functionality: All pages load, navigation works, responsive design, i18n
- Security: Protected routes, redirects, session validation, sign-out
- Performance: Load time < 2s, Lighthouse 95+, mobile responsive, cross-browser
- Monitoring: Netlify analytics, error tracking, user feedback
- Backup: GitHub, Netlify, Supabase

## Support & Maintenance
- Netlify analytics and monitoring
- Error tracking via browser console
- User feedback via support page
- Code and data backed up on GitHub and Supabase
- Supabase data backup enabled

## Roadmap & Next Steps
- Add custom domain
- Integrate Google Analytics
- Set up uptime monitoring
- Optimize SEO and meta tags
- Implement caching strategies
- Expand features: A/B testing, performance audit, accessibility, dark/light toggle, mobile app

---

**This guide is a living document. Always consult it for the latest on building, deploying, and maintaining Rarity Leads.** 

# UI/UX Redesign Rules (2024)

> **IMPORTANT:** As of 2024, the following design system is the only allowed style for Rarity Leads. All previous design systems, gradients, glassmorphism, and excessive bolding are deprecated and forbidden.

**Design System Rules:**
- Inspired by Codecademy: tech, dark, minimalist, and professional.
- No gradients, glassmorphism, or unnecessary shadows.
- No excessive bolding. Only two font weights allowed: 400 (regular), 500 (medium).
- Sidebar: flat, modern, background #101014, always on the left, with navigation links and the logout button always at the bottom, visually separated.
- Main background: #18181c. All cards and sections use this or a similar dark tone.
- Text: #e0e0e0 (primary), #b0b0b0 (secondary).
- Buttons: #232336 background, white text, subtle border or underline on hover, flat style.
- All navigation and icons: simple, monochrome, tech-inspired.
- All pages (public and app) must use this system. No exceptions.
- All previous design systems, gradients, glass, and bolding are deprecated.

---

## Supabase Schema & Migration Files

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