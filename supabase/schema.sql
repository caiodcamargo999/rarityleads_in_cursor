-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'converted', 'lost');
CREATE TYPE message_direction AS ENUM ('inbound', 'outbound');
CREATE TYPE message_status AS ENUM ('pending', 'sent', 'delivered', 'read', 'failed');
CREATE TYPE campaign_status AS ENUM ('draft', 'active', 'paused', 'completed');

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    company_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    company_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    linkedin_url TEXT,
    industry TEXT,
    company_size TEXT,
    location TEXT,
    status lead_status DEFAULT 'new',
    ai_score INTEGER CHECK (ai_score >= 0 AND ai_score <= 100),
    notes TEXT,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    website TEXT,
    industry TEXT,
    company_size TEXT,
    location TEXT,
    description TEXT,
    linkedin_url TEXT,
    founded_year INTEGER,
    funding_stage TEXT,
    technologies TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    channel TEXT NOT NULL,
    status campaign_status DEFAULT 'draft',
    target_audience JSONB,
    message_template TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    channel TEXT NOT NULL,
    direction message_direction NOT NULL,
    content JSONB NOT NULL,
    status message_status DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp sessions table
CREATE TABLE IF NOT EXISTS public.whatsapp_sessions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    phone_number TEXT,
    session_data JSONB,
    status TEXT DEFAULT 'inactive',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    metric_name TEXT NOT NULL,
    metric_value NUMERIC NOT NULL,
    channel TEXT,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_company_name ON public.leads(company_name);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_messages_user_id ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_lead_id ON public.messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_messages_campaign_id ON public.messages(campaign_id);
CREATE INDEX IF NOT EXISTS idx_analytics_user_id_date ON public.analytics(user_id, date);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for leads
CREATE POLICY "Users can view own leads" ON public.leads
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads" ON public.leads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads" ON public.leads
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads" ON public.leads
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for companies
CREATE POLICY "Users can view own companies" ON public.companies
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own companies" ON public.companies
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own companies" ON public.companies
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own companies" ON public.companies
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for campaigns
CREATE POLICY "Users can view own campaigns" ON public.campaigns
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own campaigns" ON public.campaigns
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own campaigns" ON public.campaigns
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own campaigns" ON public.campaigns
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for messages
CREATE POLICY "Users can view own messages" ON public.messages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON public.messages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages" ON public.messages
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for whatsapp_sessions
CREATE POLICY "Users can view own whatsapp sessions" ON public.whatsapp_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own whatsapp sessions" ON public.whatsapp_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own whatsapp sessions" ON public.whatsapp_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own whatsapp sessions" ON public.whatsapp_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for analytics
CREATE POLICY "Users can view own analytics" ON public.analytics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON public.analytics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Functions for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON public.companies
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
    BEFORE UPDATE ON public.campaigns
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_whatsapp_sessions_updated_at
    BEFORE UPDATE ON public.whatsapp_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- AI Scoring Function (Edge Function placeholder)
CREATE OR REPLACE FUNCTION public.calculate_ai_score(
    company_size TEXT,
    industry TEXT,
    location TEXT,
    linkedin_url TEXT
)
RETURNS INTEGER AS $$
DECLARE
    score INTEGER := 50; -- Base score
BEGIN
    -- Company size scoring
    IF company_size = '1-10' THEN
        score := score + 10;
    ELSIF company_size = '11-50' THEN
        score := score + 15;
    ELSIF company_size = '51-200' THEN
        score := score + 20;
    ELSIF company_size = '201-1000' THEN
        score := score + 25;
    ELSIF company_size = '1000+' THEN
        score := score + 30;
    END IF;

    -- Industry scoring (example)
    IF industry IN ('Technology', 'Software', 'SaaS') THEN
        score := score + 15;
    ELSIF industry IN ('Finance', 'Healthcare', 'Education') THEN
        score := score + 10;
    END IF;

    -- Location scoring (example)
    IF location ILIKE '%United States%' OR location ILIKE '%Canada%' THEN
        score := score + 10;
    ELSIF location ILIKE '%Europe%' THEN
        score := score + 8;
    END IF;

    -- LinkedIn presence
    IF linkedin_url IS NOT NULL THEN
        score := score + 5;
    END IF;

    -- Ensure score is between 0 and 100
    RETURN GREATEST(0, LEAST(100, score));
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated; 