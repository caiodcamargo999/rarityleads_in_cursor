-- Rarity Leads Database Schema
-- Complete relational structure with JSONB flexibility for infinite scale

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    company_name TEXT,
    role TEXT,
    phone TEXT,
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    settings JSONB DEFAULT '{}',
    subscription_tier TEXT DEFAULT 'starter',
    subscription_status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads Engine
CREATE TABLE leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    campaign_id UUID,
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    linkedin_url TEXT,
    website TEXT,
    industry TEXT,
    company_size TEXT,
    location TEXT,
    job_title TEXT,
    department TEXT,
    seniority_level TEXT,
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'qualified', 'contacted', 'engaged', 'booked', 'closed', 'lost')),
    ai_score INTEGER DEFAULT 0 CHECK (ai_score >= 0 AND ai_score <= 100),
    tags TEXT[],
    notes TEXT,
    enrichment_data JSONB DEFAULT '{}',
    last_contacted_at TIMESTAMP WITH TIME ZONE,
    next_follow_up_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns
CREATE TABLE campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'instagram', 'facebook', 'x', 'linkedin', 'email')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
    target_audience JSONB DEFAULT '{}',
    message_template TEXT,
    follow_up_sequence JSONB DEFAULT '[]',
    settings JSONB DEFAULT '{}',
    stats JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp Sessions (Multi-Account Support)
CREATE TABLE whatsapp_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    account_name TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    session_data JSONB,
    qr_code TEXT,
    status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'expired', 'connecting')),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, phone_number)
);

-- Social Media Sessions
CREATE TABLE social_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'x', 'linkedin')),
    account_name TEXT NOT NULL,
    session_data JSONB,
    status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'expired')),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, platform, account_name)
);

-- Conversations (Unified Inbox)
CREATE TABLE conversations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'instagram', 'facebook', 'x', 'linkedin', 'email')),
    session_id UUID,
    contact_identifier TEXT NOT NULL, -- phone number, username, etc.
    contact_name TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'blocked')),
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unread_count INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
    content TEXT NOT NULL,
    content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'video', 'audio', 'document', 'location')),
    media_url TEXT,
    status TEXT DEFAULT 'sent' CHECK (status IN ('sending', 'sent', 'delivered', 'read', 'failed')),
    external_id TEXT, -- ID from WhatsApp, Instagram, etc.
    metadata JSONB DEFAULT '{}',
    ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Appointments/Meetings
CREATE TABLE appointments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
    meeting_url TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics Events
CREATE TABLE analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    event_type TEXT NOT NULL,
    event_data JSONB NOT NULL,
    session_id TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys for External Integrations
CREATE TABLE api_keys (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    key_hash TEXT NOT NULL,
    permissions JSONB DEFAULT '[]',
    last_used_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Webhooks
CREATE TABLE webhooks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    events TEXT[] NOT NULL,
    secret TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_triggered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_leads_user_id ON leads(user_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_ai_score ON leads(ai_score);
CREATE INDEX idx_leads_company_name ON leads(company_name);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_next_follow_up ON leads(next_follow_up_at);

CREATE INDEX idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_channel ON campaigns(channel);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_lead_id ON conversations(lead_id);
CREATE INDEX idx_conversations_channel ON conversations(channel);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_external_id ON messages(external_id);

CREATE INDEX idx_whatsapp_sessions_user_id ON whatsapp_sessions(user_id);
CREATE INDEX idx_whatsapp_sessions_status ON whatsapp_sessions(status);

CREATE INDEX idx_social_sessions_user_id ON social_sessions(user_id);
CREATE INDEX idx_social_sessions_platform ON social_sessions(platform);

CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_lead_id ON appointments(lead_id);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);

-- JSONB Indexes for Enrichment Data
CREATE INDEX idx_leads_enrichment_gin ON leads USING GIN (enrichment_data);
CREATE INDEX idx_campaigns_settings_gin ON campaigns USING GIN (settings);
CREATE INDEX idx_messages_metadata_gin ON messages USING GIN (metadata);

-- Triggers for Updated At
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_whatsapp_sessions_updated_at BEFORE UPDATE ON whatsapp_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_social_sessions_updated_at BEFORE UPDATE ON social_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_webhooks_updated_at BEFORE UPDATE ON webhooks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Leads Policies
CREATE POLICY "Users can view own leads" ON leads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own leads" ON leads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own leads" ON leads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own leads" ON leads FOR DELETE USING (auth.uid() = user_id);

-- Campaigns Policies
CREATE POLICY "Users can view own campaigns" ON campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own campaigns" ON campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own campaigns" ON campaigns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own campaigns" ON campaigns FOR DELETE USING (auth.uid() = user_id);

-- WhatsApp Sessions Policies
CREATE POLICY "Users can view own whatsapp sessions" ON whatsapp_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own whatsapp sessions" ON whatsapp_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own whatsapp sessions" ON whatsapp_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own whatsapp sessions" ON whatsapp_sessions FOR DELETE USING (auth.uid() = user_id);

-- Social Sessions Policies
CREATE POLICY "Users can view own social sessions" ON social_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own social sessions" ON social_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own social sessions" ON social_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own social sessions" ON social_sessions FOR DELETE USING (auth.uid() = user_id);

-- Conversations Policies
CREATE POLICY "Users can view own conversations" ON conversations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON conversations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON conversations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON conversations FOR DELETE USING (auth.uid() = user_id);

-- Messages Policies
CREATE POLICY "Users can view own messages" ON messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own messages" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own messages" ON messages FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own messages" ON messages FOR DELETE USING (auth.uid() = user_id);

-- Appointments Policies
CREATE POLICY "Users can view own appointments" ON appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own appointments" ON appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own appointments" ON appointments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own appointments" ON appointments FOR DELETE USING (auth.uid() = user_id);

-- Analytics Events Policies
CREATE POLICY "Users can view own analytics events" ON analytics_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analytics events" ON analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- API Keys Policies
CREATE POLICY "Users can view own api keys" ON api_keys FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own api keys" ON api_keys FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own api keys" ON api_keys FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own api keys" ON api_keys FOR DELETE USING (auth.uid() = user_id);

-- Webhooks Policies
CREATE POLICY "Users can view own webhooks" ON webhooks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own webhooks" ON webhooks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own webhooks" ON webhooks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own webhooks" ON webhooks FOR DELETE USING (auth.uid() = user_id);

-- Functions for AI Scoring and Lead Enrichment
CREATE OR REPLACE FUNCTION calculate_ai_score(
    company_size TEXT,
    seniority_level TEXT,
    industry TEXT,
    location TEXT,
    linkedin_url TEXT,
    website TEXT
) RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 0;
BEGIN
    -- Company size scoring
    CASE company_size
        WHEN '1-10' THEN score := score + 10;
        WHEN '11-50' THEN score := score + 20;
        WHEN '51-200' THEN score := score + 30;
        WHEN '201-1000' THEN score := score + 25;
        WHEN '1001-10000' THEN score := score + 20;
        WHEN '10000+' THEN score := score + 15;
        ELSE score := score + 5;
    END CASE;
    
    -- Seniority level scoring
    CASE seniority_level
        WHEN 'C-Level' THEN score := score + 30;
        WHEN 'VP' THEN score := score + 25;
        WHEN 'Director' THEN score := score + 20;
        WHEN 'Manager' THEN score := score + 15;
        WHEN 'Senior' THEN score := score + 10;
        WHEN 'Junior' THEN score := score + 5;
        ELSE score := score + 5;
    END CASE;
    
    -- Industry scoring (example)
    IF industry IN ('Technology', 'SaaS', 'Fintech', 'Healthcare') THEN
        score := score + 15;
    END IF;
    
    -- Location scoring (example)
    IF location IN ('United States', 'Canada', 'United Kingdom', 'Germany') THEN
        score := score + 10;
    END IF;
    
    -- Contact quality scoring
    IF linkedin_url IS NOT NULL THEN score := score + 10; END IF;
    IF website IS NOT NULL THEN score := score + 5; END IF;
    
    -- Ensure score is between 0-100
    RETURN GREATEST(0, LEAST(100, score));
END;
$$ LANGUAGE plpgsql;

-- Function to update lead AI score
CREATE OR REPLACE FUNCTION update_lead_ai_score()
RETURNS TRIGGER AS $$
BEGIN
    NEW.ai_score = calculate_ai_score(
        NEW.company_size,
        NEW.seniority_level,
        NEW.industry,
        NEW.location,
        NEW.linkedin_url,
        NEW.website
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_lead_ai_score
    BEFORE INSERT OR UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_lead_ai_score();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 