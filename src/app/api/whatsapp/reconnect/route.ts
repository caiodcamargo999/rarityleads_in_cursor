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

    // Get session details from database
    const { data: session, error: sessionError } = await supabase
      .from('whatsapp_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Call the local WhatsApp microservice to reconnect
    const response = await fetch(`${process.env.WHATSAPP_SERVICE_URL}/reconnect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WHATSAPP_SERVICE_TOKEN}`
      },
      body: JSON.stringify({
        sessionId,
        sessionName: session.session_name,
        phoneNumber: session.phone_number
      })
    });

    if (!response.ok) {
      throw new Error('WhatsApp service reconnection failed');
    }

    const { qrCode, success } = await response.json();

    if (!success) {
      throw new Error('Failed to generate QR code for reconnection');
    }

    // Update session status in database
    await supabase
      .from('whatsapp_sessions')
      .update({ 
        status: 'reconnecting',
        qr_code: qrCode,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    return NextResponse.json({
      success: true,
      qrCode,
      sessionId
    });

  } catch (error) {
    console.error('Error reconnecting WhatsApp session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 