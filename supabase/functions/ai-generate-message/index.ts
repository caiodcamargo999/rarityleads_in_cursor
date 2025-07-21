import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { leadId, messageType, context } = await req.json()

    if (!leadId) {
      return new Response(
        JSON.stringify({ error: 'Lead ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get lead information
    const { data: lead, error: leadError } = await supabaseClient
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single()

    if (leadError || !lead) {
      return new Response(
        JSON.stringify({ error: 'Lead not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Generate personalized message based on lead data
    let generatedMessage = ''

    if (messageType === 'first_contact') {
      generatedMessage = generateFirstContactMessage(lead)
    } else if (messageType === 'follow_up') {
      generatedMessage = generateFollowUpMessage(lead, context)
    } else if (messageType === 'reply') {
      generatedMessage = generateReplyMessage(lead, context)
    } else {
      generatedMessage = generateGenericMessage(lead)
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: generatedMessage,
        lead: {
          name: lead.name,
          company: lead.company,
          status: lead.status
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error generating AI message:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function generateFirstContactMessage(lead: any): string {
  const templates = [
    `Hi ${lead.name}! 👋 I noticed ${lead.company} and thought you might be interested in how we're helping similar companies scale their growth. Would you be open to a quick chat about your current challenges?`,
    
    `Hello ${lead.name}! I came across ${lead.company} and was impressed by your work. We've been helping companies like yours achieve remarkable results. Any chance you'd be free for a 15-minute call this week?`,
    
    `Hi ${lead.name}! Quick question - are you currently looking for ways to improve your business processes? I'd love to share how we've helped companies similar to ${lead.company} achieve their goals.`,
    
    `Hello ${lead.name}! I hope this message finds you well. I've been researching ${lead.company} and believe we could add significant value to your operations. Would you be interested in learning more?`
  ]

  return templates[Math.floor(Math.random() * templates.length)]
}

function generateFollowUpMessage(lead: any, context: any): string {
  const templates = [
    `Hi ${lead.name}! Just following up on my previous message about ${lead.company}. I wanted to make sure you received it and see if you had any questions.`,
    
    `Hello ${lead.name}! I hope you're having a great week. I wanted to circle back about our potential collaboration. Would you be available for a quick call?`,
    
    `Hi ${lead.name}! I understand you're busy, but I wanted to follow up on my message about ${lead.company}. Is this something you'd like to explore further?`
  ]

  return templates[Math.floor(Math.random() * templates.length)]
}

function generateReplyMessage(lead: any, context: any): string {
  const { lastMessage } = context || {}
  
  if (lastMessage?.toLowerCase().includes('interested') || lastMessage?.toLowerCase().includes('yes')) {
    return `Great to hear you're interested, ${lead.name}! When would be a good time for a 15-minute call? I'm flexible this week and would love to discuss how we can help ${lead.company}.`
  }
  
  if (lastMessage?.toLowerCase().includes('not interested') || lastMessage?.toLowerCase().includes('no')) {
    return `I completely understand, ${lead.name}. Thanks for taking the time to respond. If anything changes in the future or if you know someone who might be interested, feel free to reach out. Have a great day!`
  }
  
  if (lastMessage?.toLowerCase().includes('busy') || lastMessage?.toLowerCase().includes('later')) {
    return `No worries at all, ${lead.name}! I understand you're busy. Would it be okay if I follow up in a few weeks? Or is there a better time that works for you?`
  }
  
  return `Thanks for your response, ${lead.name}! I'd love to learn more about your needs and see how we can help ${lead.company}. Would you be open to a quick call?`
}

function generateGenericMessage(lead: any): string {
  return `Hi ${lead.name}! I hope you're doing well. I wanted to reach out about ${lead.company} and see if there's an opportunity for us to work together. Would you be interested in a brief conversation?`
} 