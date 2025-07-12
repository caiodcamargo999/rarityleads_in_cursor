/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabase = () => {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseAnonKey) {
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    }
  }
  
  return supabaseClient;
};

// Database types
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          full_name: string | null;
          role: string;
          preferences: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          role?: string;
          preferences?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          role?: string;
          preferences?: any;
          created_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          user_id: string;
          company_id: string | null;
          whatsapp_session_id: string | null;
          data: any;
          status: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_id?: string | null;
          whatsapp_session_id?: string | null;
          data?: any;
          status?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_id?: string | null;
          whatsapp_session_id?: string | null;
          data?: any;
          status?: string | null;
          created_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          data: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          data?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          data?: any;
          created_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          data: any;
          whatsapp_session_id: string | null;
          status: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          data?: any;
          whatsapp_session_id?: string | null;
          status?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          data?: any;
          whatsapp_session_id?: string | null;
          status?: string | null;
          created_at?: string;
        };
      };
    };
  };
} 