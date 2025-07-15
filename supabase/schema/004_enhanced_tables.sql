-- 004_enhanced_tables.sql: Enhanced tables for Rarity Leads full feature set

-- Social media sessions (Instagram, Facebook, X, LinkedIn)
create table if not exists public.social_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  platform text not null check (platform in ('instagram', 'facebook', 'x', 'linkedin')),
  account_identifier text not null,
  session_data jsonb,
  status text default 'inactive',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, platform, account_identifier)
);

-- Lead enrichment data
create table if not exists public.lead_enrichments (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references public.leads not null,
  source text not null, -- 'clearbit', 'crunchbase', 'apollo', etc.
  enrichment_data jsonb not null,
  ai_score integer check (ai_score >= 0 and ai_score <= 100),
  decision_makers jsonb,
  created_at timestamp with time zone default now(),
  unique(lead_id, source)
);

-- AI scoring history
create table if not exists public.ai_scoring_history (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references public.leads not null,
  score integer not null check (score >= 0 and score <= 100),
  scoring_factors jsonb not null,
  model_version text,
  created_at timestamp with time zone default now()
);

-- Message templates
create table if not exists public.message_templates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  channel text not null,
  content text not null,
  variables jsonb,
  ai_generated boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Campaign sequences
create table if not exists public.campaign_sequences (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid references public.campaigns not null,
  sequence_order integer not null,
  delay_minutes integer default 0,
  template_id uuid references public.message_templates,
  fallback_channel text,
  created_at timestamp with time zone default now()
);

-- API keys for external access
create table if not exists public.api_keys (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  key_hash text not null unique,
  permissions jsonb default '{"read": true, "write": false}',
  last_used_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- Webhook subscriptions
create table if not exists public.webhook_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  url text not null,
  events text[] not null,
  secret_hash text not null,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- Real-time message queue
create table if not exists public.message_queue (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  channel text not null,
  recipient_id text not null,
  message_content jsonb not null,
  priority integer default 5,
  scheduled_at timestamp with time zone default now(),
  processed_at timestamp with time zone,
  status text default 'pending',
  retry_count integer default 0,
  error_log jsonb,
  created_at timestamp with time zone default now()
);

-- Analytics events
create table if not exists public.analytics_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  event_type text not null,
  event_data jsonb not null,
  channel text,
  lead_id uuid references public.leads,
  campaign_id uuid references public.campaigns,
  created_at timestamp with time zone default now()
);

-- Pipeline stages
create table if not exists public.pipeline_stages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  order_position integer not null,
  color text,
  created_at timestamp with time zone default now(),
  unique(user_id, order_position)
);

-- Lead stage history
create table if not exists public.lead_stage_history (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references public.leads not null,
  stage_id uuid references public.pipeline_stages not null,
  entered_at timestamp with time zone default now(),
  exited_at timestamp with time zone,
  notes text
);

-- Indexes for performance
create index if not exists idx_social_sessions_user_platform on public.social_sessions(user_id, platform);
create index if not exists idx_lead_enrichments_lead_id on public.lead_enrichments(lead_id);
create index if not exists idx_ai_scoring_history_lead_id on public.ai_scoring_history(lead_id);
create index if not exists idx_message_templates_user_id on public.message_templates(user_id);
create index if not exists idx_api_keys_user_id on public.api_keys(user_id);
create index if not exists idx_message_queue_status on public.message_queue(status, scheduled_at);
create index if not exists idx_analytics_events_user_type on public.analytics_events(user_id, event_type);
create index if not exists idx_analytics_events_created on public.analytics_events(created_at);