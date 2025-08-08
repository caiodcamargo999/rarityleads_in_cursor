-- Additional tables for multichannel communication and advanced CRM features

-- Custom Pipeline Definitions (user can create multiple pipelines with custom stages)
CREATE TABLE IF NOT EXISTS pipeline_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  stages JSONB NOT NULL DEFAULT '["To Contact", "Contacted", "In Conversation", "Closed"]',
  color TEXT DEFAULT '#8b5cf6',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update crm_pipelines to reference pipeline definitions
ALTER TABLE crm_pipelines ADD COLUMN IF NOT EXISTS pipeline_definition_id UUID REFERENCES pipeline_definitions(id) ON DELETE SET NULL;

-- Enhanced lead requests with advanced filters
ALTER TABLE lead_requests ADD COLUMN IF NOT EXISTS advanced_filters JSONB DEFAULT '{}';
ALTER TABLE lead_requests ADD COLUMN IF NOT EXISTS ai_model TEXT DEFAULT 'gpt-4-turbo';
ALTER TABLE lead_requests ADD COLUMN IF NOT EXISTS results_count INTEGER DEFAULT 0;

-- Calls table for phone interactions
CREATE TABLE IF NOT EXISTS calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  phone_number TEXT NOT NULL,
  direction TEXT CHECK (direction IN ('inbound', 'outbound')),
  duration INTEGER, -- in seconds
  recording_url TEXT,
  transcription TEXT,
  status TEXT DEFAULT 'completed' CHECK (status IN ('initiated', 'ringing', 'answered', 'completed', 'failed', 'voicemail')),
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message Templates for smart messaging
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  channel TEXT CHECK (channel IN ('whatsapp', 'instagram', 'facebook', 'x', 'linkedin', 'email', 'sms', 'all')),
  content TEXT NOT NULL,
  variables TEXT[] DEFAULT '{}', -- e.g., ['lead.name', 'company', 'product']
  category TEXT,
  language TEXT DEFAULT 'en',
  is_active BOOLEAN DEFAULT TRUE,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lead Scoring Rules for AI prioritization
CREATE TABLE IF NOT EXISTS lead_scoring_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  conditions JSONB NOT NULL, -- e.g., {"industry": "SaaS", "company_size": ">100"}
  score_modifier INTEGER NOT NULL, -- positive or negative score adjustment
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Channel Sessions (unified for all channels)
CREATE TABLE IF NOT EXISTS channel_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'instagram', 'facebook', 'x', 'linkedin', 'telegram')),
  account_identifier TEXT NOT NULL, -- phone number, username, etc.
  account_name TEXT,
  session_data JSONB,
  auth_token TEXT, -- encrypted
  refresh_token TEXT, -- encrypted
  status TEXT DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'expired', 'connecting', 'error')),
  error_message TEXT,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, channel, account_identifier)
);

-- Lead Activities for tracking all interactions
CREATE TABLE IF NOT EXISTS lead_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('call', 'message', 'email', 'meeting', 'note', 'status_change', 'pipeline_move')),
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Integration Configs
CREATE TABLE IF NOT EXISTS api_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('apollo', 'clearbit', 'linkedin_sales_navigator', 'crunchbase', 'zoominfo', 'econodata')),
  api_key TEXT, -- encrypted
  api_secret TEXT, -- encrypted
  additional_config JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, provider)
);

-- Lead Enrichment Cache
CREATE TABLE IF NOT EXISTS lead_enrichment_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  domain TEXT,
  provider TEXT NOT NULL,
  data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(email, provider)
);

-- Indexes for new tables
CREATE INDEX IF NOT EXISTS idx_pipeline_definitions_user_id ON pipeline_definitions(user_id);
CREATE INDEX IF NOT EXISTS idx_calls_user_id ON calls(user_id);
CREATE INDEX IF NOT EXISTS idx_calls_lead_id ON calls(lead_id);
CREATE INDEX IF NOT EXISTS idx_calls_conversation_id ON calls(conversation_id);
CREATE INDEX IF NOT EXISTS idx_message_templates_user_id ON message_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_message_templates_channel ON message_templates(channel);
CREATE INDEX IF NOT EXISTS idx_lead_scoring_rules_user_id ON lead_scoring_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_channel_sessions_user_id ON channel_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_channel_sessions_channel ON channel_sessions(channel);
CREATE INDEX IF NOT EXISTS idx_lead_activities_user_id ON lead_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_lead_id ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_api_configs_user_id ON api_configs(user_id);
CREATE INDEX IF NOT EXISTS idx_lead_enrichment_cache_email ON lead_enrichment_cache(email);
CREATE INDEX IF NOT EXISTS idx_lead_enrichment_cache_domain ON lead_enrichment_cache(domain);

-- RLS Policies
ALTER TABLE pipeline_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scoring_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_configs ENABLE ROW LEVEL SECURITY;

-- User can only see their own data
CREATE POLICY "Users can view own pipeline_definitions" ON pipeline_definitions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own pipeline_definitions" ON pipeline_definitions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pipeline_definitions" ON pipeline_definitions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own pipeline_definitions" ON pipeline_definitions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own calls" ON calls FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own calls" ON calls FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own calls" ON calls FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own calls" ON calls FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own message_templates" ON message_templates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own message_templates" ON message_templates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own message_templates" ON message_templates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own message_templates" ON message_templates FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own lead_scoring_rules" ON lead_scoring_rules FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lead_scoring_rules" ON lead_scoring_rules FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own lead_scoring_rules" ON lead_scoring_rules FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own lead_scoring_rules" ON lead_scoring_rules FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own channel_sessions" ON channel_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own channel_sessions" ON channel_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own channel_sessions" ON channel_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own channel_sessions" ON channel_sessions FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own lead_activities" ON lead_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own lead_activities" ON lead_activities FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own api_configs" ON api_configs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own api_configs" ON api_configs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own api_configs" ON api_configs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own api_configs" ON api_configs FOR DELETE USING (auth.uid() = user_id);

-- Public cache table for enrichment (no user_id)
CREATE POLICY "Anyone can view lead_enrichment_cache" ON lead_enrichment_cache FOR SELECT USING (true);
CREATE POLICY "System can insert lead_enrichment_cache" ON lead_enrichment_cache FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update lead_enrichment_cache" ON lead_enrichment_cache FOR UPDATE USING (true);

-- Update triggers for new tables
CREATE TRIGGER update_pipeline_definitions_updated_at BEFORE UPDATE ON pipeline_definitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_message_templates_updated_at BEFORE UPDATE ON message_templates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lead_scoring_rules_updated_at BEFORE UPDATE ON lead_scoring_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_channel_sessions_updated_at BEFORE UPDATE ON channel_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_configs_updated_at BEFORE UPDATE ON api_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
