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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      attachments: {
        Row: {
          created_at: string | null
          entity_id: string
          entity_type: string
          file_name: string
          file_size: number | null
          id: string
          mime_type: string | null
          storage_path: string
          uploaded_by: string | null
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          entity_id: string
          entity_type: string
          file_name: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          storage_path: string
          uploaded_by?: string | null
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          file_name?: string
          file_size?: number | null
          id?: string
          mime_type?: string | null
          storage_path?: string
          uploaded_by?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "attachments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          consent_given: boolean | null
          contact_preference: string | null
          created_at: string | null
          email: string | null
          first_name: string
          id: string
          last_name: string
          mobile: string | null
          phone: string | null
          property_id: string | null
          role_in_household: string | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          consent_given?: boolean | null
          contact_preference?: string | null
          created_at?: string | null
          email?: string | null
          first_name: string
          id?: string
          last_name: string
          mobile?: string | null
          phone?: string | null
          property_id?: string | null
          role_in_household?: string | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          consent_given?: boolean | null
          contact_preference?: string | null
          created_at?: string | null
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          mobile?: string | null
          phone?: string | null
          property_id?: string | null
          role_in_household?: string | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contacts_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          ai_score: number | null
          assigned_rep: string | null
          contact_id: string | null
          created_at: string | null
          disqual_reason: string | null
          id: string
          interest_level: Database["public"]["Enums"]["interest_level"] | null
          next_followup_date: string | null
          notes: string | null
          property_id: string
          source: string | null
          status: Database["public"]["Enums"]["lead_status"] | null
          tags: string[] | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          ai_score?: number | null
          assigned_rep?: string | null
          contact_id?: string | null
          created_at?: string | null
          disqual_reason?: string | null
          id?: string
          interest_level?: Database["public"]["Enums"]["interest_level"] | null
          next_followup_date?: string | null
          notes?: string | null
          property_id: string
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          tags?: string[] | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          ai_score?: number | null
          assigned_rep?: string | null
          contact_id?: string | null
          created_at?: string | null
          disqual_reason?: string | null
          id?: string
          interest_level?: Database["public"]["Enums"]["interest_level"] | null
          next_followup_date?: string | null
          notes?: string | null
          property_id?: string
          source?: string | null
          status?: Database["public"]["Enums"]["lead_status"] | null
          tags?: string[] | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          assigned_owner: string | null
          competitor: string | null
          created_at: string | null
          estimated_value: number | null
          expected_close_date: string | null
          id: string
          lead_id: string | null
          notes: string | null
          opportunity_type: Database["public"]["Enums"]["project_type"] | null
          probability_percent: number | null
          property_id: string
          stage: Database["public"]["Enums"]["opportunity_stage"] | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          assigned_owner?: string | null
          competitor?: string | null
          created_at?: string | null
          estimated_value?: number | null
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          opportunity_type?: Database["public"]["Enums"]["project_type"] | null
          probability_percent?: number | null
          property_id: string
          stage?: Database["public"]["Enums"]["opportunity_stage"] | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          assigned_owner?: string | null
          competitor?: string | null
          created_at?: string | null
          estimated_value?: number | null
          expected_close_date?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          opportunity_type?: Database["public"]["Enums"]["project_type"] | null
          probability_percent?: number | null
          property_id?: string
          stage?: Database["public"]["Enums"]["opportunity_stage"] | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          carrier_name: string | null
          claim_number: string | null
          created_at: string | null
          end_date: string | null
          garage_door_details: Json | null
          id: string
          insurance_claim: boolean | null
          manager: string | null
          notes: string | null
          permit_number: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          property_id: string
          remodel_details: Json | null
          roofing_details: Json | null
          sale_id: string
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          carrier_name?: string | null
          claim_number?: string | null
          created_at?: string | null
          end_date?: string | null
          garage_door_details?: Json | null
          id?: string
          insurance_claim?: boolean | null
          manager?: string | null
          notes?: string | null
          permit_number?: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          property_id: string
          remodel_details?: Json | null
          roofing_details?: Json | null
          sale_id: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          carrier_name?: string | null
          claim_number?: string | null
          created_at?: string | null
          end_date?: string | null
          garage_door_details?: Json | null
          id?: string
          insurance_claim?: boolean | null
          manager?: string | null
          notes?: string | null
          permit_number?: string | null
          project_type?: Database["public"]["Enums"]["project_type"]
          property_id?: string
          remodel_details?: Json | null
          roofing_details?: Json | null
          sale_id?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address_hash: string
          address_line_1: string
          address_line_2: string | null
          city: string
          county: string | null
          created_at: string | null
          home_type: string | null
          id: string
          latitude: number | null
          longitude: number | null
          normalized_address: string
          owner_occupancy: string | null
          source: string | null
          state: string
          updated_at: string | null
          workspace_id: string
          year_built: number | null
          zip_code: string
        }
        Insert: {
          address_hash: string
          address_line_1: string
          address_line_2?: string | null
          city: string
          county?: string | null
          created_at?: string | null
          home_type?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          normalized_address: string
          owner_occupancy?: string | null
          source?: string | null
          state: string
          updated_at?: string | null
          workspace_id: string
          year_built?: number | null
          zip_code: string
        }
        Update: {
          address_hash?: string
          address_line_1?: string
          address_line_2?: string | null
          city?: string
          county?: string | null
          created_at?: string | null
          home_type?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          normalized_address?: string
          owner_occupancy?: string | null
          source?: string | null
          state?: string
          updated_at?: string | null
          workspace_id?: string
          year_built?: number | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          contract_signed_date: string
          contract_value: number
          created_at: string | null
          id: string
          opportunity_id: string
          sale_type: Database["public"]["Enums"]["project_type"]
          sold_by: string | null
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          contract_signed_date: string
          contract_value: number
          created_at?: string | null
          id?: string
          opportunity_id: string
          sale_type: Database["public"]["Enums"]["project_type"]
          sold_by?: string | null
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          contract_signed_date?: string
          contract_value?: number
          created_at?: string | null
          id?: string
          opportunity_id?: string
          sale_type?: Database["public"]["Enums"]["project_type"]
          sold_by?: string | null
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sales_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      service_tickets: {
        Row: {
          assigned_owner: string | null
          contact_id: string | null
          created_at: string | null
          description: string
          id: string
          outcome_notes: string | null
          priority: string | null
          project_id: string | null
          property_id: string
          status: Database["public"]["Enums"]["service_status"] | null
          target_date: string | null
          ticket_type: string
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          assigned_owner?: string | null
          contact_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          outcome_notes?: string | null
          priority?: string | null
          project_id?: string | null
          property_id: string
          status?: Database["public"]["Enums"]["service_status"] | null
          target_date?: string | null
          ticket_type: string
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          assigned_owner?: string | null
          contact_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          outcome_notes?: string | null
          priority?: string | null
          project_id?: string | null
          property_id?: string
          status?: Database["public"]["Enums"]["service_status"] | null
          target_date?: string | null
          ticket_type?: string
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_tickets_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_tickets_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_tickets_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_tickets_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_owner: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at: string | null
          workspace_id: string
        }
        Insert: {
          assigned_owner?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at?: string | null
          workspace_id: string
        }
        Update: {
          assigned_owner?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          updated_at?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      updates: {
        Row: {
          content: string | null
          created_at: string | null
          embedding: string | null
          entity_id: string
          entity_type: string
          id: string
          metadata: Json | null
          update_type: string
          user_id: string | null
          workspace_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          entity_id: string
          entity_type: string
          id?: string
          metadata?: Json | null
          update_type: string
          user_id?: string | null
          workspace_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          embedding?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          metadata?: Json | null
          update_type?: string
          user_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "updates_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          created_at: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_user_role: {
        Args: { _user_id: string; _workspace_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_workspaces: {
        Args: { _user_id: string }
        Returns: string[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "manager" | "rep" | "backoffice"
      interest_level: "none" | "low" | "medium" | "high"
      lead_status: "new" | "contacted" | "qualified" | "disqualified"
      opportunity_stage:
        | "discovery"
        | "inspection"
        | "estimate"
        | "proposal_sent"
        | "negotiation"
        | "won"
        | "lost"
      project_status: "planned" | "in_progress" | "on_hold" | "closed"
      project_type: "roofing" | "garage_door" | "remodel"
      service_status:
        | "new"
        | "triage"
        | "scheduled"
        | "onsite"
        | "resolved"
        | "closed"
      task_status: "open" | "done" | "snoozed"
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
      app_role: ["admin", "manager", "rep", "backoffice"],
      interest_level: ["none", "low", "medium", "high"],
      lead_status: ["new", "contacted", "qualified", "disqualified"],
      opportunity_stage: [
        "discovery",
        "inspection",
        "estimate",
        "proposal_sent",
        "negotiation",
        "won",
        "lost",
      ],
      project_status: ["planned", "in_progress", "on_hold", "closed"],
      project_type: ["roofing", "garage_door", "remodel"],
      service_status: [
        "new",
        "triage",
        "scheduled",
        "onsite",
        "resolved",
        "closed",
      ],
      task_status: ["open", "done", "snoozed"],
    },
  },
} as const
