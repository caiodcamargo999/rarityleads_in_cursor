# 🎨 Rarity Leads - Design Rules & Standards

> **IMPORTANT:** This document defines the official design system for Rarity Leads. All pages must follow these rules without exception.

## 🎯 Design Philosophy

**Primary References:**
- **Main Reference:** [tempo.new](https://www.tempo.new/) - Modern, premium SaaS aesthetic
- **Secondary Reference:** [codecademy.com](https://www.codecademy.com/) - Tech, dark, minimalist, professional, educational
- **Tertiary Reference:** [sounext.xyz](https://www.sounext.xyz/) - Minimalist, dark, tech-inspired

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

### Primary Colors
```css
--sidebar-bg: #101014;          /* Sidebar background */
--main-bg: #18181c;             /* Main background */
--card-bg: #18181c;             /* Card backgrounds */
--button-bg: #232336;           /* Button backgrounds */
--button-hover-bg: #232136;     /* Button hover state */
```

### Text Colors
```css
--primary-text: #e0e0e0;        /* Primary text */
--secondary-text: #b0b0b0;      /* Secondary text */
--sidebar-text: #e0e0e0;        /* Sidebar text */
--sidebar-text-secondary: #b0b0b0; /* Sidebar secondary text */
--button-text: #fff;            /* Button text */
```

### Borders & Accents
```css
--border: #232336;              /* Borders and separators */
--sidebar-link-active: #232336; /* Active sidebar link */
--sidebar-link-hover: #232336;  /* Sidebar link hover */
--logout-separator: #232336;    /* Logout section separator */
```

### **FORBIDDEN:**
- ❌ Gradients (linear-gradient, radial-gradient)
- ❌ Glass morphism (backdrop-filter: blur)
- ❌ Colorful backgrounds (white, light colors)
- ❌ Excessive shadows or glows
- ❌ Bright accent colors

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

## 🧭 Sidebar Design

### Structure
```css
.sidebar {
  background: var(--sidebar-bg);
  width: 220px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  border-right: 1px solid var(--border);
}
```

### Navigation Links
```css
.sidebar-nav a {
  display: flex;
  align-items: center;
  gap: 0.75em;
  padding: 0.85em 2em;
  color: var(--sidebar-text);
  text-decoration: none;
  font-weight: 400;
  border-left: 3px solid transparent;
  transition: background 0.2s, color 0.2s;
}

.sidebar-nav a.active,
.sidebar-nav a:hover {
  background: var(--sidebar-link-hover);
  color: var(--primary-text);
  border-left: 3px solid var(--primary-text);
}
```

### **REQUIRED: Logout & Profile Section at Bottom**
```css
.sidebar-logout {
  margin-top: auto;
  padding: 1.5em 2em 2em 2em;
  border-top: 1px solid var(--logout-separator);
  background: var(--sidebar-bg);
  text-align: center;
}

.sidebar-logout-btn {
  width: 100%;
  background: var(--button-bg);
  color: var(--button-text);
  border: none;
  border-radius: 6px;
  padding: 0.85em 0;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}

.sidebar-logout-btn:hover {
  background: var(--button-hover-bg);
  color: #fff;
  text-decoration: underline;
}
```

### Sidebar Sections
```css
.nav-section-title {
  color: var(--sidebar-text-secondary);
  font-size: 0.95em;
  padding: 1.2em 2em 0.5em 2em;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 400;
}
```

---

## 🔘 Button Design

### Standard Buttons
```css
.btn, .btn-primary, .btn-large {
  background: var(--button-bg);
  color: var(--button-text);
  border: none;
  border-radius: 6px;
  padding: 0.85em 2em;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.25s cubic-bezier(0.4,0,0.2,1), color 0.2s;
  text-decoration: none;
  display: inline-block;
}

.btn:hover, .btn-primary:hover, .btn-large:hover {
  background: #2d215a;
  color: #fff;
}
```

### **REQUIRED:**
- ✅ Always functional and never broken
- ✅ Consistent styling across all pages
- ✅ Hover effects with smooth transitions
- ✅ Clear visual feedback

---

## 📱 Responsive Design

### Breakpoints
```css
/* Desktop: Full layout */
@media (min-width: 901px) {
  .sidebar { width: 220px; }
  .main-content { margin-left: 220px; }
}

/* Tablet: Collapsed sidebar */
@media (max-width: 900px) {
  .sidebar { width: 60px; min-width: 60px; }
  .main-content { margin-left: 60px; padding: 1.5rem 1rem; }
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
  background: var(--card-bg);
  color: var(--primary-text);
  border-radius: 10px;
  border: 1px solid var(--border);
  padding: 2em 1.5em;
  margin-bottom: 2em;
  box-shadow: none;
}
```

### Charts & Analytics
```css
.chart-card {
  background: var(--card-bg);
  border: 1px solid var(--border);
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
  background: var(--main-bg);
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
- ❌ Gradients (linear-gradient, radial-gradient)
- ❌ Glass morphism (backdrop-filter: blur)
- ❌ Bright or colorful backgrounds
- ❌ Excessive shadows or glows
- ❌ Font weights above 500
- ❌ Multiple font families
- ❌ Decorative fonts
- ❌ Emojis in UI text
- ❌ Example numbers in metrics

### Layout Issues
- ❌ Broken buttons or links
- ❌ Inconsistent spacing
- ❌ Non-responsive design
- ❌ Missing logout button in sidebar
- ❌ Sidebar not at bottom of page

---

## ✅ Quality Checklist

### Before Deployment
- [ ] All pages use rarity-design.css
- [ ] No gradients or glass morphism
- [ ] Only font-weight 400 and 500 used
- [ ] Sidebar has logout button at bottom
- [ ] All buttons are functional
- [ ] Mobile responsive design
- [ ] No example numbers in UI
- [ ] Consistent color scheme
- [ ] Smooth transitions and animations
- [ ] Touch-friendly on mobile

### Testing
- [ ] Desktop layout (1200px+)
- [ ] Tablet layout (768px-1199px)
- [ ] Mobile layout (320px-767px)
- [ ] All interactive elements work
- [ ] Navigation is intuitive
- [ ] Performance optimized

---

## 📚 Implementation Guide

### 1. Include Design System
```html
<link rel="stylesheet" href="rarity-design.css">
```

### 2. Use CSS Variables
```css
background: var(--main-bg);
color: var(--primary-text);
```

### 3. Follow Button Pattern
```html
<button class="btn" data-action="example">Action</button>
```

### 4. Implement Sidebar Structure
```html
<div class="sidebar">
  <div class="sidebar-header">...</div>
  <nav class="sidebar-nav">...</nav>
  <div class="sidebar-logout">
    <button class="sidebar-logout-btn">Logout</button>
  </div>
</div>
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

**This document is the single source of truth for Rarity Leads design. All developers must follow these rules without exception.** 