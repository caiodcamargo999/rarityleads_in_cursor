# 🚀 Rarity Leads - AI-Powered B2B Lead Generation Platform

A premium B2B SaaS platform for lead prospecting, multi-channel outreach, and AI-powered engagement. Built with Next.js, Supabase, and modern web technologies.

## ✨ Features

### 🎯 Core Features
- **AI-Powered Lead Discovery** - Automatically find and qualify leads using AI
- **Multi-Channel Outreach** - WhatsApp, LinkedIn, Instagram, Facebook, X
- **WhatsApp Multi-Account Management** - Connect multiple WhatsApp accounts
- **Real-time Analytics** - Track performance across all channels
- **Campaign Management** - Create and manage outreach campaigns
- **Lead Scoring** - AI-powered lead qualification (1-100 scale)

### 🏗️ Technical Features
- **Next.js 14** with App Router
- **Supabase** for backend (PostgreSQL, Auth, Realtime)
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **TypeScript** for type safety
- **Row Level Security** (RLS) for data protection
- **Responsive Design** - Mobile-first approach

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd rarity-leads
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# WhatsApp Service Configuration
WHATSAPP_SERVICE_URL=http://localhost:3001
WHATSAPP_SESSION_ENCRYPTION_KEY=your-secret-key-32-chars-long!!

# External API Keys (optional)
CLEARBIT_API_KEY=your-clearbit-api-key
APOLLO_API_KEY=your-apollo-api-key
CRUNCHBASE_API_KEY=your-crunchbase-api-key
```

### 4. Database Setup
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the schema from `supabase/schema.sql`
4. Verify all tables and policies are created

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
rarity-leads/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── auth/               # Authentication pages
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # Reusable components
│   │   ├── ui/                 # Shadcn/ui components
│   │   └── Sidebar.tsx         # Dashboard sidebar
│   ├── hooks/                  # Custom React hooks
│   │   └── useAuth.tsx         # Authentication hook
│   └── lib/                    # Utilities and configurations
│       └── supabase.ts         # Supabase client
├── supabase/
│   └── schema.sql              # Database schema
├── public/                     # Static assets
└── package.json
```

## 🎨 Design System

The application follows a dark, minimalist design inspired by:
- **Primary Reference**: [tradesflow.io](https://www.tradesflow.io/)
- **Secondary References**: [tempo.new](https://www.tempo.new/), [codecademy.com](https://www.codecademy.com/)

### Color Palette
- **Background**: #0A0A23 (Deep Blue)
- **Secondary Background**: #232136 (Slate Gray)
- **Card Background**: #18181c
- **Text Primary**: #e0e0e0 (White)
- **Text Secondary**: #b0b0b0 (Light Gray)
- **Accent**: #8B5CF6 (Purple)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium only)

## 🔐 Authentication

The application uses Supabase Auth with:
- Email/Password authentication
- Google OAuth
- Email verification
- Protected routes
- Session management

## 📊 Database Schema

### Core Tables
- **profiles** - User profiles and settings
- **leads** - Lead information and AI scores
- **companies** - Company data for prospecting
- **campaigns** - Outreach campaigns
- **messages** - Message history and status
- **whatsapp_sessions** - WhatsApp account sessions
- **analytics** - Performance metrics

### Row Level Security (RLS)
All tables have RLS enabled with policies ensuring users can only access their own data.

## 🚀 Deployment

### Netlify Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard
5. Deploy

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Add environment variables
3. Deploy

### Supabase Setup
1. Create a new Supabase project
2. Run the schema from `supabase/schema.sql`
3. Configure authentication providers
4. Set up email templates

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Code Style
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits

## 📱 Responsive Design

The application is fully responsive with:
- **Desktop**: Full sidebar layout
- **Tablet**: Collapsible sidebar
- **Mobile**: Stacked layout with overlay navigation

## 🔌 API Integration

### External APIs
- **Clearbit** - Company data enrichment
- **Apollo** - Lead discovery
- **Crunchbase** - Company information
- **LinkedIn Sales Navigator** - Lead data

### WhatsApp Integration
- Multi-account support
- QR code authentication
- Session persistence
- Real-time messaging

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📈 Analytics

The platform includes:
- Real-time performance metrics
- Campaign analytics
- Lead conversion tracking
- Channel performance comparison

## 🔒 Security

- Row Level Security (RLS) on all tables
- JWT token authentication
- HTTPS enforcement
- Input validation and sanitization
- Rate limiting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Contact the development team

## 🚀 Roadmap

### Phase 1 (Current)
- ✅ Basic authentication
- ✅ Dashboard layout
- ✅ WhatsApp integration
- ✅ Lead management

### Phase 2 (Next)
- [ ] Advanced analytics
- [ ] Multi-channel messaging
- [ ] AI lead scoring
- [ ] Campaign automation

### Phase 3 (Future)
- [ ] Mobile app
- [ ] Advanced AI features
- [ ] Enterprise integrations
- [ ] White-label solution

---

**Built with ❤️ for modern B2B lead generation**
