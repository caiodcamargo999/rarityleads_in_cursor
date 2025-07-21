# Rarity Leads SaaS Build Plan (Temporary)

## 🎯 Step 1: Design System & UI/UX Foundation
### 1.1. Color, Typography, and Spacing
- Dark, tech-inspired palette: Deep backgrounds, high-contrast accent colors (purple, blue, green), subtle gradients only for highlights.
- Typography: Inter or Space Grotesk, 400/500/600 weights, 1.25–1.5 line height, 4px spacing system.
- Grid: 4/8/12 column responsive grid (mobile/tablet/desktop).
- Gestalt Principles:
  - Proximity: Group related actions/data.
  - Alignment: Consistent left/center alignment for forms, tables, and cards.
  - Similarity: Reusable button, card, badge, and input components.
  - Contrast: Clear visual hierarchy, strong CTA buttons.

### 1.2. Accessibility & Feedback
- WCAG 2.1 AA: Sufficient color contrast, focus rings, keyboard navigation.
- Feedback: All interactive elements have hover, focus, and active states (Framer Motion for micro-interactions).
- Motion: Use Framer Motion for page transitions, button taps, skeleton loaders, and subtle feedback (not distracting).

---

## 🟣 Step 2: Next.js App Router Structure
### 2.1. Public Pages
- `/` – Home (Hero, Features, Pricing, CTA, SEO-optimized)
- `/auth/login` & `/auth/register` – Auth (Google OAuth, email/password)
- `/pricing` – Pricing (anchor or separate page)

### 2.2. Dashboard (Protected)
- `/dashboard/overview` – KPIs, pipeline, quick actions
- `/dashboard/leads` – Table/grid, filters, AI sort, import/export
- `/dashboard/companies` – Directory, filters, add/import
- `/dashboard/outreach/[channel]` – WhatsApp, Instagram, LinkedIn, Facebook, X (Twitter)
- `/dashboard/analytics` – Charts, campaign stats
- `/dashboard/support` – Knowledge base, contact support

### 2.3. Navigation
- Sidebar (desktop): Collapsible, icons, badges, section headers (Anthropic/Tempo style)
- Bottom tab (mobile): 4–5 main tabs, floating action button for “Add Lead”
- Header (mobile): Language switch, notifications, profile

---

## 🟣 Step 3: WhatsApp Multi-Account Integration
### 3.1. Frontend
- `/dashboard/outreach/whatsapp/accounts` – List, connect, QR scan (via @whatsapp-web.js or Baileys)
- `/dashboard/outreach/whatsapp/conversations` – Real-time chat, message templates, lead linking

### 3.2. Backend (Supabase + Node)
- Tables: whatsapp_sessions, messages, leads, users
- Edge Functions: Webhook for incoming messages, session status
- Features: Persistent sessions, reconnect, multi-account, campaign tagging, template variables

---

## 🟣 Step 4: Speed & Performance Optimization
### 4.1. Next.js & Tailwind
- Image Optimization: Use next/image for all images/icons.
- Font Optimization: Preload Inter/Space Grotesk, use next/font.
- Critical CSS: Tailwind JIT, purge unused styles.
- SSR/ISR: Use SSR for dashboard, ISR for public pages.
- Skeleton Loaders: Framer Motion for all async data.

### 4.2. Bundle & SEO
- No heavy libraries: Only Framer Motion, Lucide, and Radix UI.
- SEO: Semantic HTML, Open Graph, meta tags, clean URLs, sitemap.xml, robots.txt.
- Lighthouse: Target 95+ for Performance, Accessibility, Best Practices, SEO.

---

## 🟣 Step 5: Backend (Supabase) & Security
### 5.1. Database
- Tables: users, leads, companies, campaigns, messages, analytics, whatsapp_sessions
- RLS: Row Level Security on all sensitive tables
- Realtime: Use Supabase Realtime for chat, notifications

### 5.2. Auth
- Email/password, Google OAuth, magic link
- Email verification, password reset
- GDPR compliance: Data export/delete, privacy policy

### 5.3. API
- Edge Functions: For WhatsApp webhooks, analytics, campaign triggers
- Optional Node.js Service: For WhatsApp session management if needed

---

## ✅ Final Goals Checklist
- ⚡ Ultra-fast: All pages load <2s, skeletons for async
- 📱 Fully responsive: Mobile-first, touch-friendly, bottom nav
- 🎨 Premium design: Modern, minimalist, beautiful
- 💼 B2B ready: Intuitive, professional, conversion-focused
- 🚀 SEO-optimized: All best practices, high Lighthouse scores
- 🔒 Privacy: GDPR, RLS, secure auth

---

## 🚀 Next Steps (Actionable)
- Audit your current codebase for:
  - Layout consistency (all pages use dashboard layout)
  - Sidebar and mobile nav
  - Page speed (Lighthouse, bundle size)
  - Accessibility (color contrast, focus, keyboard nav)
- Refactor components for modularity and reusability.
- Implement missing pages and placeholder routes.
- Set up Supabase tables, RLS, and Edge Functions.
- Add Framer Motion micro-interactions and skeletons.
- Run Lighthouse and fix any issues until all scores are 95+.
- Deploy and monitor with Vercel/Netlify analytics.

---

*This file is temporary and will be removed when the project is 100% complete.* 