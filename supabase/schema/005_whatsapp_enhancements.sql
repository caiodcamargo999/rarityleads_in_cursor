-- Enhanced WhatsApp Sessions Table
ALTER TABLE whatsapp_sessions 
ADD COLUMN IF NOT EXISTS session_name TEXT NOT NULL DEFAULT 'Default Session',
ADD COLUMN IF NOT EXISTS session_data JSONB,
ADD COLUMN IF NOT EXISTS qr_code TEXT,
ADD COLUMN IF NOT EXISTS last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update status column to include new values
ALTER TABLE whatsapp_sessions 
DROP CONSTRAINT IF EXISTS whatsapp_sessions_status_check;

ALTER TABLE whatsapp_sessions 
ADD CONSTRAINT whatsapp_sessions_status_check 
CHECK (status IN ('active', 'inactive', 'connecting', 'expired', 'error'));

-- Enhanced Messages Table
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES whatsapp_sessions(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  message_id TEXT, -- WhatsApp message ID
  phone_number TEXT NOT NULL,
  direction TEXT CHECK (direction IN ('in', 'out')),
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'audio', 'video', 'document')),
  content JSONB NOT NULL, -- Message content and metadata
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Message Templates Table
CREATE TABLE IF NOT EXISTS whatsapp_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  variables JSONB DEFAULT '[]', -- Template variables like {{name}}
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_templates ENABLE ROW LEVEL SECURITY;

-- Message policies
CREATE POLICY "Users can access messages from their sessions"
  ON whatsapp_messages FOR ALL
  TO authenticated
  USING (
    session_id IN (
      SELECT id FROM whatsapp_sessions 
      WHERE user_id = auth.uid()
    )
  );

-- Template policies
CREATE POLICY "Users can manage their own templates"
  ON whatsapp_templates FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_session_id ON whatsapp_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_phone_number ON whatsapp_messages(phone_number);
CREATE INDEX IF NOT EXISTS idx_whatsapp_messages_created_at ON whatsapp_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_user_id ON whatsapp_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_sessions_status ON whatsapp_sessions(status);