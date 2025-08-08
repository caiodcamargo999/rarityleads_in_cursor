import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { generateWithLLM, AVAILABLE_MODELS } from './openrouter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadGenerationRequest {
  description: string;
  filters: {
    annualRevenue: string;
    companySize: string;
    countryCity: string;
    leadRole: string;
    contactChannel: string;
    businessNeeds: string[];
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { description, filters, model } = await req.json() as LeadGenerationRequest & { model: keyof typeof AVAILABLE_MODELS };

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Initialize API clients
    const apolloApiKey = Deno.env.get('APOLLO_API_KEY');
    const linkedinApiKey = Deno.env.get('LINKEDIN_API_KEY');
    const clearbitApiKey = Deno.env.get('CLEARBIT_API_KEY');
    const crunchbaseApiKey = Deno.env.get('CRUNCHBASE_API_KEY');

    // 1. Use selected LLM to analyze the description and create search criteria
    const openrouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!openrouterApiKey) {
      throw new Error('OpenRouter API key not configured');
    }

    const searchCriteria = await generateWithLLM(
      `Description: ${description}\nFilters: ${JSON.stringify(filters)}`,
      model,
      openrouterApiKey
    );

    // 2. Search leads from multiple data sources in parallel
    const [apolloLeads, linkedinLeads, clearbitLeads, crunchbaseLeads] = await Promise.all([
      // Apollo.io enrichment
      enrichLeadsWithApollo(initialLeads, apolloApiKey),

      // LinkedIn Sales Navigator search
      fetch('https://api.linkedin.com/v2/sales-search', {
        headers: {
          'Authorization': `Bearer ${linkedinApiKey}`,
          'X-Restli-Protocol-Version': '2.0.0',
        },
      }).then(res => res.json()),

      // Clearbit search
      fetch('https://prospector.clearbit.com/v1/people/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${clearbitApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: filters.leadRole,
          company_size: filters.companySize,
        }),
      }).then(res => res.json()),

      // Crunchbase search
      fetch('https://api.crunchbase.com/v3.1/searches/organizations', {
        headers: {
          'x-cb-user-key': crunchbaseApiKey,
        },
      }).then(res => res.json()),
    ]);

    // 3. Merge and deduplicate leads
    const allLeads = [
      ...apolloLeads,
      ...linkedinLeads,
      ...clearbitLeads,
      ...crunchbaseLeads,
    ].filter(Boolean);

    // 4. Score and rank leads using AI
    const scoredLeads = await Promise.all(
      allLeads.map(async (lead) => {
        const scoreResponse = await openai.createChatCompletion({
          model: 'gpt-4',
          messages: [{
            role: 'system',
            content: 'Score this lead from 0-100 based on how well it matches the target criteria.'
          }, {
            role: 'user',
            content: `Target Criteria: ${searchCriteria}\nLead: ${JSON.stringify(lead)}`
          }],
        });

        const score = parseInt(scoreResponse.data.choices[0].message?.content || '0');
        return { ...lead, score };
      })
    );

    // 5. Sort leads by score and return top results
    const rankedLeads = scoredLeads
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);

    // 6. Save leads to database
    const { data: savedLeads, error } = await supabaseClient
      .from('leads')
      .insert(rankedLeads)
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({ leads: savedLeads }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    );
  }
});