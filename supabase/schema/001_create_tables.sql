-- 001_create_tables.sql: Create all main tables for Rarity Leads

create extension if not exists "uuid-ossp";

-- User profiles (additional info for auth.users)
create table if not exists public.user_profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null unique,
  full_name text,
  role text default 'user',
  preferences jsonb,
  created_at timestamp with time zone default now()
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
  status text default 'inactive',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Leads
create table if not exists public.leads (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  company_id uuid references public.companies,
  whatsapp_session_id uuid references public.whatsapp_sessions,
  data jsonb,
  status text,
  created_at timestamp with time zone default now()
);

-- Messages
create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  lead_id uuid references public.leads,
  whatsapp_session_id uuid references public.whatsapp_sessions,
  direction text not null, -- 'sent' or 'received'
  content jsonb not null,
  status text default 'delivered',
  timestamp timestamp with time zone default now()
);

-- Campaigns
create table if not exists public.campaigns (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  data jsonb,
  whatsapp_session_id uuid references public.whatsapp_sessions,
  status text,
  created_at timestamp with time zone default now()
);

-- Appointments
create table if not exists public.appointments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  lead_id uuid references public.leads,
  campaign_id uuid references public.campaigns,
  scheduled_at timestamp with time zone,
  status text,
  data jsonb,
  created_at timestamp with time zone default now()
);

-- Automation sequences
create table if not exists public.automation_sequences (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  campaign_id uuid references public.campaigns,
  data jsonb,
  status text,
  created_at timestamp with time zone default now()
);

-- Conversations
create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  lead_id uuid references public.leads,
  data jsonb,
  created_at timestamp with time zone default now()
);

-- Companies
create table if not exists public.companies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  data jsonb,
  created_at timestamp with time zone default now()
);

-- Analytics
create table if not exists public.analytics (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  data jsonb,
  created_at timestamp with time zone default now()
);

-- Indexes for performance
create index if not exists idx_leads_user_id on public.leads(user_id);
create index if not exists idx_messages_user_id on public.messages(user_id);
create index if not exists idx_campaigns_user_id on public.campaigns(user_id);
create index if not exists idx_companies_user_id on public.companies(user_id);
create index if not exists idx_whatsapp_sessions_user_id on public.whatsapp_sessions(user_id); 