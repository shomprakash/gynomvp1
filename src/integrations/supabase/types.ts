export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      expert_verifications: {
        Row: {
          created_at: string
          id: string
          institution: string | null
          medical_license_number: string
          specialization: string
          status: string | null
          user_id: string
          verification_documents: string[] | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          institution?: string | null
          medical_license_number: string
          specialization: string
          status?: string | null
          user_id: string
          verification_documents?: string[] | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          institution?: string | null
          medical_license_number?: string
          specialization?: string
          status?: string | null
          user_id?: string
          verification_documents?: string[] | null
          verified_at?: string | null
        }
        Relationships: []
      }
      period_cycles: {
        Row: {
          created_at: string
          cycle_end_date: string | null
          cycle_length: number | null
          cycle_start_date: string
          id: string
          ovulation_date: string | null
          period_end_date: string | null
          period_length: number | null
          period_start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cycle_end_date?: string | null
          cycle_length?: number | null
          cycle_start_date: string
          id?: string
          ovulation_date?: string | null
          period_end_date?: string | null
          period_length?: number | null
          period_start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cycle_end_date?: string | null
          cycle_length?: number | null
          cycle_start_date?: string
          id?: string
          ovulation_date?: string | null
          period_end_date?: string | null
          period_length?: number | null
          period_start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
          user_role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          user_role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          user_role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: []
      }
      symptoms: {
        Row: {
          created_at: string
          date: string
          id: string
          notes: string | null
          severity: number
          symptom_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          notes?: string | null
          severity: number
          symptom_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          severity?: number
          symptom_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tracker_data: {
        Row: {
          created_at: string
          data: Json
          id: string
          insights: Json
          tracker_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json
          id?: string
          insights?: Json
          tracker_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json
          id?: string
          insights?: Json
          tracker_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wiki_articles: {
        Row: {
          author_id: string
          author_type: Database["public"]["Enums"]["user_role"]
          category: string
          content: string
          created_at: string
          id: string
          is_verified: boolean | null
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string
          verification_sources: string[] | null
          view_count: number | null
        }
        Insert: {
          author_id: string
          author_type?: Database["public"]["Enums"]["user_role"]
          category: string
          content: string
          created_at?: string
          id?: string
          is_verified?: boolean | null
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          verification_sources?: string[] | null
          view_count?: number | null
        }
        Update: {
          author_id?: string
          author_type?: Database["public"]["Enums"]["user_role"]
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_verified?: boolean | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          verification_sources?: string[] | null
          view_count?: number | null
        }
        Relationships: []
      }
      wiki_edits: {
        Row: {
          article_id: string
          attachments: string[] | null
          content_diff: string | null
          created_at: string
          edit_summary: string | null
          editor_id: string
          editor_type: Database["public"]["Enums"]["user_role"]
          id: string
          status: string | null
          supporting_links: string[] | null
        }
        Insert: {
          article_id: string
          attachments?: string[] | null
          content_diff?: string | null
          created_at?: string
          edit_summary?: string | null
          editor_id: string
          editor_type?: Database["public"]["Enums"]["user_role"]
          id?: string
          status?: string | null
          supporting_links?: string[] | null
        }
        Update: {
          article_id?: string
          attachments?: string[] | null
          content_diff?: string | null
          created_at?: string
          edit_summary?: string | null
          editor_id?: string
          editor_type?: Database["public"]["Enums"]["user_role"]
          id?: string
          status?: string | null
          supporting_links?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "wiki_edits_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "wiki_articles"
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
      user_role: "standard" | "gyno_expert"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["standard", "gyno_expert"],
    },
  },
} as const
