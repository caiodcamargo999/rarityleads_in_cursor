import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { sessionId, leadId, message } = await request.json();

    if (!sessionId || !leadId || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get lead phone number
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('phone')
      .eq('id', leadId)
      .single();

    if (leadError || !lead?.phone) {
      return NextResponse.json(
        { error: 'Lead not found or missing phone number' },
        { status: 404 }
      );
    }

    // Call the local WhatsApp microservice to send message
    const response = await fetch(`${process.env.WHATSAPP_SERVICE_URL}/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.WHATSAPP_SERVICE_TOKEN}`
      },
      body: JSON.stringify({
        sessionId,
        phoneNumber: lead.phone,
        message
      })
    });

    if (!response.ok) {
      throw new Error('Failed to send message via WhatsApp service');
    }

    const { success, messageId } = await response.json();

    if (!success) {
      throw new Error('WhatsApp service failed to send message');
    }

    // Update message status in database
    await supabase
      .from('messages')
      .update({ 
        delivered_status: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', messageId);

    return NextResponse.json({
      success: true,
      messageId,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 