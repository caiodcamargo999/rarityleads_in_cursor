import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Call the local WhatsApp microservice to disconnect
    const response = await fetch(`${process.env.WHATSAPP_SERVICE_URL}/disconnect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WHATSAPP_SERVICE_TOKEN}`
      },
      body: JSON.stringify({ sessionId })
    });

    if (!response.ok) {
      console.warn('WhatsApp service disconnect failed, but continuing with database update');
    }

    // Update session status in database
    await supabase
      .from('whatsapp_sessions')
      .update({ 
        status: 'disconnected',
        qr_code: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    return NextResponse.json({
      success: true,
      message: 'Session disconnected successfully'
    });

  } catch (error) {
    console.error('Error disconnecting WhatsApp session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 