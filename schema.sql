-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create profiles table
create table public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    full_name text,
    email text,
    role text check (role in ('agency_owner', 'performance_manager', 'sdr_setter', 'client')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create campaigns table
create table public.campaigns (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    platform text not null check (platform in ('facebook', 'google', 'linkedin')),
    objective text not null check (objective in ('leads', 'awareness', 'conversions')),
    budget numeric not null,
    status text not null check (status in ('draft', 'active', 'paused', 'completed')),
    created_by uuid references public.profiles(id) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create sequences table
create table public.sequences (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    platform text not null check (platform in ('whatsapp', 'email', 'sms')),
    trigger text not null check (trigger in ('lead_created', 'lead_qualified', 'appointment_scheduled')),
    steps jsonb not null,
    status text not null check (status in ('draft', 'active', 'paused')),
    created_by uuid references public.profiles(id) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create leads table
create table public.leads (
    id uuid default uuid_generate_v4() primary key,
    full_name text not null,
    email text,
    phone text,
    company text,
    source text not null check (source in ('facebook', 'google', 'linkedin', 'website')),
    status text not null check (status in ('new', 'contacted', 'qualified', 'appointment', 'closed')),
    score integer check (score >= 0 and score <= 10),
    campaign_id uuid references public.campaigns(id),
    assigned_to uuid references public.profiles(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create campaign_metrics table
create table public.campaign_metrics (
    id uuid default uuid_generate_v4() primary key,
    campaign_id uuid references public.campaigns(id) not null,
    date date not null,
    impressions integer not null default 0,
    clicks integer not null default 0,
    leads integer not null default 0,
    conversions integer not null default 0,
    spend numeric not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create LinkedIn tokens table
create table public.linkedin_tokens (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) not null,
    access_token text not null,
    refresh_token text not null,
    expires_at timestamp with time zone not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create lead analyses table
create table public.lead_analyses (
    id uuid default uuid_generate_v4() primary key,
    lead_id uuid references public.leads(id) not null,
    analysis text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create LinkedIn campaign metrics table
create table public.linkedin_campaign_metrics (
    id uuid default uuid_generate_v4() primary key,
    campaign_id uuid references public.campaigns(id) not null,
    linkedin_campaign_id text not null,
    date date not null,
    impressions integer not null default 0,
    clicks integer not null default 0,
    leads integer not null default 0,
    conversions integer not null default 0,
    spend numeric not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table public.profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.sequences enable row level security;
alter table public.leads enable row level security;
alter table public.campaign_metrics enable row level security;
alter table public.linkedin_tokens enable row level security;
alter table public.lead_analyses enable row level security;
alter table public.linkedin_campaign_metrics enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone."
    on profiles for select
    using ( true );

create policy "Users can insert their own profile."
    on profiles for insert
    with check ( auth.uid() = id );

create policy "Users can update own profile."
    on profiles for update
    using ( auth.uid() = id );

-- Campaigns policies
create policy "Users can view their own campaigns."
    on campaigns for select
    using ( auth.uid() = created_by );

create policy "Users can create campaigns."
    on campaigns for insert
    with check ( auth.uid() = created_by );

create policy "Users can update their own campaigns."
    on campaigns for update
    using ( auth.uid() = created_by );

-- Sequences policies
create policy "Users can view their own sequences."
    on sequences for select
    using ( auth.uid() = created_by );

create policy "Users can create sequences."
    on sequences for insert
    with check ( auth.uid() = created_by );

create policy "Users can update their own sequences."
    on sequences for update
    using ( auth.uid() = created_by );

-- Leads policies
create policy "Users can view leads assigned to them."
    on leads for select
    using ( auth.uid() = assigned_to );

create policy "Users can create leads."
    on leads for insert
    with check ( auth.uid() = assigned_to );

create policy "Users can update leads assigned to them."
    on leads for update
    using ( auth.uid() = assigned_to );

-- Campaign metrics policies
create policy "Users can view metrics for their campaigns."
    on campaign_metrics for select
    using (
        exists (
            select 1 from campaigns
            where campaigns.id = campaign_metrics.campaign_id
            and campaigns.created_by = auth.uid()
        )
    );

-- LinkedIn tokens policies
create policy "Users can view their own LinkedIn tokens."
    on linkedin_tokens for select
    using ( auth.uid() = user_id );

create policy "Users can insert their own LinkedIn tokens."
    on linkedin_tokens for insert
    with check ( auth.uid() = user_id );

create policy "Users can update their own LinkedIn tokens."
    on linkedin_tokens for update
    using ( auth.uid() = user_id );

-- Lead analyses policies
create policy "Users can view analyses for leads assigned to them."
    on lead_analyses for select
    using (
        exists (
            select 1 from leads
            where leads.id = lead_analyses.lead_id
            and leads.assigned_to = auth.uid()
        )
    );

create policy "Users can insert analyses for leads assigned to them."
    on lead_analyses for insert
    with check (
        exists (
            select 1 from leads
            where leads.id = lead_analyses.lead_id
            and leads.assigned_to = auth.uid()
        )
    );

-- LinkedIn campaign metrics policies
create policy "Users can view metrics for their campaigns."
    on linkedin_campaign_metrics for select
    using (
        exists (
            select 1 from campaigns
            where campaigns.id = linkedin_campaign_metrics.campaign_id
            and campaigns.created_by = auth.uid()
        )
    );

create policy "Users can insert metrics for their campaigns."
    on linkedin_campaign_metrics for insert
    with check (
        exists (
            select 1 from campaigns
            where campaigns.id = linkedin_campaign_metrics.campaign_id
            and campaigns.created_by = auth.uid()
        )
    );

-- Create functions
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, email, role)
    values (new.id, new.raw_user_meta_data->>'full_name', new.email, 'client');
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_updated_at
    before update on public.profiles
    for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at
    before update on public.campaigns
    for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at
    before update on public.sequences
    for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at
    before update on public.leads
    for each row execute procedure public.handle_updated_at();

-- Create updated_at trigger for LinkedIn tokens
create trigger handle_updated_at
    before update on public.linkedin_tokens
    for each row execute procedure public.handle_updated_at(); 