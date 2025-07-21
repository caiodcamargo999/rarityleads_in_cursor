import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { sessionId, sessionName, phoneNumber } = await request.json();

    if (!sessionId || !sessionName || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Call the local WhatsApp microservice
    const response = await fetch(`${process.env.WHATSAPP_SERVICE_URL}/connect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WHATSAPP_SERVICE_TOKEN}`
      },
      body: JSON.stringify({
        sessionId,
        sessionName,
        phoneNumber
      })
    });

    if (!response.ok) {
      throw new Error('WhatsApp service connection failed');
    }

    const { qrCode, success } = await response.json();

    if (!success) {
      throw new Error('Failed to generate QR code');
    }

    // Update session status in database
    await supabase
      .from('whatsapp_sessions')
      .update({ 
        status: 'connecting',
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
    console.error('Error connecting WhatsApp session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 