import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
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
          api_key: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name?: string | null;
          role?: string;
          preferences?: any;
          api_key?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string | null;
          role?: string;
          preferences?: any;
          api_key?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      whatsapp_sessions: {
        Row: {
          id: string;
          user_id: string;
          phone_number: string | null;
          session_data: any;
          status: string;
          qr_code: string | null;
          last_activity: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          phone_number?: string | null;
          session_data?: any;
          status?: string;
          qr_code?: string | null;
          last_activity?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          phone_number?: string | null;
          session_data?: any;
          status?: string;
          qr_code?: string | null;
          last_activity?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      social_sessions: {
        Row: {
          id: string;
          user_id: string;
          platform: string;
          account_id: string | null;
          session_data: any;
          status: string;
          access_token: string | null;
          refresh_token: string | null;
          expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          platform: string;
          account_id?: string | null;
          session_data?: any;
          status?: string;
          access_token?: string | null;
          refresh_token?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          platform?: string;
          account_id?: string | null;
          session_data?: any;
          status?: string;
          access_token?: string | null;
          refresh_token?: string | null;
          expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      companies: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          domain: string | null;
          industry: string | null;
          size: string | null;
          location: string | null;
          data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          domain?: string | null;
          industry?: string | null;
          size?: string | null;
          location?: string | null;
          data?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          domain?: string | null;
          industry?: string | null;
          size?: string | null;
          location?: string | null;
          data?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          user_id: string;
          company_id: string | null;
          whatsapp_session_id: string | null;
          first_name: string | null;
          last_name: string | null;
          email: string | null;
          phone: string | null;
          linkedin_url: string | null;
          title: string | null;
          department: string | null;
          seniority: string | null;
          data: any;
          ai_score: number;
          status: string;
          tags: string[] | null;
          source: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_id?: string | null;
          whatsapp_session_id?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          phone?: string | null;
          linkedin_url?: string | null;
          title?: string | null;
          department?: string | null;
          seniority?: string | null;
          data?: any;
          ai_score?: number;
          status?: string;
          tags?: string[] | null;
          source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_id?: string | null;
          whatsapp_session_id?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          email?: string | null;
          phone?: string | null;
          linkedin_url?: string | null;
          title?: string | null;
          department?: string | null;
          seniority?: string | null;
          data?: any;
          ai_score?: number;
          status?: string;
          tags?: string[] | null;
          source?: string | null;
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
          whatsapp_session_id: string | null;
          social_session_ids: string[] | null;
          data: any;
          status: string;
          target_audience: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          whatsapp_session_id?: string | null;
          social_session_ids?: string[] | null;
          data?: any;
          status?: string;
          target_audience?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          whatsapp_session_id?: string | null;
          social_session_ids?: string[] | null;
          data?: any;
          status?: string;
          target_audience?: any;
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
          channel_session_id: string | null;
          direction: string;
          content: any;
          status: string;
          external_id: string | null;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lead_id?: string | null;
          campaign_id?: string | null;
          channel: string;
          channel_session_id?: string | null;
          direction: string;
          content: any;
          status?: string;
          external_id?: string | null;
          timestamp?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lead_id?: string | null;
          campaign_id?: string | null;
          channel?: string;
          channel_session_id?: string | null;
          direction?: string;
          content?: any;
          status?: string;
          external_id?: string | null;
          timestamp?: string;
          created_at?: string;
        };
      };
      conversations: {
        Row: {
          id: string;
          user_id: string;
          lead_id: string;
          campaign_id: string | null;
          channel: string;
          status: string;
          last_message_at: string;
          message_count: number;
          data: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          lead_id: string;
          campaign_id?: string | null;
          channel: string;
          status?: string;
          last_message_at?: string;
          message_count?: number;
          data?: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          lead_id?: string;
          campaign_id?: string | null;
          channel?: string;
          status?: string;
          last_message_at?: string;
          message_count?: number;
          data?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
      analytics: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          metric_type: string;
          metric_value: number;
          channel: string | null;
          campaign_id: string | null;
          data: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          metric_type: string;
          metric_value: number;
          channel?: string | null;
          campaign_id?: string | null;
          data?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          metric_type?: string;
          metric_value?: number;
          channel?: string | null;
          campaign_id?: string | null;
          data?: any;
          created_at?: string;
        };
      };
    };
  };
}

// Helper function to get typed Supabase client
export function getSupabase() {
  return supabase;
}

// Auth helper functions
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Database helper functions
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createUserProfile(profile: Database['public']['Tables']['user_profiles']['Insert']) {
  const { data, error } = await supabase
    .from('user_profiles')
    .insert(profile)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, updates: Partial<Database['public']['Tables']['user_profiles']['Update']>) {
  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Lead management functions
export async function getLeads(userId: string, filters?: {
  status?: string;
  company_id?: string;
  tags?: string[];
}) {
  let query = supabase
    .from('leads')
    .select(`
      *,
      companies (*),
      whatsapp_sessions (*)
    `)
    .eq('user_id', userId);
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.company_id) {
    query = query.eq('company_id', filters.company_id);
  }
  if (filters?.tags) {
    query = query.overlaps('tags', filters.tags);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createLead(lead: Database['public']['Tables']['leads']['Insert']) {
  const { data, error } = await supabase
    .from('leads')
    .insert(lead)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateLead(leadId: string, updates: Partial<Database['public']['Tables']['leads']['Update']>) {
  const { data, error } = await supabase
    .from('leads')
    .update(updates)
    .eq('id', leadId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Campaign management functions
export async function getCampaigns(userId: string, status?: string) {
  let query = supabase
    .from('campaigns')
    .select(`
      *,
      whatsapp_sessions (*)
    `)
    .eq('user_id', userId);
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createCampaign(campaign: Database['public']['Tables']['campaigns']['Insert']) {
  const { data, error } = await supabase
    .from('campaigns')
    .insert(campaign)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// WhatsApp session management
export async function getWhatsAppSessions(userId: string) {
  const { data, error } = await supabase
    .from('whatsapp_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createWhatsAppSession(session: Database['public']['Tables']['whatsapp_sessions']['Insert']) {
  const { data, error } = await supabase
    .from('whatsapp_sessions')
    .insert(session)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateWhatsAppSession(sessionId: string, updates: Partial<Database['public']['Tables']['whatsapp_sessions']['Update']>) {
  const { data, error } = await supabase
    .from('whatsapp_sessions')
    .update(updates)
    .eq('id', sessionId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Analytics functions
export async function getAnalytics(userId: string, dateRange: { start: string; end: string }, metricType?: string) {
  let query = supabase
    .from('analytics')
    .select('*')
    .eq('user_id', userId)
    .gte('date', dateRange.start)
    .lte('date', dateRange.end);
  
  if (metricType) {
    query = query.eq('metric_type', metricType);
  }
  
  const { data, error } = await query.order('date', { ascending: true });
  if (error) throw error;
  return data;
}

// Real-time subscriptions
export function subscribeToLeads(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('leads')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'leads',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
}

export function subscribeToMessages(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('messages')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
}

export function subscribeToWhatsAppSessions(userId: string, callback: (payload: any) => void) {
  return supabase
    .channel('whatsapp_sessions')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'whatsapp_sessions',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe();
} 