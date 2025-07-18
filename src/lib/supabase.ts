import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yejheyrdsucgzpzwxuxs.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllamhleXJkc3VjZ3pwend4dXhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDg2NzQsImV4cCI6MjA2NDM4NDY3NH0.5s0WmC8H4QonZXrdvfiWeJy_aPitvpxakyX-hWAl0UA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          contact_name: string;
          email: string | null;
          phone: string | null;
          linkedin_url: string | null;
          industry: string | null;
          company_size: string | null;
          location: string | null;
          status: string;
          ai_score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          contact_name: string;
          email?: string | null;
          phone?: string | null;
          linkedin_url?: string | null;
          industry?: string | null;
          company_size?: string | null;
          location?: string | null;
          status?: string;
          ai_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          contact_name?: string;
          email?: string | null;
          phone?: string | null;
          linkedin_url?: string | null;
          industry?: string | null;
          company_size?: string | null;
          location?: string | null;
          status?: string;
          ai_score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          channel: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          channel: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          channel?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          user_id: string;
          lead_id: string | null;
          campaign_id: string | null;
          channel: string;
          direction: string;
          content: any;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lead_id?: string | null;
          campaign_id?: string | null;
          channel: string;
          direction: string;
          content: any;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lead_id?: string | null;
          campaign_id?: string | null;
          channel?: string;
          direction?: string;
          content?: any;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
}; 