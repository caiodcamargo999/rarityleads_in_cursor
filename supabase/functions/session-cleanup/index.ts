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
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Find expired sessions (disconnected for more than 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data: expiredSessions, error: fetchError } = await supabaseClient
      .from('whatsapp_sessions')
      .select('id, session_name, phone_number, status, last_activity')
      .eq('status', 'disconnected')
      .lt('last_activity', twentyFourHoursAgo)

    if (fetchError) {
      throw fetchError
    }

    if (!expiredSessions || expiredSessions.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No expired sessions found',
          cleanedSessions: 0
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Mark expired sessions as expired
    const sessionIds = expiredSessions.map(session => session.id)
    
    const { error: updateError } = await supabaseClient
      .from('whatsapp_sessions')
      .update({ 
        status: 'expired',
        updated_at: new Date().toISOString()
      })
      .in('id', sessionIds)

    if (updateError) {
      throw updateError
    }

    // Log cleanup results
    console.log(`Session cleanup completed. Marked ${expiredSessions.length} sessions as expired:`, 
      expiredSessions.map(s => ({ id: s.id, name: s.session_name, phone: s.phone_number }))
    )

    return new Response(
      JSON.stringify({
        success: true,
        message: `Marked ${expiredSessions.length} sessions as expired`,
        cleanedSessions: expiredSessions.length,
        sessions: expiredSessions.map(s => ({
          id: s.id,
          name: s.session_name,
          phone: s.phone_number,
          lastActivity: s.last_activity
        }))
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error during session cleanup:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
}) 