-- =====================================================
-- RARITY LEADS - SUPABASE DATABASE SCHEMA
-- Complete database structure for AI-powered lead generation platform
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- USERS & AUTHENTICATION
-- =====================================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    company_name VARCHAR(255),
    phone VARCHAR(50),
    avatar_url TEXT,
    subscription_plan VARCHAR(50) DEFAULT 'starter' CHECK (subscription_plan IN ('starter', 'pro', 'enterprise')),
    subscription_status VARCHAR(50) DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired', 'trial')),
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings and preferences
CREATE TABLE public.user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(100) DEFAULT 'UTC',
    email_notifications BOOLEAN DEFAULT true,
    sms_notifications BOOLEAN DEFAULT false,
    marketing_emails BOOLEAN DEFAULT true,
    theme VARCHAR(20) DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PHONE NUMBERS & WHATSAPP ACCOUNTS
-- =====================================================

-- Phone numbers for multi-account management
CREATE TABLE public.phone_numbers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    phone_number VARCHAR(20) NOT NULL,
    country_code VARCHAR(5) NOT NULL,
    is_whatsapp_enabled BOOLEAN DEFAULT false,
    whatsapp_account_id VARCHAR(255),
    whatsapp_business_account_id VARCHAR(255),
    verification_status VARCHAR(20) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'failed', 'expired')),
    is_active BOOLEAN DEFAULT true,
    is_primary BOOLEAN DEFAULT false,
    last_validated_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, phone_number)
);

-- WhatsApp account configurations
CREATE TABLE public.whatsapp_accounts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    phone_number_id UUID REFERENCES public.phone_numbers(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    account_name VARCHAR(255) NOT NULL,
    api_token TEXT,
    webhook_url TEXT,
    business_profile JSONB,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'pending')),
    daily_message_limit INTEGER DEFAULT 1000,
    messages_sent_today INTEGER DEFAULT 0,
    last_message_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LEADS & CONTACTS
-- =====================================================

-- Companies/Organizations
CREATE TABLE public.companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255),
    industry VARCHAR(100),
    size_category VARCHAR(50) CHECK (size_category IN ('startup', 'small', 'medium', 'large', 'enterprise')),
    employee_count INTEGER,
    annual_revenue BIGINT,
    location VARCHAR(255),
    country VARCHAR(100),
    description TEXT,
    website_url TEXT,
    linkedin_url TEXT,
    founded_year INTEGER,
    technologies JSONB, -- Array of technologies used
    funding_info JSONB, -- Funding rounds, investors, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads/Contacts
CREATE TABLE public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    job_title VARCHAR(255),
    department VARCHAR(100),
    seniority_level VARCHAR(50) CHECK (seniority_level IN ('junior', 'mid', 'senior', 'director', 'vp', 'c-level')),
    linkedin_url TEXT,
    twitter_url TEXT,
    lead_score INTEGER DEFAULT 0 CHECK (lead_score >= 0 AND lead_score <= 100),
    status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'opportunity', 'customer', 'lost')),
    source VARCHAR(100), -- linkedin, facebook, google, referral, etc.
    tags JSONB, -- Array of tags
    notes TEXT,
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    next_follow_up_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead scoring factors and history
CREATE TABLE public.lead_scoring_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    previous_score INTEGER,
    new_score INTEGER,
    scoring_factors JSONB, -- What contributed to the score change
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CAMPAIGNS & SEQUENCES
-- =====================================================

-- Marketing campaigns
CREATE TABLE public.campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    campaign_type VARCHAR(50) CHECK (campaign_type IN ('linkedin', 'whatsapp', 'email', 'sms', 'multi-channel')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'archived')),
    target_audience JSONB, -- Criteria for lead selection
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    budget DECIMAL(10,2),
    daily_limit INTEGER DEFAULT 50,
    messages_sent_today INTEGER DEFAULT 0,
    total_leads_targeted INTEGER DEFAULT 0,
    total_leads_contacted INTEGER DEFAULT 0,
    total_responses INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    cost_per_lead DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message sequences/templates
CREATE TABLE public.message_sequences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sequence_order INTEGER NOT NULL,
    message_type VARCHAR(50) CHECK (message_type IN ('whatsapp', 'linkedin', 'email', 'sms')),
    subject VARCHAR(255), -- For email/linkedin
    message_template TEXT NOT NULL,
    delay_days INTEGER DEFAULT 0,
    delay_hours INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    personalization_fields JSONB, -- Available merge fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- MESSAGING & COMMUNICATIONS
-- =====================================================

-- Message history
CREATE TABLE public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    sequence_id UUID REFERENCES public.message_sequences(id) ON DELETE SET NULL,
    phone_number_id UUID REFERENCES public.phone_numbers(id) ON DELETE SET NULL,
    message_type VARCHAR(50) CHECK (message_type IN ('whatsapp', 'linkedin', 'email', 'sms')),
    direction VARCHAR(20) CHECK (direction IN ('outbound', 'inbound')),
    subject VARCHAR(255),
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'replied', 'failed')),
    external_message_id VARCHAR(255), -- ID from WhatsApp/LinkedIn API
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    replied_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    metadata JSONB, -- Additional platform-specific data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS & TRACKING
-- =====================================================

-- Campaign performance metrics
CREATE TABLE public.campaign_analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    messages_sent INTEGER DEFAULT 0,
    messages_delivered INTEGER DEFAULT 0,
    messages_read INTEGER DEFAULT 0,
    replies_received INTEGER DEFAULT 0,
    leads_generated INTEGER DEFAULT 0,
    leads_qualified INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    cost_spent DECIMAL(10,2) DEFAULT 0,
    revenue_generated DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(campaign_id, date)
);

-- User activity tracking
CREATE TABLE public.user_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    description TEXT,
    entity_type VARCHAR(50), -- lead, campaign, message, etc.
    entity_id UUID,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INTEGRATIONS & EXTERNAL SERVICES
-- =====================================================

-- External integrations (CRM, etc.)
CREATE TABLE public.integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    integration_type VARCHAR(50) CHECK (integration_type IN ('hubspot', 'salesforce', 'pipedrive', 'linkedin', 'zapier')),
    name VARCHAR(255) NOT NULL,
    api_credentials JSONB, -- Encrypted credentials
    configuration JSONB, -- Integration-specific settings
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error', 'pending')),
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_frequency VARCHAR(20) DEFAULT 'daily' CHECK (sync_frequency IN ('realtime', 'hourly', 'daily', 'weekly')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SYSTEM TABLES
-- =====================================================

-- API usage tracking
CREATE TABLE public.api_usage (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    requests_count INTEGER DEFAULT 1,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, endpoint, method, date)
);

-- System notifications
CREATE TABLE public.notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) CHECK (type IN ('info', 'success', 'warning', 'error')),
    category VARCHAR(50) CHECK (category IN ('system', 'campaign', 'lead', 'billing', 'integration')),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- User profiles indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_subscription ON public.user_profiles(subscription_plan, subscription_status);

-- Phone numbers indexes
CREATE INDEX idx_phone_numbers_user_id ON public.phone_numbers(user_id);
CREATE INDEX idx_phone_numbers_whatsapp ON public.phone_numbers(is_whatsapp_enabled, is_active);

-- Leads indexes
CREATE INDEX idx_leads_user_id ON public.leads(user_id);
CREATE INDEX idx_leads_company_id ON public.leads(company_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_leads_score ON public.leads(lead_score DESC);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_leads_email ON public.leads(email);

-- Companies indexes
CREATE INDEX idx_companies_user_id ON public.companies(user_id);
CREATE INDEX idx_companies_domain ON public.companies(domain);
CREATE INDEX idx_companies_industry ON public.companies(industry);

-- Campaigns indexes
CREATE INDEX idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX idx_campaigns_status ON public.campaigns(status);
CREATE INDEX idx_campaigns_type ON public.campaigns(campaign_type);

-- Messages indexes
CREATE INDEX idx_messages_user_id ON public.messages(user_id);
CREATE INDEX idx_messages_lead_id ON public.messages(lead_id);
CREATE INDEX idx_messages_campaign_id ON public.messages(campaign_id);
CREATE INDEX idx_messages_type_status ON public.messages(message_type, status);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- Analytics indexes
CREATE INDEX idx_campaign_analytics_campaign_date ON public.campaign_analytics(campaign_id, date DESC);
CREATE INDEX idx_user_activities_user_type ON public.user_activities(user_id, activity_type);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_scoring_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- User profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- User settings policies
CREATE POLICY "Users can manage own settings" ON public.user_settings
    FOR ALL USING (auth.uid() = user_id);

-- Phone numbers policies
CREATE POLICY "Users can manage own phone numbers" ON public.phone_numbers
    FOR ALL USING (auth.uid() = user_id);

-- WhatsApp accounts policies
CREATE POLICY "Users can manage own WhatsApp accounts" ON public.whatsapp_accounts
    FOR ALL USING (auth.uid() = user_id);

-- Companies policies
CREATE POLICY "Users can manage own companies" ON public.companies
    FOR ALL USING (auth.uid() = user_id);

-- Leads policies
CREATE POLICY "Users can manage own leads" ON public.leads
    FOR ALL USING (auth.uid() = user_id);

-- Lead scoring history policies
CREATE POLICY "Users can view own lead scoring history" ON public.lead_scoring_history
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.leads WHERE id = lead_id));

-- Campaigns policies
CREATE POLICY "Users can manage own campaigns" ON public.campaigns
    FOR ALL USING (auth.uid() = user_id);

-- Message sequences policies
CREATE POLICY "Users can manage own message sequences" ON public.message_sequences
    FOR ALL USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Users can manage own messages" ON public.messages
    FOR ALL USING (auth.uid() = user_id);

-- Campaign analytics policies
CREATE POLICY "Users can view own campaign analytics" ON public.campaign_analytics
    FOR SELECT USING (auth.uid() = (SELECT user_id FROM public.campaigns WHERE id = campaign_id));

-- User activities policies
CREATE POLICY "Users can view own activities" ON public.user_activities
    FOR SELECT USING (auth.uid() = user_id);

-- Integrations policies
CREATE POLICY "Users can manage own integrations" ON public.integrations
    FOR ALL USING (auth.uid() = user_id);

-- API usage policies
CREATE POLICY "Users can view own API usage" ON public.api_usage
    FOR SELECT USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can manage own notifications" ON public.notifications
    FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON public.user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_phone_numbers_updated_at BEFORE UPDATE ON public.phone_numbers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whatsapp_accounts_updated_at BEFORE UPDATE ON public.whatsapp_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON public.campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_message_sequences_updated_at BEFORE UPDATE ON public.message_sequences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON public.integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');

    INSERT INTO public.user_settings (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate lead score
CREATE OR REPLACE FUNCTION calculate_lead_score(lead_id UUID)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
    lead_record RECORD;
    company_record RECORD;
BEGIN
    -- Get lead and company data
    SELECT l.*, c.* INTO lead_record, company_record
    FROM public.leads l
    LEFT JOIN public.companies c ON l.company_id = c.id
    WHERE l.id = lead_id;

    -- Base score factors
    IF lead_record.email IS NOT NULL THEN score := score + 10; END IF;
    IF lead_record.phone IS NOT NULL THEN score := score + 10; END IF;
    IF lead_record.linkedin_url IS NOT NULL THEN score := score + 15; END IF;

    -- Job title scoring
    CASE lead_record.seniority_level
        WHEN 'c-level' THEN score := score + 30;
        WHEN 'vp' THEN score := score + 25;
        WHEN 'director' THEN score := score + 20;
        WHEN 'senior' THEN score := score + 15;
        WHEN 'mid' THEN score := score + 10;
        ELSE score := score + 5;
    END CASE;

    -- Company size scoring
    IF company_record.id IS NOT NULL THEN
        CASE company_record.size_category
            WHEN 'enterprise' THEN score := score + 25;
            WHEN 'large' THEN score := score + 20;
            WHEN 'medium' THEN score := score + 15;
            WHEN 'small' THEN score := score + 10;
            ELSE score := score + 5;
        END CASE;
    END IF;

    -- Ensure score is within bounds
    score := GREATEST(0, LEAST(100, score));

    RETURN score;
END;
$$ LANGUAGE plpgsql;

-- Function to update lead score automatically
CREATE OR REPLACE FUNCTION update_lead_score()
RETURNS TRIGGER AS $$
DECLARE
    new_score INTEGER;
BEGIN
    new_score := calculate_lead_score(NEW.id);

    -- Update the lead score if it changed
    IF NEW.lead_score != new_score THEN
        NEW.lead_score := new_score;

        -- Log the score change
        INSERT INTO public.lead_scoring_history (lead_id, previous_score, new_score, scoring_factors)
        VALUES (NEW.id, OLD.lead_score, new_score, jsonb_build_object('auto_calculated', true));
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update lead scores
CREATE TRIGGER update_lead_score_trigger
    BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION update_lead_score();

-- =====================================================
-- INITIAL DATA & SETUP
-- =====================================================

-- Insert default message templates
INSERT INTO public.message_sequences (id, user_id, campaign_id, name, sequence_order, message_type, subject, message_template, delay_days)
VALUES
    (uuid_generate_v4(), NULL, NULL, 'LinkedIn Connection Request', 1, 'linkedin', 'Let''s connect!', 'Hi {{first_name}}, I''d love to connect and learn more about {{company_name}}. Best regards!', 0),
    (uuid_generate_v4(), NULL, NULL, 'WhatsApp Introduction', 1, 'whatsapp', NULL, 'Hi {{first_name}}! 👋 I''m reaching out because I think {{company_name}} could benefit from our lead generation platform. Would you be interested in a quick chat?', 0),
    (uuid_generate_v4(), NULL, NULL, 'Follow-up Message', 2, 'whatsapp', NULL, 'Hi {{first_name}}, just following up on my previous message. I''d love to show you how we''ve helped companies like {{company_name}} increase their lead generation by 300%. Are you available for a 15-minute call this week?', 3);

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

-- Campaign performance view
CREATE VIEW campaign_performance AS
SELECT
    c.id,
    c.name,
    c.campaign_type,
    c.status,
    c.total_leads_targeted,
    c.total_leads_contacted,
    c.total_responses,
    c.conversion_rate,
    c.cost_per_lead,
    COUNT(m.id) as total_messages,
    COUNT(CASE WHEN m.status = 'delivered' THEN 1 END) as delivered_messages,
    COUNT(CASE WHEN m.status = 'read' THEN 1 END) as read_messages,
    COUNT(CASE WHEN m.direction = 'inbound' THEN 1 END) as replies_received
FROM public.campaigns c
LEFT JOIN public.messages m ON c.id = m.campaign_id
GROUP BY c.id, c.name, c.campaign_type, c.status, c.total_leads_targeted,
         c.total_leads_contacted, c.total_responses, c.conversion_rate, c.cost_per_lead;

-- Lead pipeline view
CREATE VIEW lead_pipeline AS
SELECT
    user_id,
    COUNT(*) as total_leads,
    COUNT(CASE WHEN status = 'new' THEN 1 END) as new_leads,
    COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted_leads,
    COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified_leads,
    COUNT(CASE WHEN status = 'opportunity' THEN 1 END) as opportunities,
    COUNT(CASE WHEN status = 'customer' THEN 1 END) as customers,
    AVG(lead_score) as avg_lead_score
FROM public.leads
GROUP BY user_id;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- Add a comment to indicate schema completion
COMMENT ON SCHEMA public IS 'Rarity Leads - Complete database schema for AI-powered lead generation platform with multi-WhatsApp account management';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Rarity Leads database schema created successfully! 🚀';
    RAISE NOTICE 'Tables created: 15 core tables + views and functions';
    RAISE NOTICE 'Features: Multi-WhatsApp accounts, Lead scoring, Campaign management, Analytics, RLS security';
END $$;
