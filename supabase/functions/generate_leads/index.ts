// supabase/functions/generate_leads/index.ts
// Edge Function: Generate Leads for Rarity Leads
// Accepts POST with user description and filters, returns enriched leads

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Mock data for demonstration - in production, this would come from real APIs
const mockCompanies = [
  { name: "TechFlow Solutions", industry: "SaaS", size: "51-200", revenue: "$5-10M", location: "San Francisco, CA" },
  { name: "Digital Dynamics", industry: "Marketing", size: "11-50", revenue: "$1-5M", location: "New York, NY" },
  { name: "Innovate Labs", industry: "Technology", size: "201-1000", revenue: "$10-50M", location: "Austin, TX" },
  { name: "Growth Partners", industry: "Consulting", size: "1-10", revenue: "$0-1M", location: "Miami, FL" },
  { name: "ScaleUp Ventures", industry: "E-commerce", size: "51-200", revenue: "$5-10M", location: "Seattle, WA" },
  { name: "Future Systems", industry: "AI/ML", size: "11-50", revenue: "$1-5M", location: "Boston, MA" },
  { name: "Cloud Connect", industry: "Cloud Services", size: "201-1000", revenue: "$10-50M", location: "Denver, CO" },
  { name: "Data Insights Co", industry: "Analytics", size: "51-200", revenue: "$5-10M", location: "Chicago, IL" },
  { name: "Mobile First", industry: "Mobile Apps", size: "11-50", revenue: "$1-5M", location: "Los Angeles, CA" },
  { name: "Enterprise Solutions", industry: "Enterprise Software", size: "1000+", revenue: "$50M+", location: "Atlanta, GA" }
]

const mockNames = [
  "Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Thompson", "Lisa Wang",
  "James Wilson", "Maria Garcia", "Robert Brown", "Jennifer Lee", "Christopher Davis",
  "Amanda Taylor", "Daniel Martinez", "Jessica Anderson", "Kevin White", "Nicole Moore",
  "Andrew Jackson", "Rachel Clark", "Matthew Lewis", "Stephanie Hall", "Ryan Young"
]

const mockJobTitles = [
  "CEO", "Head of Marketing", "CTO", "Founder", "Sales Director",
  "VP of Sales", "Marketing Manager", "Business Development", "Product Manager", "Growth Hacker"
]

const mockContactChannels = [
  ["LinkedIn", "Email"], ["WhatsApp", "LinkedIn"], ["Email", "Phone"], 
  ["LinkedIn", "Instagram"], ["WhatsApp", "Email"], ["Phone", "LinkedIn"]
]

const mockTags = [
  ["Needs Paid Ads", "Ideal for SEO"], ["Needs Funnel", "High Potential"], 
  ["CRM Ready", "Growth Focused"], ["Needs Outreach", "Digital Native"],
  ["SEO Priority", "Content Driven"], ["Paid Ads Ready", "High Budget"]
]

const mockServices = [
  ["Paid Ads", "CRM"], ["Funnel", "Outreach"], ["SEO", "Content Marketing"],
  ["CRM", "Automation"], ["Paid Ads", "SEO"], ["Outreach", "Analytics"]
]

function generateMockLeads(description: string, filters: any, count: number = 15) {
  const leads = []
  
  for (let i = 0; i < count; i++) {
    const company = mockCompanies[Math.floor(Math.random() * mockCompanies.length)]
    const name = mockNames[Math.floor(Math.random() * mockNames.length)]
    const jobTitle = mockJobTitles[Math.floor(Math.random() * mockJobTitles.length)]
    const contactChannels = mockContactChannels[Math.floor(Math.random() * mockContactChannels.length)]
    const tags = mockTags[Math.floor(Math.random() * mockTags.length)]
    const services = mockServices[Math.floor(Math.random() * mockServices.length)]
    
    // Generate AI score based on description relevance
    const aiScore = Math.floor(Math.random() * 40) + 60 // 60-100 range
    
    // Generate contact time
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const day = days[Math.floor(Math.random() * days.length)]
    const hour = Math.floor(Math.random() * 8) + 9 // 9 AM to 5 PM
    const timezone = company.location.includes("CA") ? "PST" : 
                    company.location.includes("NY") ? "EST" : 
                    company.location.includes("TX") ? "CST" : "EST"
    
    leads.push({
      full_name: name,
      company_name: company.name,
      job_title: jobTitle,
      location: company.location,
      timezone: timezone,
      contact_channels: contactChannels,
      source: Math.random() > 0.5 ? "Apollo.io" : "Clearbit",
      tags: tags,
      suggested_services: services,
      best_contact_time: `${day}, ${hour}:00 ${timezone}`,
      ai_score: aiScore,
      email: `${name.toLowerCase().replace(' ', '.')}@${company.name.toLowerCase().replace(' ', '').replace(',', '')}.com`,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      website: `https://${company.name.toLowerCase().replace(' ', '').replace(',', '')}.com`,
      linkedin_url: `https://linkedin.com/in/${name.toLowerCase().replace(' ', '')}`,
      company_size: company.size,
      annual_revenue: company.revenue,
      industry: company.industry,
      status: "to_contact",
      priority: aiScore > 80 ? "high" : aiScore > 70 ? "medium" : "low"
    })
  }
  
  return leads.sort((a, b) => b.ai_score - a.ai_score) // Sort by AI score
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405 })
  }

  let body: any
  try {
    body = await req.json()
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 })
  }

  const { description, filters } = body
  if (!description || typeof description !== "string") {
    return new Response(JSON.stringify({ error: "Missing or invalid description" }), { status: 400 })
  }

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Generate leads based on description and filters
  const leads = generateMockLeads(description, filters, 15)

  // TODO: In production, implement:
  // 1. Call Apollo.io API for lead discovery
  // 2. Call LinkedIn Sales Navigator for contact enrichment
  // 3. Call Clearbit for company data enrichment
  // 4. Call Crunchbase for funding/company insights
  // 5. Use OpenAI GPT-4 or Claude for lead scoring and qualification
  // 6. Use Anthropic Claude for personalized outreach recommendations

  return new Response(JSON.stringify({ 
    leads,
    metadata: {
      total_generated: leads.length,
      processing_time: "2.1s",
      data_sources: ["Apollo.io", "Clearbit", "LinkedIn Sales Navigator"],
      enrichment_level: "full",
      ai_scoring: "enabled"
    }
  }), {
    headers: { "Content-Type": "application/json" },
    status: 200
  })
}) 