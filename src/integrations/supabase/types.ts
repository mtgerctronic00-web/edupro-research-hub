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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      content_files: {
        Row: {
          access_type: Database["public"]["Enums"]["access_type"]
          content_type: Database["public"]["Enums"]["content_type"]
          created_at: string | null
          description: string | null
          downloads_count: number | null
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          price: number | null
          title: string
          updated_at: string | null
          uploaded_by: string | null
          views_count: number | null
        }
        Insert: {
          access_type?: Database["public"]["Enums"]["access_type"]
          content_type: Database["public"]["Enums"]["content_type"]
          created_at?: string | null
          description?: string | null
          downloads_count?: number | null
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          price?: number | null
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
          views_count?: number | null
        }
        Update: {
          access_type?: Database["public"]["Enums"]["access_type"]
          content_type?: Database["public"]["Enums"]["content_type"]
          created_at?: string | null
          description?: string | null
          downloads_count?: number | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          price?: number | null
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
          views_count?: number | null
        }
        Relationships: []
      }
      free_samples: {
        Row: {
          admin_notes: string | null
          created_at: string
          details: string | null
          full_name: string
          id: string
          pages_count: number
          service_type: string
          status: string
          topic: string
          university: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          details?: string | null
          full_name: string
          id?: string
          pages_count: number
          service_type: string
          status?: string
          topic: string
          university: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          details?: string | null
          full_name?: string
          id?: string
          pages_count?: number
          service_type?: string
          status?: string
          topic?: string
          university?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      modifications: {
        Row: {
          admin_notes: string | null
          contact_method: string | null
          created_at: string
          delivery_date: string | null
          details: string
          full_name: string | null
          id: string
          modification_type: string
          order_id: string
          phone_number: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          contact_method?: string | null
          created_at?: string
          delivery_date?: string | null
          details: string
          full_name?: string | null
          id?: string
          modification_type: string
          order_id: string
          phone_number?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          contact_method?: string | null
          created_at?: string
          delivery_date?: string | null
          details?: string
          full_name?: string | null
          id?: string
          modification_type?: string
          order_id?: string
          phone_number?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "modifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_general: boolean | null
          message: string
          read: boolean
          related_order_id: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_general?: boolean | null
          message: string
          read?: boolean
          related_order_id?: string | null
          title: string
          type?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_general?: boolean | null
          message?: string
          read?: boolean
          related_order_id?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_order_id_fkey"
            columns: ["related_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_notes: string | null
          college: string
          content_file_id: string | null
          created_at: string
          delivery_date: string
          department: string
          full_name: string
          id: string
          notes: string | null
          order_number: string | null
          payment_receipt_url: string
          phone: string | null
          rejection_reason: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          status: Database["public"]["Enums"]["order_status"]
          title: string
          university: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_notes?: string | null
          college: string
          content_file_id?: string | null
          created_at?: string
          delivery_date: string
          department: string
          full_name: string
          id?: string
          notes?: string | null
          order_number?: string | null
          payment_receipt_url: string
          phone?: string | null
          rejection_reason?: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["order_status"]
          title: string
          university: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_notes?: string | null
          college?: string
          content_file_id?: string | null
          created_at?: string
          delivery_date?: string
          department?: string
          full_name?: string
          id?: string
          notes?: string | null
          order_number?: string | null
          payment_receipt_url?: string
          phone?: string | null
          rejection_reason?: string | null
          service_type?: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["order_status"]
          title?: string
          university?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_content_file_id_fkey"
            columns: ["content_file_id"]
            isOneToOne: false
            referencedRelation: "content_files"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_order_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      make_user_admin: {
        Args: { user_email: string }
        Returns: undefined
      }
    }
    Enums: {
      access_type: "view_only" | "free_download" | "paid_download"
      app_role: "admin" | "student"
      content_type: "research" | "seminar" | "report"
      order_status: "قيد المراجعة" | "مؤكد - جاري التنفيذ" | "مرفوض" | "مكتمل"
      service_type: "بحث" | "سمنار" | "تقرير"
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
      access_type: ["view_only", "free_download", "paid_download"],
      app_role: ["admin", "student"],
      content_type: ["research", "seminar", "report"],
      order_status: ["قيد المراجعة", "مؤكد - جاري التنفيذ", "مرفوض", "مكتمل"],
      service_type: ["بحث", "سمنار", "تقرير"],
    },
  },
} as const
