-- Rarity Leads Database Schema
-- Complete database schema for the Rarity Leads application with authentication

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'agency_owner', 'performance_manager', 'sdr_setter', 'client');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed');
CREATE TYPE subscription_status AS ENUM ('trial', 'active', 'past_due', 'canceled', 'unpaid');

-- Profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role user_role DEFAULT 'client',
    company_name TEXT,
    phone TEXT,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    subscription_status subscription_status DEFAULT 'trial',
    subscription_plan TEXT DEFAULT 'starter',
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    email_verified BOOLEAN DEFAULT false,
    onboarding_completed BOOLEAN DEFAULT false,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage all profiles" ON profiles
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Leads table
CREATE TABLE leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    company TEXT,
    phone TEXT,
    status lead_status DEFAULT 'new',
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    source TEXT,
    campaign_id UUID,
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    next_follow_up_at TIMESTAMP WITH TIME ZONE,
    conversion_value DECIMAL(10,2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Leads policies
CREATE POLICY "Users can manage own leads" ON leads
    FOR ALL USING (auth.uid() = user_id);

-- Campaigns table
CREATE TABLE campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    status campaign_status DEFAULT 'draft',
    platform TEXT, -- 'linkedin', 'facebook', 'google', 'email', 'whatsapp'
    budget DECIMAL(10,2),
    spent DECIMAL(10,2) DEFAULT 0,
    start_date DATE,
    end_date DATE,
    target_audience JSONB DEFAULT '{}',
    settings JSONB DEFAULT '{}',
    metrics JSONB DEFAULT '{}',
    leads_generated INTEGER DEFAULT 0,
    leads_qualified INTEGER DEFAULT 0,
    leads_converted INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    cost_per_lead DECIMAL(10,2) DEFAULT 0,
    roi DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Campaigns policies
CREATE POLICY "Users can manage own campaigns" ON campaigns
    FOR ALL USING (auth.uid() = user_id);

-- Analytics table (daily aggregated data)
CREATE TABLE analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    leads_generated INTEGER DEFAULT 0,
    leads_qualified INTEGER DEFAULT 0,
    leads_converted INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    cost DECIMAL(10,2) DEFAULT 0,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    platform TEXT,
    source TEXT,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    cost_per_lead DECIMAL(10,2) DEFAULT 0,
    roi DECIMAL(10,2) DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, date, campaign_id, platform, source)
);

-- Enable RLS
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Analytics policies
CREATE POLICY "Users can view own analytics" ON analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics" ON analytics
    FOR UPDATE USING (auth.uid() = user_id);

-- Sequences table (for automation workflows)
CREATE TABLE sequences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    platform TEXT, -- 'email', 'whatsapp', 'linkedin', 'sms'
    trigger_event TEXT, -- 'lead_created', 'lead_qualified', 'manual', etc.
    steps JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT false,
    total_enrolled INTEGER DEFAULT 0,
    total_completed INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sequences ENABLE ROW LEVEL SECURITY;

-- Sequences policies
CREATE POLICY "Users can manage own sequences" ON sequences
    FOR ALL USING (auth.uid() = user_id);

-- Lead activities table (activity log)
CREATE TABLE lead_activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    activity_type TEXT NOT NULL, -- 'email_sent', 'call_made', 'meeting_scheduled', 'note_added', etc.
    title TEXT NOT NULL,
    description TEXT,
    outcome TEXT, -- 'success', 'failed', 'no_response', etc.
    platform TEXT, -- 'email', 'phone', 'linkedin', 'whatsapp', etc.
    sequence_id UUID REFERENCES sequences(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;

-- Lead activities policies
CREATE POLICY "Users can manage activities for own leads" ON lead_activities
    FOR ALL USING (auth.uid() = user_id);

-- Integrations table (store API keys and connection info)
CREATE TABLE integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL, -- 'google', 'facebook', 'linkedin', 'claude', 'openai', etc.
    name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    credentials JSONB DEFAULT '{}', -- encrypted API keys, tokens, etc.
    settings JSONB DEFAULT '{}',
    last_sync_at TIMESTAMP WITH TIME ZONE,
    sync_status TEXT DEFAULT 'pending', -- 'pending', 'syncing', 'success', 'error'
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, platform)
);

-- Enable RLS
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

-- Integrations policies
CREATE POLICY "Users can manage own integrations" ON integrations
    FOR ALL USING (auth.uid() = user_id);

-- Notifications table
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Notifications policies
CREATE POLICY "Users can manage own notifications" ON notifications
    FOR ALL USING (auth.uid() = user_id);

-- Functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sequences_updated_at BEFORE UPDATE ON sequences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_integrations_updated_at BEFORE UPDATE ON integrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        email,
        full_name,
        email_verified,
        trial_ends_at
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NEW.email_confirmed_at IS NOT NULL,
        NOW() + INTERVAL '14 days'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update email verification status
CREATE OR REPLACE FUNCTION public.handle_email_verification()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL THEN
        UPDATE public.profiles
        SET email_verified = true
        WHERE id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for email verification
CREATE TRIGGER on_auth_user_email_verified
    AFTER UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_email_verification();

-- Indexes for better performance
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_campaign_id ON leads(campaign_id);
CREATE INDEX idx_leads_email ON leads(email);

CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_platform ON campaigns(platform);

CREATE INDEX idx_analytics_user_id ON analytics(user_id);
CREATE INDEX idx_analytics_date ON analytics(date);
CREATE INDEX idx_analytics_campaign_id ON analytics(campaign_id);

CREATE INDEX idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX idx_lead_activities_user_id ON lead_activities(user_id);
CREATE INDEX idx_lead_activities_created_at ON lead_activities(created_at);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Insert sample data for demo purposes
INSERT INTO profiles (id, email, full_name, role, company_name, email_verified) VALUES
    ('00000000-0000-0000-0000-000000000001', 'demo@rarityagency.com', 'Demo User', 'agency_owner', 'Rarity Agency', true)
ON CONFLICT (id) DO NOTHING;
