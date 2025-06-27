# 🚀 Rarity Leads - AI-Powered Lead Generation Platform

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://rarityleads.netlify.app/deploys)
[![GitHub](https://img.shields.io/github/license/caiodcamargo999/rarity-leads)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)

## 🌐 Live Demo
**🔗 (https://rarityleads.netlify.app/)**

Rarity Leads is a modern, AI-native platform for automated lead acquisition and qualification with bulletproof authentication. Built with pure HTML, CSS, and JavaScript, featuring multi-channel outreach capabilities and comprehensive lead management.

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
├── home.html              # Main homepage
├── register.html          # User registration
├── login.html             # User login
├── dashboard.html         # Main dashboard
├── analytics.html         # Analytics page
├── support.html           # Support center
├── prospecting-leads.html # Lead management
├── prospecting-companies.html # Company management
├── approaching-*.html     # Social media outreach pages
├── rarity-design.css      # Global styles
├── auth-guard.js          # Authentication protection
├── app-config.js          # Application configuration
├── navigation-manager.js  # Navigation logic
└── i18n/                  # Language files
    ├── en.json           # English translations
    ├── pt-BR.json        # Portuguese translations
    ├── es.json           # Spanish translations
    └── fr.json           # French translations
```

## Getting Started

1. Clone the repository
2. Open `home.html` in your browser
3. No build process required - it's pure HTML/CSS/JS!

## Development

### Prerequisites

- Modern web browser
- Text editor
- No build tools required

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/rarity-leads.git
   ```

2. Open the project in your favorite code editor

3. Start a local server (optional):
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

4. Open `http://localhost:8000` in your browser

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
   - Update `app-config.js` with your Supabase credentials
   - Enable Google OAuth in Supabase dashboard
   - Set up email templates for verification

4. **Your site will be live at:** `https://your-site-name.netlify.app`

### Manual Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Upload files** to your hosting provider

3. **Configure redirects** according to `netlify.toml`

## Design System

### Colors

- Primary: `#D50057`
- Secondary: `#9B00C8`
- Accent: `#B044FF`
- Info: `#5DB5FF`
- Link: `#0046FF`
- Dark: `#001A70`

### Typography

- Font: Bento Sans (Google Fonts)
- Weights: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)

## Accessibility

The platform follows WCAG 2.1 guidelines and includes:

- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Skip links
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
