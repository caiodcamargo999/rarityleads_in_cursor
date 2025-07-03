-- 003_create_policies.sql: RLS policies for user-specific tables

-- Helper: allow admin access
create or replace function public.is_admin()
returns boolean as $$
declare
  result boolean;
begin
  select role = 'admin' into result from public.user_profiles where user_id = auth.uid();
  return coalesce(result, false);
end;
$$ language plpgsql security definer;

-- Policy template: user or admin
-- Usage: (user_id = auth.uid() OR public.is_admin())

-- user_profiles
create policy "Users can access own profile or admin" on public.user_profiles
for all using (user_id = auth.uid() or public.is_admin());

-- phone_numbers
create policy "Users can access own phone numbers or admin" on public.phone_numbers
for all using (user_id = auth.uid() or public.is_admin());

-- whatsapp_sessions
create policy "Users can access own whatsapp sessions or admin" on public.whatsapp_sessions
for all using (user_id = auth.uid() or public.is_admin());

-- leads
create policy "Users can access own leads or admin" on public.leads
for all using (user_id = auth.uid() or public.is_admin());

-- messages
create policy "Users can access own messages or admin" on public.messages
for all using (user_id = auth.uid() or public.is_admin());

-- campaigns
create policy "Users can access own campaigns or admin" on public.campaigns
for all using (user_id = auth.uid() or public.is_admin());

-- appointments
create policy "Users can access own appointments or admin" on public.appointments
for all using (user_id = auth.uid() or public.is_admin());

-- automation_sequences
create policy "Users can access own automation sequences or admin" on public.automation_sequences
for all using (user_id = auth.uid() or public.is_admin());

-- conversations
create policy "Users can access own conversations or admin" on public.conversations
for all using (user_id = auth.uid() or public.is_admin());

-- companies
create policy "Users can access own companies or admin" on public.companies
for all using (user_id = auth.uid() or public.is_admin());

-- analytics
create policy "Users can access own analytics or admin" on public.analytics
for all using (user_id = auth.uid() or public.is_admin()); 