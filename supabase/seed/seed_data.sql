-- seed_data.sql: Example seed data for Rarity Leads

-- Insert a test user profile (assumes a user exists in auth.users with this UUID)
insert into public.user_profiles (id, user_id, full_name, role, preferences)
values ('11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'Test Admin', 'admin', '{"lang": "en"}');

insert into public.phone_numbers (id, user_id, phone_number, is_verified)
values ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '+15551234567', true);

insert into public.whatsapp_sessions (id, user_id, phone_number, session_data, status)
values ('33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', '+15551234567', '{"session": "test"}', 'connected');

insert into public.companies (id, user_id, name, data)
values ('44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Test Company', '{"industry": "SaaS"}');

insert into public.leads (id, user_id, company_id, whatsapp_session_id, data, status)
values ('55555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', '33333333-3333-3333-3333-333333333333', '{"name": "Lead One"}', 'new');

insert into public.campaigns (id, user_id, name, data, whatsapp_session_id, status)
values ('66666666-6666-6666-6666-666666666666', '11111111-1111-1111-1111-111111111111', 'Test Campaign', '{"type": "email"}', '33333333-3333-3333-3333-333333333333', 'active');

insert into public.messages (id, user_id, lead_id, whatsapp_session_id, direction, content, status)
values ('77777777-7777-7777-7777-777777777777', '11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', '33333333-3333-3333-3333-333333333333', 'sent', '{"text": "Hello!"}', 'delivered');

insert into public.appointments (id, user_id, lead_id, campaign_id, scheduled_at, status, data)
values ('88888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', '2024-06-01T10:00:00Z', 'scheduled', '{"location": "Zoom"}');

insert into public.automation_sequences (id, user_id, campaign_id, data, status)
values ('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', '66666666-6666-6666-6666-666666666666', '{"steps": ["email", "whatsapp"]}', 'active');

insert into public.conversations (id, user_id, lead_id, data)
values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', '{"messages": ["Hi"]}');

insert into public.analytics (id, user_id, data)
values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', '{"metric": 42}'); 