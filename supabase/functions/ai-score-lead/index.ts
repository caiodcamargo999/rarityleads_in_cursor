import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LeadScoringRequest {
  leadId: string
  enrichmentData?: any
}

interface ScoringFactors {
  companySize: number
  industry: number
  engagement: number
  decisionMakerLevel: number
  techStack: number
  fundingStatus: number
  recentActivity: number
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { leadId, enrichmentData } = await req.json() as LeadScoringRequest

    // Fetch lead data
    const { data: lead, error: leadError } = await supabaseClient
      .from('leads')
      .select('*, lead_enrichments(*)')
      .eq('id', leadId)
      .single()

    if (leadError) throw leadError

    // Calculate scoring factors
    const factors: ScoringFactors = calculateScoringFactors(lead, enrichmentData)
    
    // Calculate final score (0-100)
    const score = calculateFinalScore(factors)

    // Store scoring history
    const { error: historyError } = await supabaseClient
      .from('ai_scoring_history')
      .insert({
        lead_id: leadId,
        score,
        scoring_factors: factors,
        model_version: '1.0.0'
      })

    if (historyError) throw historyError

    // Update lead enrichment with AI score
    const { error: updateError } = await supabaseClient
      .from('lead_enrichments')
      .upsert({
        lead_id: leadId,
        source: 'ai_scoring',
        enrichment_data: { score, factors },
        ai_score: score
      })

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ score, factors }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

function calculateScoringFactors(lead: any, enrichmentData: any): ScoringFactors {
  const data = { ...lead.data, ...enrichmentData }
  
  return {
    companySize: scoreCompanySize(data.company?.employees),
    industry: scoreIndustry(data.company?.industry),
    engagement: scoreEngagement(data.engagement),
    decisionMakerLevel: scoreDecisionMakerLevel(data.decisionMakers),
    techStack: scoreTechStack(data.company?.techStack),
    fundingStatus: scoreFundingStatus(data.company?.funding),
    recentActivity: scoreRecentActivity(data.recentActivity)
  }
}

function calculateFinalScore(factors: ScoringFactors): number {
  const weights = {
    companySize: 0.15,
    industry: 0.20,
    engagement: 0.25,
    decisionMakerLevel: 0.15,
    techStack: 0.10,
    fundingStatus: 0.10,
    recentActivity: 0.05
  }

  let weightedScore = 0
  for (const [factor, weight] of Object.entries(weights)) {
    weightedScore += factors[factor as keyof ScoringFactors] * weight
  }

  return Math.round(weightedScore)
}

// Scoring functions
function scoreCompanySize(employees?: number): number {
  if (!employees) return 50
  if (employees < 10) return 30
  if (employees < 50) return 50
  if (employees < 200) return 70
  if (employees < 1000) return 85
  return 95
}

function scoreIndustry(industry?: string): number {
  const highValueIndustries = ['technology', 'finance', 'healthcare', 'saas', 'enterprise']
  if (!industry) return 50
  return highValueIndustries.includes(industry.toLowerCase()) ? 85 : 60
}

function scoreEngagement(engagement?: any): number {
  if (!engagement) return 40
  let score = 50
  if (engagement.emailOpens > 3) score += 20
  if (engagement.websiteVisits > 5) score += 15
  if (engagement.contentDownloads > 0) score += 15
  return Math.min(score, 100)
}

function scoreDecisionMakerLevel(decisionMakers?: any[]): number {
  if (!decisionMakers || decisionMakers.length === 0) return 30
  
  const hasCSuite = decisionMakers.some(dm => 
    ['ceo', 'cto', 'cfo', 'cmo', 'coo'].includes(dm.title?.toLowerCase())
  )
  const hasVP = decisionMakers.some(dm => 
    dm.title?.toLowerCase().includes('vp') || dm.title?.toLowerCase().includes('vice president')
  )
  const hasDirector = decisionMakers.some(dm => 
    dm.title?.toLowerCase().includes('director')
  )

  if (hasCSuite) return 95
  if (hasVP) return 80
  if (hasDirector) return 65
  return 50
}

function scoreTechStack(techStack?: string[]): number {
  if (!techStack || techStack.length === 0) return 50
  
  const relevantTech = ['salesforce', 'hubspot', 'marketo', 'pardot', 'eloqua']
  const matches = techStack.filter(tech => 
    relevantTech.includes(tech.toLowerCase())
  ).length
  
  return Math.min(50 + (matches * 15), 100)
}

function scoreFundingStatus(funding?: any): number {
  if (!funding) return 50
  
  const { stage, amount } = funding
  if (stage === 'series-c' || stage === 'series-d' || stage === 'ipo') return 95
  if (stage === 'series-b') return 80
  if (stage === 'series-a') return 65
  if (stage === 'seed') return 50
  return 40
}

function scoreRecentActivity(activity?: any): number {
  if (!activity) return 40
  
  const daysSinceLastActivity = activity.daysSinceLastActivity || 999
  if (daysSinceLastActivity < 7) return 90
  if (daysSinceLastActivity < 30) return 70
  if (daysSinceLastActivity < 90) return 50
  return 30
}