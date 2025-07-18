export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics_events: {
        Row: {
          campaign_id: string | null
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          lead_id: string | null
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          lead_id?: string | null
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          lead_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          message_templates: Json | null
          name: string
          organization_id: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          target_criteria: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          message_templates?: Json | null
          name: string
          organization_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          target_criteria?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          message_templates?: Json | null
          name?: string
          organization_id?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          target_criteria?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      engagements: {
        Row: {
          campaign_id: string | null
          clicked_at: string | null
          created_at: string
          id: string
          lead_id: string
          message: string | null
          opened_at: string | null
          replied_at: string | null
          scheduled_at: string | null
          sent_at: string | null
          subject: string | null
          type: Database["public"]["Enums"]["engagement_type"]
          updated_at: string
          user_id: string
        }
        Insert: {
          campaign_id?: string | null
          clicked_at?: string | null
          created_at?: string
          id?: string
          lead_id: string
          message?: string | null
          opened_at?: string | null
          replied_at?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          subject?: string | null
          type: Database["public"]["Enums"]["engagement_type"]
          updated_at?: string
          user_id: string
        }
        Update: {
          campaign_id?: string | null
          clicked_at?: string | null
          created_at?: string
          id?: string
          lead_id?: string
          message?: string | null
          opened_at?: string | null
          replied_at?: string | null
          scheduled_at?: string | null
          sent_at?: string | null
          subject?: string | null
          type?: Database["public"]["Enums"]["engagement_type"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagements_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "engagements_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          job_title: string | null
          last_name: string
          linkedin_url: string | null
          notes: string | null
          organization_id: string | null
          phone: string | null
          score: number | null
          source: string | null
          status: Database["public"]["Enums"]["lead_status"]
          tags: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          job_title?: string | null
          last_name: string
          linkedin_url?: string | null
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          score?: number | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          tags?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          job_title?: string | null
          last_name?: string
          linkedin_url?: string | null
          notes?: string | null
          organization_id?: string | null
          phone?: string | null
          score?: number | null
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          tags?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          country: string
          created_at: string
          domain: string | null
          id: string
          industry: string | null
          name: string
          size_range: string | null
          updated_at: string
        }
        Insert: {
          country?: string
          created_at?: string
          domain?: string | null
          id?: string
          industry?: string | null
          name: string
          size_range?: string | null
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          domain?: string | null
          id?: string
          industry?: string | null
          name?: string
          size_range?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          job_title: string | null
          language: string | null
          name: string | null
          onboarding_completed: boolean | null
          organization_id: string | null
          phone: string | null
          role: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          job_title?: string | null
          language?: string | null
          name?: string | null
          onboarding_completed?: boolean | null
          organization_id?: string | null
          phone?: string | null
          role?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          job_title?: string | null
          language?: string | null
          name?: string | null
          onboarding_completed?: boolean | null
          organization_id?: string | null
          phone?: string | null
          role?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string
          current_period_start: string
          id: string
          organization_id: string | null
          plan_name: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          trial_ends_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end: string
          current_period_start?: string
          id?: string
          organization_id?: string | null
          plan_name: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          id?: string
          organization_id?: string | null
          plan_name?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      campaign_status: "draft" | "active" | "paused" | "completed"
      engagement_type: "email" | "phone" | "linkedin" | "meeting"
      lead_status: "new" | "contacted" | "qualified" | "converted" | "lost"
      subscription_status: "trial" | "active" | "cancelled" | "past_due"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      campaign_status: ["draft", "active", "paused", "completed"],
      engagement_type: ["email", "phone", "linkedin", "meeting"],
      lead_status: ["new", "contacted", "qualified", "converted", "lost"],
      subscription_status: ["trial", "active", "cancelled", "past_due"],
    },
  },
} as const
