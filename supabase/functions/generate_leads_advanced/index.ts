import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface LeadGenerationRequest {
  description: string
  filters: {
    annualRevenue?: { min?: number; max?: number }
    companySize?: { min?: number; max?: number }
    industry?: string
    location?: string
    jobTitle?: string
    preferredChannel?: string
    businessNeeds?: string[]
  }
  aiModel?: string
  limit?: number
}

interface EnrichedLead {
  full_name: string
  company_name: string
  job_title: string
  email?: string
  phone?: string
  linkedin_url?: string
  website?: string
  location?: string
  timezone?: string
  company_size?: string
  industry?: string
  annual_revenue?: string
  contact_channels: string[]
  source: string
  tags: string[]
  suggested_services: string[]
  best_contact_time?: string
  ai_score?: number
  enrichment_data?: any
}

// Mock API functions (replace with real API calls)
async function fetchFromApollo(filters: any): Promise<EnrichedLead[]> {
  // Simulate Apollo.io API call
  return [
    {
      full_name: "Sarah Johnson",
      company_name: "TechCorp Solutions",
      job_title: "Chief Marketing Officer",
      email: "sarah.johnson@techcorp.com",
      phone: "+1-555-0123",
      linkedin_url: "https://linkedin.com/in/sarahjohnson",
      website: "https://techcorp.com",
      location: "San Francisco, CA",
      timezone: "PST",
      company_size: "100-500",
      industry: "SaaS",
      annual_revenue: "$10M-50M",
      contact_channels: ["LinkedIn", "Email", "Phone"],
      source: "Apollo",
      tags: ["Decision Maker", "High Value", "SaaS"],
      suggested_services: ["CRM Integration", "Marketing Automation"],
      best_contact_time: "Tuesday 2PM PST",
      ai_score: 92
    }
  ]
}

async function fetchFromClearbit(filters: any): Promise<EnrichedLead[]> {
  // Simulate Clearbit API call
  return [
    {
      full_name: "Michael Chen",
      company_name: "DataDrive Analytics",
      job_title: "CEO & Founder",
      email: "m.chen@datadrive.io",
      phone: "+1-555-0456",
      linkedin_url: "https://linkedin.com/in/michaelchen",
      website: "https://datadrive.io",
      location: "New York, NY",
      timezone: "EST",
      company_size: "50-100",
      industry: "Analytics",
      annual_revenue: "$5M-10M",
      contact_channels: ["Email", "LinkedIn"],
      source: "Clearbit",
      tags: ["Founder", "Tech Savvy", "Growth Stage"],
      suggested_services: ["Data Pipeline", "Analytics Dashboard"],
      best_contact_time: "Wednesday 10AM EST",
      ai_score: 88
    }
  ]
}

async function fetchFromLinkedInSalesNav(filters: any): Promise<EnrichedLead[]> {
  // Simulate LinkedIn Sales Navigator API call
  return [
    {
      full_name: "Emily Rodriguez",
      company_name: "CloudScale Inc",
      job_title: "VP of Sales",
      email: "emily.r@cloudscale.com",
      linkedin_url: "https://linkedin.com/in/emilyrodriguez",
      website: "https://cloudscale.com",
      location: "Austin, TX",
      timezone: "CST",
      company_size: "200-500",
      industry: "Cloud Infrastructure",
      annual_revenue: "$20M-50M",
      contact_channels: ["LinkedIn", "WhatsApp"],
      source: "LinkedIn Sales Navigator",
      tags: ["Sales Leader", "Enterprise", "Cloud"],
      suggested_services: ["Sales Automation", "Lead Scoring"],
      best_contact_time: "Thursday 3PM CST",
      ai_score: 85
    }
  ]
}

async function fetchFromCrunchbase(filters: any): Promise<EnrichedLead[]> {
  // Simulate Crunchbase API call
  return [
    {
      full_name: "David Park",
      company_name: "AI Innovations Lab",
      job_title: "CTO",
      email: "david@aiinnovations.com",
      website: "https://aiinnovations.com",
      location: "Seattle, WA",
      timezone: "PST",
      company_size: "10-50",
      industry: "Artificial Intelligence",
      annual_revenue: "$1M-5M",
      contact_channels: ["Email", "Twitter"],
      source: "Crunchbase",
      tags: ["Startup", "AI/ML", "Technical"],
      suggested_services: ["AI Integration", "ML Pipeline"],
      best_contact_time: "Monday 11AM PST",
      ai_score: 78
    }
  ]
}

async function scoreAndRankLeads(
  leads: EnrichedLead[], 
  description: string, 
  filters: any
): Promise<EnrichedLead[]> {
  // Simulate AI scoring based on ICP match
  // In production, this would call OpenAI/Claude/Gemini API
  
  return leads.map(lead => {
    let score = lead.ai_score || 70
    
    // Adjust score based on filters match
    if (filters.industry && lead.industry?.toLowerCase().includes(filters.industry.toLowerCase())) {
      score += 10
    }
    if (filters.location && lead.location?.toLowerCase().includes(filters.location.toLowerCase())) {
      score += 5
    }
    if (filters.jobTitle && lead.job_title?.toLowerCase().includes(filters.jobTitle.toLowerCase())) {
      score += 10
    }
    if (filters.preferredChannel && lead.contact_channels.some(ch => 
      ch.toLowerCase() === filters.preferredChannel.toLowerCase()
    )) {
      score += 5
    }
    
    // Business needs matching
    if (filters.businessNeeds?.length > 0) {
      const matchingNeeds = filters.businessNeeds.filter(need => 
        lead.suggested_services.some(service => 
          service.toLowerCase().includes(need.toLowerCase())
        )
      )
      score += matchingNeeds.length * 5
    }
    
    // Revenue and company size scoring
    if (filters.annualRevenue?.min) {
      const leadRevenue = parseInt(lead.annual_revenue?.match(/\d+/)?.[0] || '0')
      if (leadRevenue >= filters.annualRevenue.min) {
        score += 10
      }
    }
    
    if (filters.companySize?.min) {
      const leadSize = parseInt(lead.company_size?.split('-')[0] || '0')
      if (leadSize >= filters.companySize.min) {
        score += 5
      }
    }
    
    // Cap score at 100
    score = Math.min(100, score)
    
    return { ...lead, ai_score: score }
  }).sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0))
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

    const { description, filters, aiModel = 'gpt-4-turbo', limit = 30 }: LeadGenerationRequest = await req.json()

    // Fetch leads from multiple sources in parallel
    const [apolloLeads, clearbitLeads, linkedinLeads, crunchbaseLeads] = await Promise.all([
      fetchFromApollo(filters),
      fetchFromClearbit(filters),
      fetchFromLinkedInSalesNav(filters),
      fetchFromCrunchbase(filters)
    ])

    // Combine all leads
    let allLeads = [
      ...apolloLeads,
      ...clearbitLeads,
      ...linkedinLeads,
      ...crunchbaseLeads
    ]

    // Remove duplicates based on email
    const uniqueLeads = new Map<string, EnrichedLead>()
    allLeads.forEach(lead => {
      const key = lead.email || `${lead.full_name}-${lead.company_name}`
      if (!uniqueLeads.has(key)) {
        uniqueLeads.set(key, lead)
      } else {
        // Merge data from duplicate sources
        const existing = uniqueLeads.get(key)!
        uniqueLeads.set(key, {
          ...existing,
          contact_channels: [...new Set([...existing.contact_channels, ...lead.contact_channels])],
          tags: [...new Set([...existing.tags, ...lead.tags])],
          suggested_services: [...new Set([...existing.suggested_services, ...lead.suggested_services])],
          source: `${existing.source}, ${lead.source}`
        })
      }
    })

    // Convert back to array
    allLeads = Array.from(uniqueLeads.values())

    // Score and rank leads using AI
    const scoredLeads = await scoreAndRankLeads(allLeads, description, filters)

    // Limit results
    const finalLeads = scoredLeads.slice(0, limit)

    // Add more mock data if needed to reach limit
    while (finalLeads.length < Math.min(limit, 10)) {
      finalLeads.push({
        full_name: `Lead ${finalLeads.length + 1}`,
        company_name: `Company ${finalLeads.length + 1}`,
        job_title: ["CEO", "CTO", "CMO", "VP Sales"][Math.floor(Math.random() * 4)],
        email: `lead${finalLeads.length + 1}@example.com`,
        phone: `+1-555-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
        location: ["San Francisco, CA", "New York, NY", "Austin, TX", "Seattle, WA"][Math.floor(Math.random() * 4)],
        timezone: ["PST", "EST", "CST", "PST"][Math.floor(Math.random() * 4)],
        company_size: ["10-50", "50-100", "100-500", "500+"][Math.floor(Math.random() * 4)],
        industry: ["SaaS", "E-commerce", "Fintech", "Healthcare"][Math.floor(Math.random() * 4)],
        contact_channels: [["Email", "LinkedIn"], ["WhatsApp", "Email"], ["LinkedIn"], ["Phone", "Email"]][Math.floor(Math.random() * 4)],
        source: "AI Generated",
        tags: [["High Value"], ["Growth Stage"], ["Enterprise"], ["Startup"]][Math.floor(Math.random() * 4)],
        suggested_services: [["CRM", "Automation"], ["Marketing", "Sales"], ["Analytics"], ["Integration"]][Math.floor(Math.random() * 4)],
        best_contact_time: `${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][Math.floor(Math.random() * 5)]} ${Math.floor(Math.random() * 12) + 1}PM`,
        ai_score: Math.floor(Math.random() * 30) + 70
      })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        leads: finalLeads,
        total_found: allLeads.length,
        sources_used: ["Apollo", "Clearbit", "LinkedIn Sales Navigator", "Crunchbase"],
        ai_model: aiModel
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error in generate_leads_advanced:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
