-- 002_enable_rls.sql: Enable RLS on user-specific tables

alter table public.user_profiles enable row level security;
alter table public.phone_numbers enable row level security;
alter table public.whatsapp_sessions enable row level security;
alter table public.leads enable row level security;
alter table public.messages enable row level security;
alter table public.campaigns enable row level security;
alter table public.appointments enable row level security;
alter table public.automation_sequences enable row level security;
alter table public.conversations enable row level security;
alter table public.companies enable row level security;
alter table public.analytics enable row level security; 