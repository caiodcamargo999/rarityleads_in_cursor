import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LeadData {
  company_name: string
  contact_name: string
  email?: string
  phone?: string
  linkedin_url?: string
  website?: string
  industry?: string
  company_size?: string
  location?: string
  job_title?: string
  department?: string
  seniority_level?: string
  enrichment_data?: any
}

interface ScoringFactors {
  companySize: number
  seniority: number
  industry: number
  location: number
  contactQuality: number
  intentSignals: number
  engagementPotential: number
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { leadData, userId } = await req.json()

    if (!leadData || !userId) {
      throw new Error('Missing required parameters: leadData and userId')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Calculate AI score
    const score = await calculateAIScore(leadData)
    
    // Store enriched lead data
    const enrichedData = await enrichLeadData(leadData)
    
    // Create or update lead in database
    const { data: lead, error } = await supabase
      .from('leads')
      .upsert({
        user_id: userId,
        company_name: leadData.company_name,
        contact_name: leadData.contact_name,
        email: leadData.email,
        phone: leadData.phone,
        linkedin_url: leadData.linkedin_url,
        website: leadData.website,
        industry: enrichedData.industry || leadData.industry,
        company_size: enrichedData.company_size || leadData.company_size,
        location: enrichedData.location || leadData.location,
        job_title: enrichedData.job_title || leadData.job_title,
        department: enrichedData.department || leadData.department,
        seniority_level: enrichedData.seniority_level || leadData.seniority_level,
        ai_score: score,
        enrichment_data: enrichedData,
        status: score >= 70 ? 'qualified' : score >= 40 ? 'contacted' : 'new'
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({
        success: true,
        lead,
        score,
        factors: getScoringFactors(leadData),
        recommendations: getRecommendations(score, enrichedData)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function calculateAIScore(leadData: LeadData): Promise<number> {
  const factors = getScoringFactors(leadData)
  
  // Weighted scoring algorithm
  const weights = {
    companySize: 0.15,
    seniority: 0.25,
    industry: 0.15,
    location: 0.10,
    contactQuality: 0.20,
    intentSignals: 0.10,
    engagementPotential: 0.05
  }

  const totalScore = Object.entries(factors).reduce((score, [factor, value]) => {
    return score + (value * weights[factor as keyof typeof weights])
  }, 0)

  return Math.round(totalScore)
}

function getScoringFactors(leadData: LeadData): ScoringFactors {
  // Company Size Scoring (0-100)
  const companySizeScore = getCompanySizeScore(leadData.company_size)
  
  // Seniority Level Scoring (0-100)
  const seniorityScore = getSeniorityScore(leadData.seniority_level, leadData.job_title)
  
  // Industry Scoring (0-100)
  const industryScore = getIndustryScore(leadData.industry)
  
  // Location Scoring (0-100)
  const locationScore = getLocationScore(leadData.location)
  
  // Contact Quality Scoring (0-100)
  const contactQualityScore = getContactQualityScore(leadData)
  
  // Intent Signals Scoring (0-100)
  const intentSignalsScore = getIntentSignalsScore(leadData)
  
  // Engagement Potential Scoring (0-100)
  const engagementPotentialScore = getEngagementPotentialScore(leadData)

  return {
    companySize: companySizeScore,
    seniority: seniorityScore,
    industry: industryScore,
    location: locationScore,
    contactQuality: contactQualityScore,
    intentSignals: intentSignalsScore,
    engagementPotential: engagementPotentialScore
  }
}

function getCompanySizeScore(companySize?: string): number {
  if (!companySize) return 30

  const sizeMap: { [key: string]: number } = {
    '1-10': 20,
    '11-50': 40,
    '51-200': 70,
    '201-1000': 85,
    '1001-10000': 90,
    '10000+': 95
  }

  return sizeMap[companySize] || 30
}

function getSeniorityScore(seniorityLevel?: string, jobTitle?: string): number {
  if (seniorityLevel) {
    const levelMap: { [key: string]: number } = {
      'C-Level': 95,
      'VP': 85,
      'Director': 75,
      'Manager': 60,
      'Senior': 45,
      'Junior': 25
    }
    return levelMap[seniorityLevel] || 30
  }

  // Fallback to job title analysis
  if (jobTitle) {
    const title = jobTitle.toLowerCase()
    if (title.includes('ceo') || title.includes('cto') || title.includes('cfo') || title.includes('founder')) return 95
    if (title.includes('vp') || title.includes('vice president')) return 85
    if (title.includes('director')) return 75
    if (title.includes('manager') || title.includes('head of')) return 60
    if (title.includes('senior') || title.includes('lead')) return 45
    if (title.includes('junior') || title.includes('associate')) return 25
  }

  return 30
}

function getIndustryScore(industry?: string): number {
  if (!industry) return 50

  const highValueIndustries = [
    'technology', 'saas', 'fintech', 'healthcare', 'ecommerce',
    'real estate', 'consulting', 'marketing', 'advertising'
  ]

  const mediumValueIndustries = [
    'manufacturing', 'retail', 'education', 'non-profit',
    'government', 'legal', 'accounting'
  ]

  const industryLower = industry.toLowerCase()
  
  if (highValueIndustries.some(hv => industryLower.includes(hv))) return 85
  if (mediumValueIndustries.some(mv => industryLower.includes(mv))) return 65
  
  return 50
}

function getLocationScore(location?: string): number {
  if (!location) return 50

  const highValueLocations = [
    'united states', 'canada', 'united kingdom', 'germany',
    'australia', 'singapore', 'netherlands', 'sweden'
  ]

  const mediumValueLocations = [
    'france', 'spain', 'italy', 'japan', 'south korea',
    'brazil', 'mexico', 'india'
  ]

  const locationLower = location.toLowerCase()
  
  if (highValueLocations.some(hv => locationLower.includes(hv))) return 80
  if (mediumValueLocations.some(mv => locationLower.includes(mv))) return 60
  
  return 40
}

function getContactQualityScore(leadData: LeadData): number {
  let score = 0
  
  // Email quality
  if (leadData.email) {
    score += 25
    if (leadData.email.includes('@') && !leadData.email.includes('noreply')) score += 10
  }
  
  // Phone quality
  if (leadData.phone) {
    score += 20
    if (leadData.phone.length >= 10) score += 10
  }
  
  // LinkedIn presence
  if (leadData.linkedin_url) score += 20
  
  // Website presence
  if (leadData.website) score += 15
  
  return Math.min(score, 100)
}

function getIntentSignalsScore(leadData: LeadData): number {
  let score = 50 // Base score
  
  // This would typically integrate with external data sources
  // For now, we'll use basic heuristics
  
  if (leadData.enrichment_data?.recent_activity) score += 20
  if (leadData.enrichment_data?.funding_round) score += 15
  if (leadData.enrichment_data?.hiring) score += 10
  if (leadData.enrichment_data?.technology_stack) score += 5
  
  return Math.min(score, 100)
}

function getEngagementPotentialScore(leadData: LeadData): number {
  let score = 50 // Base score
  
  // Factors that indicate engagement potential
  if (leadData.linkedin_url) score += 15
  if (leadData.website) score += 10
  if (leadData.job_title && leadData.job_title.length > 0) score += 15
  if (leadData.department) score += 10
  
  return Math.min(score, 100)
}

async function enrichLeadData(leadData: LeadData): Promise<any> {
  // This would integrate with external APIs like Clearbit, Apollo, etc.
  // For now, we'll return basic enrichment
  
  const enrichment = {
    industry: leadData.industry,
    company_size: leadData.company_size,
    location: leadData.location,
    job_title: leadData.job_title,
    department: leadData.department,
    seniority_level: leadData.seniority_level,
    enriched_at: new Date().toISOString(),
    data_sources: ['manual_input']
  }

  // Add mock enrichment data for demonstration
  if (leadData.company_name) {
    enrichment.industry = enrichment.industry || 'Technology'
    enrichment.company_size = enrichment.company_size || '51-200'
  }

  return enrichment
}

function getRecommendations(score: number, enrichedData: any): string[] {
  const recommendations = []

  if (score < 40) {
    recommendations.push('Consider nurturing this lead with educational content')
    recommendations.push('Focus on building awareness before direct outreach')
  } else if (score < 70) {
    recommendations.push('Use personalized outreach with specific value propositions')
    recommendations.push('Consider multi-channel approach (email + LinkedIn)')
  } else {
    recommendations.push('High-value prospect - prioritize for immediate outreach')
    recommendations.push('Use executive-level messaging and quick follow-up')
  }

  if (!enrichedData.linkedin_url) {
    recommendations.push('Add LinkedIn profile for better engagement')
  }

  if (!enrichedData.phone) {
    recommendations.push('Consider phone outreach for high-scoring leads')
  }

  return recommendations
} 