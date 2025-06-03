import { supabase } from './supabase.js';

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// Initialize Claude client
export async function initializeClaude() {
    if (!CLAUDE_API_KEY) {
        throw new Error('Missing Claude API key');
    }
    return true;
}

// Analyze lead data using Claude
export async function analyzeLead(leadData) {
    const prompt = `Analyze the following lead data and provide insights:
    Name: ${leadData.full_name}
    Company: ${leadData.company}
    Source: ${leadData.source}
    Status: ${leadData.status}
    Score: ${leadData.score}
    
    Please provide:
    1. Lead quality assessment
    2. Recommended next steps
    3. Potential objections to address
    4. Suggested messaging approach`;

    return await callClaudeAPI(prompt);
}

// Generate personalized outreach message
export async function generateOutreachMessage(leadData, campaignContext) {
    const prompt = `Generate a personalized outreach message for the following lead:
    Name: ${leadData.full_name}
    Company: ${leadData.company}
    Industry: ${leadData.industry}
    Pain Points: ${leadData.pain_points}
    
    Campaign Context:
    Objective: ${campaignContext.objective}
    Target Audience: ${campaignContext.target_audience}
    Key Benefits: ${campaignContext.key_benefits}
    
    Please generate:
    1. A compelling subject line
    2. A personalized opening
    3. Value proposition
    4. Clear call to action`;

    return await callClaudeAPI(prompt);
}

// Generate campaign strategy
export async function generateCampaignStrategy(campaignData) {
    const prompt = `Create a comprehensive campaign strategy for:
    Platform: ${campaignData.platform}
    Objective: ${campaignData.objective}
    Target Audience: ${campaignData.target_audience}
    Budget: ${campaignData.budget}
    
    Please provide:
    1. Campaign structure
    2. Ad creative recommendations
    3. Targeting strategy
    4. Budget allocation
    5. Performance metrics to track`;

    return await callClaudeAPI(prompt);
}

// Analyze campaign performance
export async function analyzeCampaignPerformance(metrics) {
    const prompt = `Analyze the following campaign performance metrics:
    Impressions: ${metrics.impressions}
    Clicks: ${metrics.clicks}
    Leads: ${metrics.leads}
    Conversions: ${metrics.conversions}
    Spend: ${metrics.spend}
    
    Please provide:
    1. Performance assessment
    2. Key insights
    3. Optimization recommendations
    4. ROI analysis`;

    return await callClaudeAPI(prompt);
}

// Call Claude API
async function callClaudeAPI(prompt) {
    try {
        const response = await fetch(CLAUDE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-opus-20240229',
                max_tokens: 4000,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error('Failed to call Claude API');
        }

        const data = await response.json();
        return data.content[0].text;
    } catch (error) {
        console.error('Error calling Claude API:', error);
        throw error;
    }
}

// Save Claude analysis to Supabase
export async function saveClaudeAnalysis(leadId, analysis) {
    const { error } = await supabase
        .from('lead_analyses')
        .insert({
            lead_id: leadId,
            analysis: analysis,
            created_at: new Date().toISOString()
        });

    if (error) throw error;
}

// Get historical Claude analyses
export async function getLeadAnalyses(leadId) {
    const { data, error } = await supabase
        .from('lead_analyses')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
} 