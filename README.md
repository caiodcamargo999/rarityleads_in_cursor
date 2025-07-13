# 🚀 Rarity Leads - AI-Powered Lead Generation Platform

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://rarityleads.netlify.app/deploys)
[![GitHub](https://img.shields.io/github/license/caiodcamargo999/rarity-leads)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)

## 🌐 Live Demo
**🔗 (https://rarityleads.netlify.app/)**

Rarity Leads is a modern, AI-native platform for automated lead acquisition and qualification with bulletproof authentication. Built with Next.js, Tailwind CSS, and Framer Motion, featuring multi-channel outreach capabilities and comprehensive lead management.

## ✨ Features

- 🤖 **AI Lead Scoring** - Intelligent lead qualification and ranking
- 📱 **Multi-Channel Outreach** - WhatsApp, Instagram, Facebook, X, LinkedIn
- 🔐 **Bulletproof Authentication** - Google OAuth + email verification
- 🛡️ **Route Protection** - Secure access control with AuthGuard
- 🎯 **Precision Targeting** - Advanced filtering and segmentation
- 📊 **Real-time Analytics** - Performance tracking and insights
- 🌐 **Multi-language Support** - EN, PT-BR, ES, FR
- 📱 **Mobile-first Design** - Responsive across all devices
- ♿ **WCAG 2.1 Compliant** - Accessible to all users
- 🚀 **Fast Performance** - Optimized for speed

## Project Structure

```
rarity-leads/
├── src/
│   ├── app/                # Next.js app directory (routing, pages)
│   ├── components/         # Modular, motion-enabled React components
│   ├── lib/                # Utilities, motion variants, API helpers
│   ├── styles/             # Tailwind CSS config, global styles
│   └── i18n/               # Language files (en.json, pt-BR.json, etc)
├── public/                 # Static assets
├── tailwind.config.js      # Tailwind CSS configuration
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies and scripts
└── README.md               # Project documentation
```

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/caiodcamargo999/rarityleads_in_cursor_2.git
   cd rarityleads_in_cursor_2
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root with:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://yejheyrdsucgzpzwxuxs.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDg2NzQsImV4cCI6MjA2NDM4NDY3NH0.NzCJ8i3SKpABO6ykWRX3nHDYmjVB82KL1wfgaY3trM4
   ```
   (Add any other required environment variables as needed.)
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:3000` in your browser

## Development

### Prerequisites

- Node.js 18+
- Modern web browser
- Code editor (VSCode recommended)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/rarity-leads.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser

## 🚀 Deployment

### Deploy to Netlify

1. **Fork this repository** to your GitHub account

2. **Connect to Netlify:**
   - Go to [Netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your forked repository
   - Set build settings:
     - **Build command:** `npm run build`
     - **Publish directory:** `.`
   - Click "Deploy site"

3. **Configure Supabase:**
   - Update your environment variables in the Netlify dashboard with your Supabase credentials
   - Enable Google OAuth in Supabase dashboard
   - Set up email templates for verification

4. **Your site will be live at:** `https://your-site-name.netlify.app`

### Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `.next` and `public` directories to your hosting provider**

3. **Configure redirects** according to `netlify.toml`

## Design System

### Colors (Design System)

- Sidebar BG: `#101014`
- Main BG: `#18181c`
- Card BG: `#18181c`
- Button BG: `#232336`
- Button Hover BG: `#232136`
- Primary Text: `#e0e0e0`
- Secondary Text: `#b0b0b0`
- Border: `#232336`

**No gradients, glassmorphism, or excessive bold.**

### Typography

- Font: Inter (body), BentoSans or Plus Jakarta Sans (headers)
- Weights: 400 (Regular), 500 (Medium)

**No font weights above 500.**

### Motion & Animations
- Framer Motion for all major UI elements (buttons, cards, sections)
- AnimatePresence for route/page transitions
- useInView for scroll-based animations
- Subtle, premium-feel micro-interactions

## Accessibility

The platform follows WCAG 2.1 guidelines and includes:
- Semantic React structure
- ARIA labels where needed
- Keyboard navigation support
- High contrast ratios
- Screen reader compatibility

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS/Android)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by modern SaaS platforms
- Built for no-code compatibility
- Optimized for performance and accessibility

- ![CodeRabbit Pull Request Reviews](https://img.shields.io/coderabbit/prs/github/caiodcamargo999/rarityleads_in_cursor_2?utm_source=oss&utm_medium=github&utm_campaign=caiodcamargo999%2Frarityleads_in_cursor_2&labelColor=171717&color=FF570A&link=https%3A%2F%2Fcoderabbit.ai&label=CodeRabbit+Reviews)
