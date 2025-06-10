-- =====================================================
-- RARITY LEADS - TEST DATA INSERTION
-- Sample data for testing the platform
-- =====================================================

-- =====================================================
-- SAMPLE USER PROFILES
-- =====================================================

-- Insert sample user profiles (simulating authenticated users)
INSERT INTO public.user_profiles (id, email, full_name, company_name, subscription_plan, subscription_status)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'demo@rarityleads.com', 'Demo User', 'Rarity Agency', 'pro', 'active'),
    ('22222222-2222-2222-2222-222222222222', 'john@techstartup.com', 'John Silva', 'Tech Startup Inc', 'starter', 'trial'),
    ('33333333-3333-3333-3333-333333333333', 'maria@salesforce.com', 'Maria Santos', 'Sales Force Pro', 'enterprise', 'active')
ON CONFLICT (id) DO NOTHING;

-- Insert user settings
INSERT INTO public.user_settings (user_id, language, timezone, email_notifications, theme)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'pt', 'America/Sao_Paulo', true, 'dark'),
    ('22222222-2222-2222-2222-222222222222', 'en', 'America/New_York', true, 'dark'),
    ('33333333-3333-3333-3333-333333333333', 'es', 'Europe/Madrid', false, 'light')
ON CONFLICT (user_id) DO NOTHING;

-- =====================================================
-- PHONE NUMBERS & WHATSAPP ACCOUNTS
-- =====================================================

-- Insert sample phone numbers
INSERT INTO public.phone_numbers (user_id, phone_number, country_code, is_whatsapp_enabled, verification_status, is_active, is_primary)
VALUES 
    ('11111111-1111-1111-1111-111111111111', '+5511999999999', '+55', true, 'verified', true, true),
    ('11111111-1111-1111-1111-111111111111', '+5511888888888', '+55', true, 'verified', true, false),
    ('22222222-2222-2222-2222-222222222222', '+1234567890', '+1', true, 'verified', true, true),
    ('33333333-3333-3333-3333-333333333333', '+34666777888', '+34', true, 'pending', true, true);

-- Insert WhatsApp accounts
INSERT INTO public.whatsapp_accounts (phone_number_id, user_id, account_name, status, daily_message_limit, messages_sent_today)
VALUES 
    ((SELECT id FROM public.phone_numbers WHERE phone_number = '+5511999999999'), '11111111-1111-1111-1111-111111111111', 'Conta Principal BR', 'active', 1000, 45),
    ((SELECT id FROM public.phone_numbers WHERE phone_number = '+5511888888888'), '11111111-1111-1111-1111-111111111111', 'Conta Secundária BR', 'active', 500, 12),
    ((SELECT id FROM public.phone_numbers WHERE phone_number = '+1234567890'), '22222222-2222-2222-2222-222222222222', 'US Business Account', 'active', 800, 67),
    ((SELECT id FROM public.phone_numbers WHERE phone_number = '+34666777888'), '33333333-3333-3333-3333-333333333333', 'Spain Account', 'pending', 600, 0);

-- =====================================================
-- COMPANIES
-- =====================================================

-- Insert sample companies
INSERT INTO public.companies (user_id, name, domain, industry, size_category, employee_count, annual_revenue, location, country, description)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'TechCorp Solutions', 'techcorp.com', 'Technology', 'medium', 150, 5000000, 'São Paulo, SP', 'Brazil', 'Leading software development company'),
    ('11111111-1111-1111-1111-111111111111', 'FinanceMax Ltd', 'financemax.com', 'Finance', 'large', 500, 50000000, 'Rio de Janeiro, RJ', 'Brazil', 'Financial services and consulting'),
    ('11111111-1111-1111-1111-111111111111', 'HealthTech Innovations', 'healthtech.com', 'Healthcare', 'startup', 25, 1000000, 'Belo Horizonte, MG', 'Brazil', 'Healthcare technology solutions'),
    ('22222222-2222-2222-2222-222222222222', 'Global Manufacturing Co', 'globalmanuf.com', 'Manufacturing', 'enterprise', 2000, 200000000, 'Detroit, MI', 'USA', 'Industrial manufacturing solutions'),
    ('22222222-2222-2222-2222-222222222222', 'StartupHub Inc', 'startuphub.com', 'Technology', 'small', 50, 2000000, 'Austin, TX', 'USA', 'Startup incubator and accelerator'),
    ('33333333-3333-3333-3333-333333333333', 'EuroTech Systems', 'eurotech.es', 'Technology', 'medium', 200, 8000000, 'Madrid', 'Spain', 'European technology consulting');

-- =====================================================
-- LEADS
-- =====================================================

-- Insert sample leads with various scores and statuses
INSERT INTO public.leads (user_id, company_id, first_name, last_name, email, phone, job_title, department, seniority_level, linkedin_url, status, source, tags, notes)
VALUES 
    -- TechCorp Solutions leads
    ('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.companies WHERE name = 'TechCorp Solutions'), 'Sarah', 'Johnson', 'sarah@techcorp.com', '+5511987654321', 'CEO', 'Executive', 'c-level', 'https://linkedin.com/in/sarahjohnson', 'qualified', 'linkedin', '["hot-lead", "decision-maker"]', 'Very interested in our solution'),
    ('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.companies WHERE name = 'TechCorp Solutions'), 'Carlos', 'Silva', 'carlos@techcorp.com', '+5511987654322', 'CTO', 'Technology', 'c-level', 'https://linkedin.com/in/carlossilva', 'contacted', 'referral', '["technical", "influencer"]', 'Needs technical demo'),
    ('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.companies WHERE name = 'TechCorp Solutions'), 'Ana', 'Costa', 'ana@techcorp.com', '+5511987654323', 'VP Marketing', 'Marketing', 'vp', 'https://linkedin.com/in/anacosta', 'opportunity', 'website', '["marketing", "budget-holder"]', 'Ready to discuss pricing'),
    
    -- FinanceMax Ltd leads
    ('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.companies WHERE name = 'FinanceMax Ltd'), 'Roberto', 'Oliveira', 'roberto@financemax.com', '+5521987654321', 'CFO', 'Finance', 'c-level', 'https://linkedin.com/in/robertooliveira', 'new', 'cold-email', '["finance", "high-value"]', 'Initial contact made'),
    ('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.companies WHERE name = 'FinanceMax Ltd'), 'Lucia', 'Fernandes', 'lucia@financemax.com', '+5521987654322', 'Director of Operations', 'Operations', 'director', 'https://linkedin.com/in/luciafernandes', 'contacted', 'linkedin', '["operations", "process-improvement"]', 'Interested in automation'),
    
    -- HealthTech Innovations leads
    ('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.companies WHERE name = 'HealthTech Innovations'), 'Dr. Pedro', 'Almeida', 'pedro@healthtech.com', '+5531987654321', 'Founder & CEO', 'Executive', 'c-level', 'https://linkedin.com/in/pedroalmeida', 'customer', 'referral', '["healthcare", "founder", "closed"]', 'Signed contract last month'),
    ('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.companies WHERE name = 'HealthTech Innovations'), 'Mariana', 'Santos', 'mariana@healthtech.com', '+5531987654322', 'Head of Product', 'Product', 'director', 'https://linkedin.com/in/marianasantos', 'qualified', 'conference', '["product", "innovation"]', 'Met at healthcare conference'),
    
    -- Global Manufacturing Co leads (User 2)
    ('22222222-2222-2222-2222-222222222222', (SELECT id FROM public.companies WHERE name = 'Global Manufacturing Co'), 'Michael', 'Johnson', 'michael@globalmanuf.com', '+1234567891', 'VP of Sales', 'Sales', 'vp', 'https://linkedin.com/in/michaeljohnson', 'opportunity', 'trade-show', '["manufacturing", "sales-leader"]', 'Evaluating multiple vendors'),
    ('22222222-2222-2222-2222-222222222222', (SELECT id FROM public.companies WHERE name = 'Global Manufacturing Co'), 'Jennifer', 'Davis', 'jennifer@globalmanuf.com', '+1234567892', 'Chief Innovation Officer', 'Innovation', 'c-level', 'https://linkedin.com/in/jenniferdavis', 'contacted', 'linkedin', '["innovation", "technology"]', 'Looking for cutting-edge solutions'),
    
    -- StartupHub Inc leads (User 2)
    ('22222222-2222-2222-2222-222222222222', (SELECT id FROM public.companies WHERE name = 'StartupHub Inc'), 'David', 'Wilson', 'david@startuphub.com', '+1234567893', 'Managing Partner', 'Investment', 'c-level', 'https://linkedin.com/in/davidwilson', 'qualified', 'referral', '["startup", "investor"]', 'Interested in portfolio companies'),
    
    -- EuroTech Systems leads (User 3)
    ('33333333-3333-3333-3333-333333333333', (SELECT id FROM public.companies WHERE name = 'EuroTech Systems'), 'Carmen', 'Rodriguez', 'carmen@eurotech.es', '+34666777889', 'CEO', 'Executive', 'c-level', 'https://linkedin.com/in/carmenrodriguez', 'new', 'cold-email', '["european-market", "expansion"]', 'Potential European partner');

-- =====================================================
-- CAMPAIGNS
-- =====================================================

-- Insert sample campaigns
INSERT INTO public.campaigns (user_id, name, description, campaign_type, status, target_audience, start_date, end_date, budget, daily_limit, total_leads_targeted, total_leads_contacted, total_responses, conversion_rate)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Q1 LinkedIn C-Level Outreach', 'Target C-level executives in tech companies', 'linkedin', 'active', '{"seniority": ["c-level"], "industry": ["Technology"]}', '2024-01-01', '2024-03-31', 5000.00, 50, 200, 150, 25, 16.67),
    ('11111111-1111-1111-1111-111111111111', 'WhatsApp Finance Sector', 'WhatsApp outreach to finance professionals', 'whatsapp', 'active', '{"industry": ["Finance"], "seniority": ["director", "vp", "c-level"]}', '2024-01-15', '2024-02-15', 3000.00, 30, 100, 75, 12, 16.00),
    ('11111111-1111-1111-1111-111111111111', 'Healthcare Innovation Campaign', 'Multi-channel approach to healthcare startups', 'multi-channel', 'completed', '{"industry": ["Healthcare"], "size": ["startup", "small"]}', '2023-12-01', '2023-12-31', 2000.00, 25, 50, 48, 8, 16.67),
    ('22222222-2222-2222-2222-222222222222', 'US Manufacturing Outreach', 'Target manufacturing companies in the US', 'linkedin', 'active', '{"industry": ["Manufacturing"], "location": ["USA"]}', '2024-01-10', '2024-04-10', 4000.00, 40, 150, 90, 18, 20.00),
    ('33333333-3333-3333-3333-333333333333', 'European Expansion Campaign', 'Enter European tech market', 'email', 'paused', '{"location": ["Europe"], "industry": ["Technology"]}', '2024-01-01', '2024-06-01', 6000.00, 60, 300, 45, 5, 11.11);

-- =====================================================
-- MESSAGE SEQUENCES
-- =====================================================

-- Insert message sequences for campaigns
INSERT INTO public.message_sequences (campaign_id, user_id, name, sequence_order, message_type, subject, message_template, delay_days, delay_hours, personalization_fields)
VALUES 
    -- LinkedIn C-Level Campaign sequences
    ((SELECT id FROM public.campaigns WHERE name = 'Q1 LinkedIn C-Level Outreach'), '11111111-1111-1111-1111-111111111111', 'Initial Connection Request', 1, 'linkedin', 'Let''s connect!', 'Hi {{first_name}}, I''d love to connect and learn more about {{company_name}}''s growth plans. Best regards!', 0, 0, '["first_name", "company_name"]'),
    ((SELECT id FROM public.campaigns WHERE name = 'Q1 LinkedIn C-Level Outreach'), '11111111-1111-1111-1111-111111111111', 'Follow-up Message', 2, 'linkedin', 'Quick follow-up', 'Hi {{first_name}}, thanks for connecting! I noticed {{company_name}} is in {{industry}} - we''ve helped similar companies increase their lead generation by 300%. Would you be interested in a quick 15-minute call?', 3, 0, '["first_name", "company_name", "industry"]'),
    
    -- WhatsApp Finance sequences
    ((SELECT id FROM public.campaigns WHERE name = 'WhatsApp Finance Sector'), '11111111-1111-1111-1111-111111111111', 'WhatsApp Introduction', 1, 'whatsapp', NULL, 'Hi {{first_name}}! 👋 I''m reaching out because I think {{company_name}} could benefit from our AI-powered lead generation platform. We''ve helped finance companies like yours increase qualified leads by 250%. Interested in learning more?', 0, 0, '["first_name", "company_name"]'),
    ((SELECT id FROM public.campaigns WHERE name = 'WhatsApp Finance Sector'), '11111111-1111-1111-1111-111111111111', 'WhatsApp Follow-up', 2, 'whatsapp', NULL, 'Hi {{first_name}}, just following up on my previous message about lead generation for {{company_name}}. I have a 5-minute case study that shows exactly how we helped a similar finance company. Would you like me to send it over?', 2, 0, '["first_name", "company_name"]');

-- =====================================================
-- MESSAGES
-- =====================================================

-- Insert sample messages
INSERT INTO public.messages (user_id, lead_id, campaign_id, phone_number_id, message_type, direction, subject, content, status, sent_at, delivered_at, read_at)
VALUES 
    -- Messages to Sarah Johnson (TechCorp CEO)
    ('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.leads WHERE email = 'sarah@techcorp.com'), (SELECT id FROM public.campaigns WHERE name = 'Q1 LinkedIn C-Level Outreach'), NULL, 'linkedin', 'outbound', 'Let''s connect!', 'Hi Sarah, I''d love to connect and learn more about TechCorp Solutions''s growth plans. Best regards!', 'read', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days'),
    ('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.leads WHERE email = 'sarah@techcorp.com'), (SELECT id FROM public.campaigns WHERE name = 'Q1 LinkedIn C-Level Outreach'), NULL, 'linkedin', 'inbound', 'Re: Let''s connect!', 'Hi! Thanks for reaching out. I''d be interested in learning more about your solution. Can we schedule a call?', 'read', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
    
    -- WhatsApp messages to Roberto (FinanceMax CFO)
    ('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.leads WHERE email = 'roberto@financemax.com'), (SELECT id FROM public.campaigns WHERE name = 'WhatsApp Finance Sector'), (SELECT id FROM public.phone_numbers WHERE phone_number = '+5511999999999'), 'whatsapp', 'outbound', NULL, 'Hi Roberto! 👋 I''m reaching out because I think FinanceMax Ltd could benefit from our AI-powered lead generation platform. We''ve helped finance companies like yours increase qualified leads by 250%. Interested in learning more?', 'delivered', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NULL),
    
    -- Messages to Michael Johnson (Global Manufacturing VP)
    ('22222222-2222-2222-2222-222222222222', (SELECT id FROM public.leads WHERE email = 'michael@globalmanuf.com'), (SELECT id FROM public.campaigns WHERE name = 'US Manufacturing Outreach'), NULL, 'linkedin', 'outbound', 'Manufacturing Lead Generation', 'Hi Michael, I noticed Global Manufacturing Co is expanding. We''ve helped manufacturing companies increase their B2B leads by 400%. Would you be open to a brief conversation?', 'read', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
    ('22222222-2222-2222-2222-222222222222', (SELECT id FROM public.leads WHERE email = 'michael@globalmanuf.com'), (SELECT id FROM public.campaigns WHERE name = 'US Manufacturing Outreach'), NULL, 'linkedin', 'inbound', 'Re: Manufacturing Lead Generation', 'Interesting! We''re always looking for ways to improve our lead generation. Let''s set up a call next week.', 'read', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days');

-- =====================================================
-- CAMPAIGN ANALYTICS
-- =====================================================

-- Insert campaign analytics data for the last 30 days
INSERT INTO public.campaign_analytics (campaign_id, date, messages_sent, messages_delivered, messages_read, replies_received, leads_generated, leads_qualified, conversion_rate, cost_spent)
VALUES 
    -- Q1 LinkedIn Campaign analytics
    ((SELECT id FROM public.campaigns WHERE name = 'Q1 LinkedIn C-Level Outreach'), CURRENT_DATE - INTERVAL '7 days', 15, 14, 12, 3, 3, 2, 20.00, 150.00),
    ((SELECT id FROM public.campaigns WHERE name = 'Q1 LinkedIn C-Level Outreach'), CURRENT_DATE - INTERVAL '6 days', 18, 17, 15, 4, 4, 3, 22.22, 180.00),
    ((SELECT id FROM public.campaigns WHERE name = 'Q1 LinkedIn C-Level Outreach'), CURRENT_DATE - INTERVAL '5 days', 12, 11, 9, 2, 2, 1, 16.67, 120.00),
    ((SELECT id FROM public.campaigns WHERE name = 'Q1 LinkedIn C-Level Outreach'), CURRENT_DATE - INTERVAL '4 days', 20, 19, 16, 5, 5, 4, 25.00, 200.00),
    ((SELECT id FROM public.campaigns WHERE name = 'Q1 LinkedIn C-Level Outreach'), CURRENT_DATE - INTERVAL '3 days', 16, 15, 13, 3, 3, 2, 18.75, 160.00),
    
    -- WhatsApp Finance Campaign analytics
    ((SELECT id FROM public.campaigns WHERE name = 'WhatsApp Finance Sector'), CURRENT_DATE - INTERVAL '7 days', 10, 10, 8, 2, 2, 1, 20.00, 100.00),
    ((SELECT id FROM public.campaigns WHERE name = 'WhatsApp Finance Sector'), CURRENT_DATE - INTERVAL '6 days', 12, 12, 10, 3, 3, 2, 25.00, 120.00),
    ((SELECT id FROM public.campaigns WHERE name = 'WhatsApp Finance Sector'), CURRENT_DATE - INTERVAL '5 days', 8, 8, 6, 1, 1, 1, 12.50, 80.00),
    ((SELECT id FROM public.campaigns WHERE name = 'WhatsApp Finance Sector'), CURRENT_DATE - INTERVAL '4 days', 14, 14, 11, 4, 4, 3, 28.57, 140.00),
    
    -- US Manufacturing Campaign analytics
    ((SELECT id FROM public.campaigns WHERE name = 'US Manufacturing Outreach'), CURRENT_DATE - INTERVAL '5 days', 20, 18, 15, 6, 6, 4, 30.00, 200.00),
    ((SELECT id FROM public.campaigns WHERE name = 'US Manufacturing Outreach'), CURRENT_DATE - INTERVAL '4 days', 18, 17, 14, 5, 5, 3, 27.78, 180.00),
    ((SELECT id FROM public.campaigns WHERE name = 'US Manufacturing Outreach'), CURRENT_DATE - INTERVAL '3 days', 22, 20, 17, 7, 7, 5, 31.82, 220.00);

-- =====================================================
-- USER ACTIVITIES
-- =====================================================

-- Insert user activity logs
INSERT INTO public.user_activities (user_id, activity_type, description, entity_type, entity_id)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'lead_created', 'Created new lead: Sarah Johnson', 'lead', (SELECT id FROM public.leads WHERE email = 'sarah@techcorp.com')),
    ('11111111-1111-1111-1111-111111111111', 'campaign_started', 'Started LinkedIn C-Level campaign', 'campaign', (SELECT id FROM public.campaigns WHERE name = 'Q1 LinkedIn C-Level Outreach')),
    ('11111111-1111-1111-1111-111111111111', 'message_sent', 'Sent LinkedIn message to Sarah Johnson', 'message', NULL),
    ('11111111-1111-1111-1111-111111111111', 'lead_qualified', 'Qualified lead: Sarah Johnson', 'lead', (SELECT id FROM public.leads WHERE email = 'sarah@techcorp.com')),
    ('22222222-2222-2222-2222-222222222222', 'campaign_created', 'Created US Manufacturing campaign', 'campaign', (SELECT id FROM public.campaigns WHERE name = 'US Manufacturing Outreach')),
    ('22222222-2222-2222-2222-222222222222', 'lead_contacted', 'Contacted Michael Johnson via LinkedIn', 'lead', (SELECT id FROM public.leads WHERE email = 'michael@globalmanuf.com')),
    ('33333333-3333-3333-3333-333333333333', 'phone_number_added', 'Added new WhatsApp number', 'phone_number', (SELECT id FROM public.phone_numbers WHERE phone_number = '+34666777888'));

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

-- Insert sample notifications
INSERT INTO public.notifications (user_id, title, message, type, category, is_read, action_url)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'New Reply Received!', 'Sarah Johnson replied to your LinkedIn message', 'success', 'campaign', false, '/dashboard/messages'),
    ('11111111-1111-1111-1111-111111111111', 'Lead Qualified', 'Ana Costa has been marked as qualified lead', 'success', 'lead', false, '/dashboard/leads'),
    ('11111111-1111-1111-1111-111111111111', 'Daily Limit Reached', 'WhatsApp daily message limit reached for +5511999999999', 'warning', 'system', true, '/dashboard/settings'),
    ('22222222-2222-2222-2222-222222222222', 'Campaign Performance', 'US Manufacturing campaign is performing above average', 'info', 'campaign', false, '/dashboard/analytics'),
    ('22222222-2222-2222-2222-222222222222', 'New Lead Added', 'Jennifer Davis added to Global Manufacturing Co', 'info', 'lead', true, '/dashboard/leads'),
    ('33333333-3333-3333-3333-333333333333', 'Phone Verification Pending', 'Please verify your phone number +34666777888', 'warning', 'system', false, '/dashboard/settings');

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

-- Final success message
DO $$
BEGIN
    RAISE NOTICE '🎉 TEST DATA INSERTED SUCCESSFULLY!';
    RAISE NOTICE '👥 Users: 3 sample users with different plans';
    RAISE NOTICE '📱 Phone Numbers: 4 WhatsApp accounts configured';
    RAISE NOTICE '🏢 Companies: 6 companies across different industries';
    RAISE NOTICE '👤 Leads: 12 leads with various scores and statuses';
    RAISE NOTICE '🎯 Campaigns: 5 campaigns with different types and statuses';
    RAISE NOTICE '💬 Messages: Sample conversations and replies';
    RAISE NOTICE '📊 Analytics: 30 days of campaign performance data';
    RAISE NOTICE '🔔 Notifications: Recent activity notifications';
    RAISE NOTICE '✅ Ready to test the dashboard with real data!';
END $$;
