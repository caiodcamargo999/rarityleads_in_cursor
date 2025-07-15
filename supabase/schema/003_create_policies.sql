-- 003_create_policies.sql: Create RLS policies for Rarity Leads

-- Enable RLS on all tables
alter table public.user_profiles enable row level security;
alter table public.phone_numbers enable row level security;
alter table public.whatsapp_sessions enable row level security;
alter table public.social_sessions enable row level security;
alter table public.companies enable row level security;
alter table public.leads enable row level security;
alter table public.campaigns enable row level security;
alter table public.campaign_leads enable row level security;
alter table public.messages enable row level security;
alter table public.conversations enable row level security;
alter table public.appointments enable row level security;
alter table public.automation_sequences enable row level security;
alter table public.sequence_steps enable row level security;
alter table public.analytics enable row level security;
alter table public.lead_interactions enable row level security;
alter table public.webhooks enable row level security;
alter table public.webhook_deliveries enable row level security;

-- User profiles policies
create policy "Users can view own profile" on public.user_profiles
  for select using (auth.uid() = user_id);

create policy "Users can update own profile" on public.user_profiles
  for update using (auth.uid() = user_id);

create policy "Users can insert own profile" on public.user_profiles
  for insert with check (auth.uid() = user_id);

-- Phone numbers policies
create policy "Users can manage own phone numbers" on public.phone_numbers
  for all using (auth.uid() = user_id);

-- WhatsApp sessions policies
create policy "Users can manage own WhatsApp sessions" on public.whatsapp_sessions
  for all using (auth.uid() = user_id);

-- Social sessions policies
create policy "Users can manage own social sessions" on public.social_sessions
  for all using (auth.uid() = user_id);

-- Companies policies
create policy "Users can manage own companies" on public.companies
  for all using (auth.uid() = user_id);

-- Leads policies
create policy "Users can manage own leads" on public.leads
  for all using (auth.uid() = user_id);

-- Campaigns policies
create policy "Users can manage own campaigns" on public.campaigns
  for all using (auth.uid() = user_id);

-- Campaign leads policies
create policy "Users can manage own campaign leads" on public.campaign_leads
  for all using (
    exists (
      select 1 from public.campaigns
      where campaigns.id = campaign_leads.campaign_id
      and campaigns.user_id = auth.uid()
    )
  );

-- Messages policies
create policy "Users can manage own messages" on public.messages
  for all using (auth.uid() = user_id);

-- Conversations policies
create policy "Users can manage own conversations" on public.conversations
  for all using (auth.uid() = user_id);

-- Appointments policies
create policy "Users can manage own appointments" on public.appointments
  for all using (auth.uid() = user_id);

-- Automation sequences policies
create policy "Users can manage own automation sequences" on public.automation_sequences
  for all using (auth.uid() = user_id);

-- Sequence steps policies
create policy "Users can manage own sequence steps" on public.sequence_steps
  for all using (
    exists (
      select 1 from public.automation_sequences
      where automation_sequences.id = sequence_steps.sequence_id
      and automation_sequences.user_id = auth.uid()
    )
  );

-- Analytics policies
create policy "Users can manage own analytics" on public.analytics
  for all using (auth.uid() = user_id);

-- Lead interactions policies
create policy "Users can manage own lead interactions" on public.lead_interactions
  for all using (
    exists (
      select 1 from public.leads
      where leads.id = lead_interactions.lead_id
      and leads.user_id = auth.uid()
    )
  );

-- Webhooks policies
create policy "Users can manage own webhooks" on public.webhooks
  for all using (auth.uid() = user_id);

-- Webhook deliveries policies
create policy "Users can manage own webhook deliveries" on public.webhook_deliveries
  for all using (
    exists (
      select 1 from public.webhooks
      where webhooks.id = webhook_deliveries.webhook_id
      and webhooks.user_id = auth.uid()
    )
  );

-- Admin role policies (for elevated access)
-- Note: This requires an admin role to be set up in auth.users
create policy "Admins can view all data" on public.user_profiles
  for select using (
    exists (
      select 1 from public.user_profiles
      where user_profiles.user_id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );

create policy "Admins can view all leads" on public.leads
  for select using (
    exists (
      select 1 from public.user_profiles
      where user_profiles.user_id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );

create policy "Admins can view all campaigns" on public.campaigns
  for select using (
    exists (
      select 1 from public.user_profiles
      where user_profiles.user_id = auth.uid()
      and user_profiles.role = 'admin'
    )
  );

create policy "Admins can view all analytics" on public.analytics
  for select using (
    exists (
      select 1 from public.user_profiles
      where user_profiles.user_id = auth.uid()
      and user_profiles.role = 'admin'
    )
  ); 