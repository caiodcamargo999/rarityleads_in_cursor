# 🎨 Rarity Leads - Design Rules & Standards

> **IMPORTANT: This document is the single source of truth for Rarity Leads frontend/web design. All legacy guidelines, gradients, glassmorphism, excessive bold, or deprecated styles are strictly forbidden. The design is dark, minimalist, tech-inspired, with no gradients, no glass, no bold above 500, flat sidebar, flat buttons, Inter font 400/500 only, allowed color palette, only subtle smooth animations, and a profile/theme/language panel in the bottom left corner.**

## 🎯 Design Philosophy

**Primary References:**
- **Main Reference:** [tempo.new](https://www.tempo.new/) - Modern, premium SaaS aesthetic
- **Secondary Reference:** [codecademy.com](https://www.codecademy.com/) - Tech, dark, minimalist, professional, educational
- **Tertiary Reference:** [sounext.xyz](https://www.sounext.xyz/) - Minimalist, dark, tech-inspired
- **Anthropic Console:** [console.anthropic.com/dashboard](https://console.anthropic.com/dashboard) - Minimalist, floating profile panel and settings, sidebar, and overall SaaS dashboard style
- **Anthropic Docs:** [docs.anthropic.com/en/docs/intro](https://docs.anthropic.com/en/docs/intro) - Minimalist, clean, accessible documentation and navigation style

**Core Principles:**
- Minimalist, dark, non-colorful design (inspired by Codecademy's clean interface)
- White, light, or colorful backgrounds are strictly forbidden
- Modern, tech-inspired with motion effects for premium SaaS feel
- Professional, educational approach with clear information hierarchy
- No example numbers in UI—only real data or zero
- All buttons must be visually consistent, functional, and never broken

---

## 🎨 Codecademy Design Influence

### Key Elements from Codecademy.com:
- **Clean, uncluttered interface** with plenty of whitespace
- **Professional, educational tone** in all copy and interactions
- **Clear information hierarchy** with logical content flow
- **Consistent navigation patterns** that users can rely on
- **Accessible design** that works for all users
- **Tech-focused aesthetic** that feels modern and trustworthy
- **Minimal color palette** with strategic use of accent colors
- **Responsive design** that works seamlessly across devices

### Applied to Rarity Leads:
- Sidebar navigation inspired by Codecademy's course navigation
- Card-based layouts for content organization
- Clear typography hierarchy for readability
- Professional button styling and interactions
- Consistent spacing and alignment throughout
- Dark theme with strategic use of contrast
- Educational approach to feature explanations

---

## 🎨 Color System

### Current Implementation Colors (Tailwind CSS)
```css
/* Primary Brand Colors */
--rarity-500: #8b5cf6;  /* Main purple */
--rarity-600: #7c3aed;  /* Primary button */
--rarity-700: #6d28d9;  /* Hover state */

/* Dark Theme Colors */
--dark-bg: #0a0a0a;           /* Main background */
--dark-bg-secondary: #18181c; /* Secondary background */
--dark-bg-tertiary: #232336;  /* Button backgrounds */
--dark-border: #232336;       /* Borders */
--dark-border-secondary: #404040;
--dark-text: #ffffff;         /* Primary text */
--dark-text-secondary: #a3a3a3; /* Secondary text */
--dark-text-muted: #737373;   /* Muted text */

/* Semantic Colors */
--success-600: #16a34a;
--warning-600: #d97706;
--error-600: #dc2626;
```

### **FORBIDDEN:**
- ❌ Glass morphism (backdrop-filter: blur)
- ❌ Colorful backgrounds (white, light colors)
- ❌ Excessive shadows or glows
- ❌ Bright accent colors
- ❌ Gradients or complex color transitions

---

## 📝 Typography

### Font Stack
```css
font-family: 'Inter', sans-serif;
```

### Font Weights (Only 2 allowed)
```css
font-weight: 400;  /* Regular text */
font-weight: 500;  /* Medium text (headings, buttons) */
```

### **FORBIDDEN:**
- ❌ font-weight: 600, 700, 800, 900 (excessive bolding)
- ❌ Multiple font families
- ❌ Decorative fonts

### Text Sizes
```css
/* Headings */
h1: 2.2em, font-weight: 500
h2: 1.8em, font-weight: 500
h3: 1.25em, font-weight: 500
h4: 1.1em, font-weight: 500

/* Body text */
body: 1em, font-weight: 400
small: 0.875em, font-weight: 400
```

---

## 🔘 Button Component

### Motion-Enabled Button System
All buttons throughout the app must use the `<Button />` component located at `src/components/ui/button.tsx`.

### Button Variants
```tsx
// Primary button (main actions)
<Button variant="primary" aria-label="Action description">
  Action Text
</Button>

// Secondary button (secondary actions)
<Button variant="secondary" aria-label="Action description">
  Action Text
</Button>

// Outline button (tertiary actions)
<Button variant="outline" aria-label="Action description">
  Action Text
</Button>

// Ghost button (subtle actions)
<Button variant="ghost" aria-label="Action description">
  Action Text
</Button>

// Danger button (destructive actions)
<Button variant="danger" aria-label="Action description">
  Action Text
</Button>

// Success button (positive actions)
<Button variant="success" aria-label="Action description">
  Action Text
</Button>
```

### Button Features
- **Motion-enabled:** Smooth hover and tap animations using Framer Motion
- **Accessible:** All buttons must have descriptive `aria-label` props
- **Loading states:** Built-in loading spinner for async actions
- **Consistent styling:** Rounded corners, premium design with proper spacing
- **Responsive:** Touch-friendly on all devices
- **Icon support:** Left/right icon positioning
- **Size variants:** sm, md, lg, xl, icon

### **REQUIRED:**
- ✅ Always use `<Button />` component, never raw `<button>` elements
- ✅ Always include descriptive `aria-label` prop
- ✅ Use appropriate variant for the action type
- ✅ Include loading state for async actions
- ✅ Consistent spacing and layout classes only

---

## 🧭 Sidebar Design

### Current Implementation
The sidebar uses the `Sidebar` component from `src/components/ui/sidebar.tsx` with the following features:

### Structure
```css
.sidebar {
  background: var(--dark-bg-secondary);
  width: 16rem; /* 256px */
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  border-right: 1px solid var(--dark-border);
}
```

### Navigation Links
```css
.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 0.75em;
  padding: 0.85em 2em;
  color: var(--dark-text);
  text-decoration: none;
  font-weight: 400;
  border-left: 3px solid transparent;
  transition: background 0.2s, color 0.2s;
}

.sidebar-nav a.active,
.sidebar-nav a:hover {
  background: var(--dark-bg-tertiary);
  color: var(--dark-text);
  border-left: 3px solid var(--dark-text);
}
```

### **REQUIRED: Logout & Profile Section at Bottom**
```css
.sidebar-logout {
  margin-top: auto;
  padding: 1.5em 2em 2em 2em;
  border-top: 1px solid var(--dark-border);
  background: var(--dark-bg-secondary);
  text-align: center;
}

.sidebar-logout-btn {
  width: 100%;
  background: var(--dark-bg-tertiary);
  color: var(--dark-text);
  border: none;
  border-radius: 6px;
  padding: 0.85em 0;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.sidebar-logout-btn:hover {
  background: var(--dark-border);
  color: #fff;
}
```

### Sidebar Sections
```css
.nav-section-title {
  color: var(--dark-text-secondary);
  font-size: 0.95em;
  padding: 1.2em 2em 0.5em 2em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 400;
}
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Desktop: Full layout */
@media (min-width: 901px) {
  .sidebar { width: 16rem; }
  .main-content { margin-left: 16rem; }
}

/* Tablet: Collapsed sidebar */
@media (max-width: 900px) {
  .sidebar { width: 3rem; min-width: 3rem; }
  .main-content { margin-left: 3rem; padding: 1.5rem 1rem; }
  .sidebar-nav a, .nav-section-title { padding-left: 1em; padding-right: 1em; }
}

/* Mobile: Stacked layout */
@media (max-width: 600px) {
  .dashboard-container { flex-direction: column; }
  .sidebar { position: relative; width: 100vw; height: auto; }
  .main-content { margin-left: 0; padding: 1rem; }
  .metrics-grid { grid-template-columns: 1fr; }
}
```

### **REQUIRED:**
- ✅ Mobile-first approach
- ✅ Touch-friendly interactions (44px minimum)
- ✅ Readable text at all sizes
- ✅ Functional navigation on all devices

---

## 🎭 Animations & Motion

### Allowed Animations
```css
/* Smooth transitions */
transition: background 0.2s, color 0.2s, transform 0.2s;

/* Slide animations */
@keyframes slideInRight {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Hover effects */
transform: translateY(-1px);
```

### Framer Motion Integration
- **Button animations:** Scale and shadow effects on hover/tap
- **Page transitions:** Smooth enter/exit animations
- **Component animations:** Staggered children animations
- **Loading states:** Shimmer effects and spinners

### **FORBIDDEN:**
- ❌ Excessive animations
- ❌ Glowing effects
- ❌ Bouncing or elastic animations
- ❌ Complex keyframe animations

---

## 📊 Dashboard Components

### Metric Cards
```css
.metric-card {
  background: var(--dark-bg-secondary);
  color: var(--dark-text);
  border-radius: 10px;
  border: 1px solid var(--dark-border);
  padding: 2em 1.5em;
  margin-bottom: 2em;
  box-shadow: none;
}
```

### Charts & Analytics
```css
.chart-card {
  background: var(--dark-bg-secondary);
  border: 1px solid var(--dark-border);
  border-radius: 10px;
  padding: 2em 1.5em;
  margin-bottom: 2em;
}
```

### **DATA RULE:**
- ✅ All numbers start at zero by default
- ✅ No example/fake data in UI
- ✅ Only real data or zero values

---

## 🏗️ Layout Structure

### Main Container
```css
.dashboard-container {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1 1 auto;
  margin-left: var(--sidebar-width);
  padding: 2.5rem;
  background: var(--dark-bg);
  min-height: 100vh;
}
```

### Grid Systems
```css
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 2em;
}
```

---

## 🚫 Strictly Forbidden

### Design Elements
- ❌ Glass morphism (backdrop-filter: blur)
- ❌ Bright or colorful backgrounds
- ❌ Excessive shadows or glows
- ❌ Font weights above 500
- ❌ Multiple font families
- ❌ Decorative fonts
- ❌ Emojis in UI text
- ❌ Example numbers in metrics
- ❌ Gradients or complex color transitions

### Layout Issues
- ❌ Broken buttons or links
- ❌ Inconsistent spacing
- ❌ Non-responsive design
- ❌ Missing logout button in sidebar
- ❌ Sidebar not at bottom of page

---

## ✅ Quality Checklist

### Before Deployment
- [ ] All pages use the new Button component
- [ ] No gradients or glass morphism (bg-gradient, backdrop-filter, blur)
- [ ] Only font-weight 400 and 500 used (no font-semibold, font-bold, etc.)
- [ ] Sidebar has logout button at bottom
- [ ] All buttons are functional and accessible
- [ ] Mobile responsive design
- [ ] No example numbers in UI
- [ ] Consistent color scheme
- [ ] Smooth transitions and animations
- [ ] Touch-friendly on mobile
- [ ] All interactive elements have aria-labels
- [ ] No excessive shadows or glows
- [ ] No colorful backgrounds (only dark theme colors)

### Testing
- [ ] Desktop layout (1200px+)
- [ ] Tablet layout (768px-1199px)
- [ ] Mobile layout (320px-767px)
- [ ] All interactive elements work
- [ ] Navigation is intuitive
- [ ] Performance optimized

---

## 📚 Implementation Guide

### 1. Use the Button Component
```tsx
import Button from '@/components/ui/button';

// Always use the Button component
<Button variant="primary" aria-label="Action description">
  Action Text
</Button>
```

### 2. Use Tailwind CSS Classes
```css
/* Use Tailwind classes instead of CSS variables */
bg-dark-bg          /* Main background */
text-dark-text      /* Primary text */
border-dark-border  /* Borders */
bg-rarity-600       /* Primary brand color */
```

### 3. Follow Component Structure
```tsx
// Page structure
<div className="min-h-screen bg-dark-bg flex">
  <Sidebar user={user} onProfileClick={handleProfileClick} />
  <main className="flex-1 lg:ml-64 p-6">
    {/* Page content */}
  </main>
  <FloatingProfilePanel 
    user={user}
    isVisible={isProfilePanelVisible}
    onClose={() => setIsProfilePanelVisible(false)}
    onLogout={handleLogout}
  />
</div>
```

### 4. Implement Sidebar Structure
```tsx
<Sidebar 
  user={user} 
  onProfileClick={() => setIsProfilePanelVisible(true)} 
/>
```

---

## 🚩 Sidebar Mandatory UI Rules

### 1. **Bottom Section: Profile/Settings & Logout (MUST HAVE)**
- Every sidebar **MUST** have a visually separated bottom section, always fixed at the bottom, containing:
  - A **Profile/Settings** button (with a modern icon, e.g., settings or user)
  - A **Logout** button
- This section must be visually distinct (border, spacing, background, etc.) and always visible on all app pages (Dashboard, Leads, Companies, Outreach, Analytics, Support, etc).
- Both buttons must be fully functional and styled according to the design system.

### 2. **Analytics & Support Section (MUST HAVE)**
- The **Analytics & Support** section in the sidebar must have:
  - **Extra vertical spacing** above it for clear separation from the previous section
  - A **modern, uppercase, letter-spaced section title** (see .nav-section-title in CSS)
  - A lighter, smaller font for a premium, minimalist look
- This section title must be visually distinct and beautiful, following the UI/UX standards of the project.

---

## 🟦 Profile, Theme, and Language Panel (Anthropic-Style, Bottom Left)

- After login, the theme switcher, language switcher, profile/settings, and logout controls must be grouped in a single, beautiful, minimalist floating panel in the **bottom left corner** of the app (inspired by https://console.anthropic.com/dashboard and https://docs.anthropic.com/en/docs/intro).
- This panel must be visually distinct (card style, subtle shadow, rounded corners), compact, and always accessible on all post-login pages (Dashboard, Leads, Companies, Outreach, Analytics, Support, Profile, etc).
- The panel must include:
  - User avatar or initials (circle)
  - User name and email (if available)
  - Profile/Settings link
  - Theme toggle (dark/light) - **NO EMOJIS**
  - Language switcher (dropdown)
  - Logout button
- The panel must be visually harmonious, minimalist, and strictly follow the Rarity Leads design system (no gradients, no glass, no excessive bolding, only allowed colors and font weights).
- The top-right language/theme switcher must be removed from all post-login pages.
- The panel must be responsive and accessible.

**This document is the single source of truth for Rarity Leads design. All developers must follow these rules without exception.**

## 🟦 Public/Pre-Login Pages: Tiny Anthropic-Style Language/Theme Toggle (Top Right)

- The sales page (index.html) and all public/pre-login pages must have a tiny, Anthropic-style language/theme toggle panel in the top right corner.
- This panel must be visually compact, minimalist, and strictly follow the Rarity Leads design system (no gradients, no glass, no excessive bolding, only allowed colors and font weights).
- The panel must use <div id="language-theme-toggle"></div> and be initialized with LanguageThemeToggle.init('language-theme-toggle') after DOMContentLoaded.
- No legacy or duplicate toggles are allowed.
- The panel must not interfere with the main navigation or hero section, and must always be accessible. 

## 🚫 Sales Page Change Rule (2024)
- No changes to the sales page (landing page) are allowed unless specifically requested in a prompt. All other UI/UX changes must not affect the sales page. 

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

**This document is the single source of truth for Rarity Leads design. All developers must follow these rules without exception.** 