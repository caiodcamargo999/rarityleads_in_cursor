-- 001_create_tables.sql: Create all main tables for Rarity Leads

create extension if not exists "uuid-ossp";

-- User profiles (additional info for auth.users)
create table if not exists public.user_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null unique,
  full_name text,
  role text default 'user',
  preferences jsonb default '{}',
  api_key text unique,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Phone numbers
create table if not exists public.phone_numbers (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  phone_number text not null,
  is_verified boolean default false,
  created_at timestamp with time zone default now()
);

-- WhatsApp sessions (multi-account)
create table if not exists public.whatsapp_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  phone_number text,
  session_data jsonb,
  status text default 'inactive', -- 'active', 'inactive', 'expired', 'connecting'
  qr_code text,
  last_activity timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Social media sessions (Instagram, Facebook, X, LinkedIn)
create table if not exists public.social_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  platform text not null, -- 'instagram', 'facebook', 'x', 'linkedin'
  account_id text,
  session_data jsonb,
  status text default 'inactive', -- 'active', 'inactive', 'expired', 'connecting'
  access_token text,
  refresh_token text,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Companies
create table if not exists public.companies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  domain text,
  industry text,
  size text,
  location text,
  data jsonb default '{}', -- enriched data from Clearbit, Crunchbase, etc.
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Leads (enhanced with AI scoring)
create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  company_id uuid references public.companies,
  whatsapp_session_id uuid references public.whatsapp_sessions,
  first_name text,
  last_name text,
  email text,
  phone text,
  linkedin_url text,
  title text,
  department text,
  seniority text,
  data jsonb default '{}', -- enriched data from various sources
  ai_score integer default 0, -- 1-100 AI qualification score
  status text default 'new', -- 'new', 'contacted', 'qualified', 'booked', 'closed', 'lost'
  tags text[],
  source text, -- 'manual', 'import', 'api', 'enrichment'
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Campaigns
create table if not exists public.campaigns (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  whatsapp_session_id uuid references public.whatsapp_sessions,
  social_session_ids uuid[], -- array of social session IDs
  data jsonb default '{}', -- campaign configuration, templates, etc.
  status text default 'draft', -- 'draft', 'active', 'paused', 'completed'
  target_audience jsonb, -- targeting criteria
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Campaign leads (many-to-many relationship)
create table if not exists public.campaign_leads (
  id uuid primary key default uuid_generate_v4(),
  campaign_id uuid references public.campaigns not null,
  lead_id uuid references public.leads not null,
  status text default 'pending', -- 'pending', 'sent', 'replied', 'booked', 'failed'
  sent_at timestamp with time zone,
  replied_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  unique(campaign_id, lead_id)
);

-- Messages (unified for all channels)
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  lead_id uuid references public.leads,
  campaign_id uuid references public.campaigns,
  channel text not null, -- 'whatsapp', 'instagram', 'facebook', 'x', 'linkedin', 'email'
  channel_session_id uuid, -- references whatsapp_sessions or social_sessions
  direction text not null, -- 'sent' or 'received'
  content jsonb not null, -- message content, media, etc.
  status text default 'sent', -- 'sent', 'delivered', 'read', 'failed'
  external_id text, -- message ID from external platform
  timestamp timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Conversations (unified inbox)
create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  lead_id uuid references public.leads not null,
  campaign_id uuid references public.campaigns,
  channel text not null, -- 'whatsapp', 'instagram', 'facebook', 'x', 'linkedin', 'email'
  status text default 'active', -- 'active', 'closed', 'archived'
  last_message_at timestamp with time zone default now(),
  message_count integer default 0,
  data jsonb default '{}', -- conversation metadata
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Appointments/meetings
create table if not exists public.appointments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  lead_id uuid references public.leads,
  campaign_id uuid references public.campaigns,
  title text,
  description text,
  scheduled_at timestamp with time zone,
  duration integer, -- in minutes
  status text default 'scheduled', -- 'scheduled', 'confirmed', 'completed', 'cancelled'
  meeting_url text,
  data jsonb default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Automation sequences
create table if not exists public.automation_sequences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  campaign_id uuid references public.campaigns,
  name text not null,
  description text,
  steps jsonb not null, -- array of sequence steps
  status text default 'draft', -- 'draft', 'active', 'paused', 'completed'
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Sequence steps
create table if not exists public.sequence_steps (
  id uuid primary key default uuid_generate_v4(),
  sequence_id uuid references public.automation_sequences not null,
  step_order integer not null,
  channel text not null, -- 'whatsapp', 'instagram', 'facebook', 'x', 'linkedin', 'email'
  delay_hours integer default 0,
  template text,
  conditions jsonb, -- conditions for sending this step
  created_at timestamp with time zone default now()
);

-- Analytics (comprehensive tracking)
create table if not exists public.analytics (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  date date not null,
  metric_type text not null, -- 'leads', 'messages', 'conversations', 'appointments', 'revenue'
  metric_value numeric not null,
  channel text, -- 'whatsapp', 'instagram', 'facebook', 'x', 'linkedin', 'email', 'all'
  campaign_id uuid references public.campaigns,
  data jsonb default '{}', -- additional metric data
  created_at timestamp with time zone default now()
);

-- Lead interactions (for AI scoring)
create table if not exists public.lead_interactions (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references public.leads not null,
  interaction_type text not null, -- 'message_sent', 'message_received', 'appointment_booked', 'email_opened', 'link_clicked'
  channel text,
  data jsonb default '{}',
  created_at timestamp with time zone default now()
);

-- API webhooks
create table if not exists public.webhooks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  url text not null,
  events text[] not null, -- array of event types to trigger webhook
  secret text,
  is_active boolean default true,
  last_triggered_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Webhook deliveries
create table if not exists public.webhook_deliveries (
  id uuid primary key default uuid_generate_v4(),
  webhook_id uuid references public.webhooks not null,
  event_type text not null,
  payload jsonb not null,
  response_status integer,
  response_body text,
  created_at timestamp with time zone default now()
);

-- Indexes for performance
create index if not exists idx_leads_user_id on public.leads(user_id);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_ai_score on public.leads(ai_score);
create index if not exists idx_messages_user_id on public.messages(user_id);
create index if not exists idx_messages_lead_id on public.messages(lead_id);
create index if not exists idx_messages_channel on public.messages(channel);
create index if not exists idx_campaigns_user_id on public.campaigns(user_id);
create index if not exists idx_campaigns_status on public.campaigns(status);
create index if not exists idx_companies_user_id on public.companies(user_id);
create index if not exists idx_whatsapp_sessions_user_id on public.whatsapp_sessions(user_id);
create index if not exists idx_social_sessions_user_id on public.social_sessions(user_id);
create index if not exists idx_conversations_user_id on public.conversations(user_id);
create index if not exists idx_conversations_lead_id on public.conversations(lead_id);
create index if not exists idx_analytics_user_id_date on public.analytics(user_id, date);
create index if not exists idx_webhooks_user_id on public.webhooks(user_id);

-- Triggers for updated_at timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_user_profiles_updated_at before update on public.user_profiles for each row execute function update_updated_at_column();
create trigger update_whatsapp_sessions_updated_at before update on public.whatsapp_sessions for each row execute function update_updated_at_column();
create trigger update_social_sessions_updated_at before update on public.social_sessions for each row execute function update_updated_at_column();
create trigger update_companies_updated_at before update on public.companies for each row execute function update_updated_at_column();
create trigger update_leads_updated_at before update on public.leads for each row execute function update_updated_at_column();
create trigger update_campaigns_updated_at before update on public.campaigns for each row execute function update_updated_at_column();
create trigger update_conversations_updated_at before update on public.conversations for each row execute function update_updated_at_column();
create trigger update_appointments_updated_at before update on public.appointments for each row execute function update_updated_at_column();
create trigger update_automation_sequences_updated_at before update on public.automation_sequences for each row execute function update_updated_at_column();
create trigger update_webhooks_updated_at before update on public.webhooks for each row execute function update_updated_at_column(); 