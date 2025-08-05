# 🧠 Rarity Leads - AI-Powered Lead Generation Platform

> **Enterprise-grade B2B lead prospecting platform powered by AI, focused on automation, personalization, and scale for client acquisition by agencies and service companies.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Netlify](https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=for-the-badge&logo=netlify)](https://netlify.com/)

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn** package manager
- **Git** for version control
- **Supabase** account for database and auth
- **Netlify** account for frontend hosting

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd rarityleads_in_cursor_current_one

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Configure environment variables
nano .env.local

# Start development server
npm run dev
```

### Environment Variables
Create a `.env.local` file with the following variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://yejheyrdsucgzpzwxuxs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDg2NzQsImV4cCI6MjA2NDM4NDY3NH0.NzCJ8i3SKpABO6ykWRX3nHDYmjVB82KL1wfgaY3trM4
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODgwODY3NCwiZXhwIjoyMDY0Mzg0Njc0fQ.5s0WmC8H4QonZXrdvfiWeJy_aPitvpxakyX-hWAl0UA

# WhatsApp Service (if using microservice)
WHATSAPP_SERVICE_URL=http://localhost:3001
WHATSAPP_SERVICE_TOKEN=your-secret-token

# External APIs (optional)
CLEARBIT_API_KEY=your-clearbit-key
APOLLO_API_KEY=your-apollo-key
LINKEDIN_API_KEY=your-linkedin-key
CRUNCHBASE_API_KEY=your-crunchbase-key
```

## 🗄️ Supabase Setup & Database

### Quick Supabase Setup

#### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and API keys
3. Add them to your `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://yejheyrdsucgzpzwxuxs.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDg2NzQsImV4cCI6MjA2NDM4NDY3NH0.NzCJ8i3SKpABO6ykWRX3nHDYmjVB82KL1wfgaY3trM4
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODgwODY3NCwiZXhwIjoyMDY0Mzg0Njc0fQ.5s0WmC8H4QonZXrdvfiWeJy_aPitvpxakyX-hWAl0UA
   ```

#### 2. Run Database Schema
1. Open the Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the contents of `supabase/schema.sql`
4. Execute the script

#### 3. Deploy Edge Functions
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy all functions
supabase functions deploy
```

### Database Schema

#### Core Tables

**Users & Authentication**
- `auth.users` - Supabase Auth users (auto-created)
- `public.profiles` - Extended user profiles
- `public.user_settings` - User preferences and settings

**Lead Management**
- `public.leads` - Lead records with enrichment data
- `public.companies` - Company information
- `public.lead_requests` - Lead generation requests
- `public.crm_pipelines` - CRM pipeline management

**Communication**
- `public.campaigns` - Outreach campaigns
- `public.messages` - Message history
- `public.conversations` - Conversation threads
- `public.whatsapp_sessions` - WhatsApp session management

**Analytics**
- `public.analytics` - User analytics and metrics
- `public.user_activities` - User activity tracking

### Row Level Security (RLS)

All tables have RLS enabled with the following policies:

#### User Data Access
```sql
-- Users can only access their own data
CREATE POLICY "Users can view own data" ON table_name
FOR ALL USING (auth.uid() = user_id);
```

#### Admin Access
```sql
-- Admins can access all data
CREATE POLICY "Admins can view all data" ON table_name
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Edge Functions

#### AI Message Generation
**Function**: `ai-generate-message`
**Purpose**: Generate personalized messages using AI
**Trigger**: HTTP request from frontend
**Input**: Lead data, context, tone
**Output**: Generated message text

#### AI Lead Scoring
**Function**: `ai-scoring`
**Purpose**: Score leads using AI algorithms
**Trigger**: After lead enrichment
**Input**: Lead data, company info, engagement history
**Output**: Score (0-100) and recommendations

#### Lead Generation
**Function**: `generate_leads`
**Purpose**: Generate leads from multiple sources
**Trigger**: User lead request
**Input**: Target criteria, filters
**Output**: Enriched lead list

#### Session Cleanup
**Function**: `session-cleanup`
**Purpose**: Clean up expired sessions
**Trigger**: Scheduled (daily)
**Input**: None
**Output**: Cleanup report

### Security Configuration

#### Authentication
- **Email/Password**: Standard Supabase Auth
- **Google OAuth**: Configured for social login
- **Magic Links**: Passwordless authentication
- **MFA**: Multi-factor authentication support

#### Database Security
- **RLS**: Row Level Security on all tables
- **Encryption**: Data encrypted at rest
- **Backups**: Automatic daily backups
- **Audit Logs**: All changes logged

#### API Security
- **Rate Limiting**: Built into Supabase
- **CORS**: Configured for frontend domains
- **JWT**: Secure token-based authentication

### Performance Optimization

#### Indexes
```sql
-- Performance indexes for common queries
CREATE INDEX idx_leads_user_id ON public.leads(user_id);
CREATE INDEX idx_leads_created_at ON public.leads(created_at);
CREATE INDEX idx_messages_conversation_id ON public.messages(conversation_id);
CREATE INDEX idx_analytics_user_date ON public.analytics(user_id, date);
```

#### Connection Pooling
- **Pool Size**: Configured for optimal performance
- **Connection Limits**: Set to prevent overload
- **Query Timeout**: 30 seconds default

#### Caching Strategy
- **Query Cache**: Enable for frequently accessed data
- **CDN**: Static assets served via CDN
- **Browser Cache**: Optimized cache headers

### Migration Strategy

#### Development
1. Make schema changes in `supabase/schema.sql`
2. Test locally with Supabase CLI
3. Deploy to staging environment
4. Run integration tests
5. Deploy to production

#### Production Deployments
1. **Backup**: Create database backup
2. **Test**: Run migrations on staging
3. **Deploy**: Apply migrations to production
4. **Verify**: Check data integrity
5. **Monitor**: Watch for performance issues

#### Rollback Plan
1. **Quick Rollback**: Revert to previous schema
2. **Data Recovery**: Restore from backup if needed
3. **Downtime**: Minimize with blue-green deployment

### Supabase Testing

#### Database Tests
```bash
# Run schema validation
supabase db lint

# Test migrations
supabase db reset

# Run integration tests
npm run test:db
```

#### Edge Function Tests
```bash
# Test functions locally
supabase functions serve

# Deploy and test
supabase functions deploy
curl -X POST https://your-project.supabase.co/functions/v1/function-name
```

### Supabase Monitoring

#### Database Metrics
- **Query Performance**: Monitor slow queries
- **Connection Count**: Track active connections
- **Storage Usage**: Monitor database size
- **Error Rates**: Track failed operations

#### Edge Function Metrics
- **Execution Time**: Monitor function performance
- **Error Rates**: Track function failures
- **Memory Usage**: Monitor resource consumption
- **Invocation Count**: Track usage patterns

### Supabase Troubleshooting

#### Common Issues

**Connection Errors**
```bash
# Check Supabase status
curl https://status.supabase.com

# Verify environment variables
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**RLS Policy Issues**
```sql
-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Test policy access
SELECT * FROM public.profiles WHERE id = auth.uid();
```

**Edge Function Errors**
```bash
# Check function logs
supabase functions logs

# Test function locally
supabase functions serve
curl -X POST http://localhost:54321/functions/v1/function-name
```

#### Debug Commands
```bash
# Connect to database
supabase db connect

# View recent logs
supabase logs

# Check project status
supabase status
```

## 📚 Documentation

### Core Documentation
- **[RARITYLEADS_ULTIMATE_GUIDE.md](./RARITYLEADS_ULTIMATE_GUIDE.md)** - Complete project guide, features, and technical specifications
- **[DESIGN_RULES.md](./DESIGN_RULES.md)** - Design system, UI/UX standards, and visual requirements
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture, microservices, and technical decisions
- **[PERFORMANCE_OPTIMIZATION.md](./PERFORMANCE_OPTIMIZATION.md)** - Performance guidelines and optimization strategies

### Setup Guides
- **[WHATSAPP_SETUP_GUIDE.md](./WHATSAPP_SETUP_GUIDE.md)** - WhatsApp integration and microservice setup
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Common issues and solutions

### Development
- **[RARITYLEADS_SAAS_BUILD_PLAN.md](./RARITYLEADS_SAAS_BUILD_PLAN.md)** - Development roadmap and build plan
- **[DESIGN_SYSTEM_COMPLIANCE.md](./DESIGN_SYSTEM_COMPLIANCE.md)** - Design system compliance and audit tools

## 🏗️ Project Structure

```
rarityleads_in_cursor_current_one/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── auth/              # Authentication pages
│   │   ├── api/               # API routes
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   ├── leads/            # Lead-specific components
│   │   └── prospecting/      # Prospecting components
│   ├── hooks/                # Custom React hooks
│   ├── i18n/                 # Internationalization
│   │   └── locales/          # Translation files
│   ├── lib/                  # Utility functions
│   └── integrations/         # External integrations
├── supabase/                 # Database schema and functions
│   ├── schema.sql           # Complete database schema
│   └── functions/           # Supabase Edge Functions
│       ├── ai-generate-message/
│       ├── ai-scoring/
│       ├── generate_leads/
│       └── session-cleanup/
├── services/                 # Microservices
├── public/                   # Static assets
└── scripts/                  # Build and utility scripts
```

## 🎯 Key Features

### 🤖 AI-Powered Lead Generation
- **Smart Lead Qualification**: AI identifies and qualifies prospects
- **Multi-Source Enrichment**: Clearbit, Apollo, LinkedIn, Crunchbase integration
- **Predictive Scoring**: ML-based lead scoring and prioritization
- **Personalized Outreach**: AI-generated personalized messages

### 📱 Multi-Channel Communication
- **WhatsApp Business**: Multi-account management with Baileys
- **LinkedIn Outreach**: Automated LinkedIn messaging
- **Instagram DMs**: Instagram private API integration
- **Facebook Messenger**: Facebook page messaging
- **X (Twitter)**: Twitter API v2 integration

### 📊 Analytics & Reporting
- **Real-time Metrics**: Live pipeline and campaign tracking
- **Advanced Analytics**: Predictive analytics and ROI tracking
- **Custom Dashboards**: Role-based dashboard customization
- **Performance Insights**: AI-powered optimization suggestions

### 🔐 Security & Compliance
- **GDPR Compliant**: Full data protection compliance
- **SOC 2 Ready**: Enterprise-grade security
- **Row Level Security**: Supabase RLS policies
- **Multi-factor Auth**: Enhanced authentication security

## 🌐 Internationalization

The platform supports multiple languages:
- **English (en)** - Primary language
- **Spanish (es)** - Español
- **French (fr)** - Français  
- **Portuguese (pt)** - Português

Translation files are located in `src/i18n/locales/` and follow a structured JSON format.

## 🚀 Deployment

### Frontend (Netlify)
```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod
```

### Backend Services
```bash
# Deploy microservices to VPS/Cloud
cd services/whatsapp-service
npm run deploy

# Configure environment variables
# Set up SSL certificates
# Configure load balancer
```

### Database (Supabase)
```bash
# Run schema migrations
supabase db push

# Deploy Edge Functions
supabase functions deploy
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e

# Run with coverage
npm run test:coverage
```

## 📈 Performance

- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Lighthouse Score**: Target 95+ across all metrics
- **Bundle Size**: Optimized with code splitting and tree shaking
- **Caching**: CDN, service workers, and Redis caching

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the [Design Rules](./DESIGN_RULES.md) for all UI/UX changes
- Use TypeScript for all new code
- Write tests for new features
- Follow the established code style and patterns
- Update documentation for any API changes

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

- **Documentation**: Check the guides in this repository
- **Issues**: Create an issue on GitHub
- **Community**: Join our developer community
- **Email**: support@rarityleads.com

## 🔗 Links

- **Live Demo**: [https://rarityleads.com](https://rarityleads.com)
- **Documentation**: [https://docs.rarityleads.com](https://docs.rarityleads.com)
- **API Reference**: [https://api.rarityleads.com](https://api.rarityleads.com)

---

**Built with ❤️ by the Rarity Leads Team**

*This README is the entry point for all project documentation. For detailed information, refer to the specific documentation files listed above.* 