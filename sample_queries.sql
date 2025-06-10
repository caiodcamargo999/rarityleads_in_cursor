-- =====================================================
-- RARITY LEADS - SAMPLE QUERIES & TESTING
-- Useful queries for testing and managing the database
-- =====================================================

-- =====================================================
-- TESTING QUERIES
-- =====================================================

-- 1. Check all tables were created
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. Verify RLS is enabled
SELECT 
    schemaname, 
    tablename, 
    rowsecurity,
    (SELECT count(*) FROM pg_policies WHERE tablename = t.tablename) as policy_count
FROM pg_tables t
WHERE schemaname = 'public' 
ORDER BY tablename;

-- 3. Check indexes
SELECT 
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert sample user profile (after authentication)
INSERT INTO public.user_profiles (id, email, full_name, company_name, subscription_plan)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'demo@rarityleads.com',
    'Demo User',
    'Rarity Agency',
    'pro'
);

-- Insert sample phone number
INSERT INTO public.phone_numbers (user_id, phone_number, country_code, is_whatsapp_enabled, is_primary)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    '+5511999999999',
    '+55',
    true,
    true
);

-- Insert sample company
INSERT INTO public.companies (user_id, name, domain, industry, size_category, employee_count)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'TechCorp Solutions',
    'techcorp.com',
    'Technology',
    'medium',
    150
);

-- Insert sample leads
INSERT INTO public.leads (user_id, company_id, first_name, last_name, email, job_title, seniority_level, lead_score)
VALUES 
    ('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.companies WHERE name = 'TechCorp Solutions'), 'Sarah', 'Johnson', 'sarah@techcorp.com', 'CEO', 'c-level', 95),
    ('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.companies WHERE name = 'TechCorp Solutions'), 'John', 'Smith', 'john@techcorp.com', 'CTO', 'c-level', 92),
    ('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.companies WHERE name = 'TechCorp Solutions'), 'Maria', 'Garcia', 'maria@techcorp.com', 'VP Marketing', 'vp', 88);

-- Insert sample campaign
INSERT INTO public.campaigns (user_id, name, description, campaign_type, status, target_audience)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Q1 LinkedIn Outreach',
    'Target C-level executives in tech companies',
    'linkedin',
    'active',
    '{"seniority": ["c-level", "vp"], "industry": ["Technology"]}'::jsonb
);

-- =====================================================
-- ANALYTICS QUERIES
-- =====================================================

-- Dashboard overview stats
SELECT 
    COUNT(*) as total_leads,
    COUNT(CASE WHEN status = 'new' THEN 1 END) as new_leads,
    COUNT(CASE WHEN status = 'qualified' THEN 1 END) as qualified_leads,
    COUNT(CASE WHEN status = 'customer' THEN 1 END) as customers,
    AVG(lead_score) as avg_lead_score,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as leads_this_week
FROM public.leads 
WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- Campaign performance summary
SELECT 
    c.name,
    c.campaign_type,
    c.status,
    c.total_leads_targeted,
    c.total_leads_contacted,
    c.total_responses,
    c.conversion_rate,
    COUNT(m.id) as total_messages,
    COUNT(CASE WHEN m.status = 'delivered' THEN 1 END) as delivered_messages,
    COUNT(CASE WHEN m.direction = 'inbound' THEN 1 END) as replies
FROM public.campaigns c
LEFT JOIN public.messages m ON c.id = m.campaign_id
WHERE c.user_id = '00000000-0000-0000-0000-000000000001'
GROUP BY c.id, c.name, c.campaign_type, c.status, c.total_leads_targeted, c.total_leads_contacted, c.total_responses, c.conversion_rate;

-- Lead pipeline by status
SELECT 
    status,
    COUNT(*) as count,
    AVG(lead_score) as avg_score,
    COUNT(*) * 100.0 / SUM(COUNT(*)) OVER() as percentage
FROM public.leads 
WHERE user_id = '00000000-0000-0000-0000-000000000001'
GROUP BY status
ORDER BY 
    CASE status 
        WHEN 'new' THEN 1
        WHEN 'contacted' THEN 2
        WHEN 'qualified' THEN 3
        WHEN 'opportunity' THEN 4
        WHEN 'customer' THEN 5
        WHEN 'lost' THEN 6
    END;

-- Top performing companies by lead score
SELECT 
    c.name as company_name,
    c.industry,
    c.size_category,
    COUNT(l.id) as lead_count,
    AVG(l.lead_score) as avg_lead_score,
    COUNT(CASE WHEN l.status = 'customer' THEN 1 END) as customers
FROM public.companies c
LEFT JOIN public.leads l ON c.id = l.company_id
WHERE c.user_id = '00000000-0000-0000-0000-000000000001'
GROUP BY c.id, c.name, c.industry, c.size_category
HAVING COUNT(l.id) > 0
ORDER BY avg_lead_score DESC, lead_count DESC;

-- Message activity by day (last 30 days)
SELECT 
    DATE(created_at) as date,
    message_type,
    direction,
    COUNT(*) as message_count,
    COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_count,
    COUNT(CASE WHEN direction = 'inbound' THEN 1 END) as replies_count
FROM public.messages 
WHERE user_id = '00000000-0000-0000-0000-000000000001'
    AND created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(created_at), message_type, direction
ORDER BY date DESC, message_type;

-- =====================================================
-- LEAD SCORING QUERIES
-- =====================================================

-- Test lead scoring function
SELECT 
    id,
    first_name,
    last_name,
    job_title,
    seniority_level,
    lead_score as current_score,
    calculate_lead_score(id) as calculated_score
FROM public.leads 
WHERE user_id = '00000000-0000-0000-0000-000000000001'
ORDER BY lead_score DESC;

-- Lead scoring history
SELECT 
    l.first_name,
    l.last_name,
    lsh.previous_score,
    lsh.new_score,
    lsh.scoring_factors,
    lsh.calculated_at
FROM public.lead_scoring_history lsh
JOIN public.leads l ON lsh.lead_id = l.id
WHERE l.user_id = '00000000-0000-0000-0000-000000000001'
ORDER BY lsh.calculated_at DESC;

-- =====================================================
-- WHATSAPP ACCOUNT QUERIES
-- =====================================================

-- WhatsApp accounts overview
SELECT 
    pn.phone_number,
    pn.country_code,
    pn.is_whatsapp_enabled,
    pn.verification_status,
    wa.account_name,
    wa.status,
    wa.daily_message_limit,
    wa.messages_sent_today
FROM public.phone_numbers pn
LEFT JOIN public.whatsapp_accounts wa ON pn.id = wa.phone_number_id
WHERE pn.user_id = '00000000-0000-0000-0000-000000000001';

-- Daily message usage by phone number
SELECT 
    pn.phone_number,
    wa.daily_message_limit,
    wa.messages_sent_today,
    (wa.messages_sent_today * 100.0 / wa.daily_message_limit) as usage_percentage,
    (wa.daily_message_limit - wa.messages_sent_today) as remaining_messages
FROM public.phone_numbers pn
JOIN public.whatsapp_accounts wa ON pn.id = wa.phone_number_id
WHERE pn.user_id = '00000000-0000-0000-0000-000000000001'
    AND wa.status = 'active';

-- =====================================================
-- PERFORMANCE MONITORING
-- =====================================================

-- API usage by endpoint
SELECT 
    endpoint,
    method,
    SUM(requests_count) as total_requests,
    COUNT(DISTINCT date) as days_active,
    AVG(requests_count) as avg_daily_requests
FROM public.api_usage 
WHERE user_id = '00000000-0000-0000-0000-000000000001'
    AND date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY endpoint, method
ORDER BY total_requests DESC;

-- User activity summary
SELECT 
    activity_type,
    COUNT(*) as activity_count,
    COUNT(DISTINCT DATE(created_at)) as active_days,
    MAX(created_at) as last_activity
FROM public.user_activities 
WHERE user_id = '00000000-0000-0000-0000-000000000001'
    AND created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY activity_type
ORDER BY activity_count DESC;

-- =====================================================
-- MAINTENANCE QUERIES
-- =====================================================

-- Clean up old notifications (older than 30 days)
DELETE FROM public.notifications 
WHERE created_at < CURRENT_DATE - INTERVAL '30 days'
    AND is_read = true;

-- Update message limits daily (run as scheduled job)
UPDATE public.whatsapp_accounts 
SET 
    messages_sent_today = 0,
    last_message_reset = NOW()
WHERE last_message_reset < CURRENT_DATE;

-- Recalculate all lead scores
UPDATE public.leads 
SET lead_score = calculate_lead_score(id)
WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- =====================================================
-- BACKUP & EXPORT QUERIES
-- =====================================================

-- Export leads to CSV format
SELECT 
    l.first_name,
    l.last_name,
    l.email,
    l.phone,
    l.job_title,
    l.seniority_level,
    l.lead_score,
    l.status,
    c.name as company_name,
    c.industry,
    l.created_at
FROM public.leads l
LEFT JOIN public.companies c ON l.company_id = c.id
WHERE l.user_id = '00000000-0000-0000-0000-000000000001'
ORDER BY l.lead_score DESC, l.created_at DESC;

-- Export campaign performance
SELECT 
    name,
    campaign_type,
    status,
    total_leads_targeted,
    total_leads_contacted,
    total_responses,
    conversion_rate,
    cost_per_lead,
    created_at,
    start_date,
    end_date
FROM public.campaigns 
WHERE user_id = '00000000-0000-0000-0000-000000000001'
ORDER BY created_at DESC;
