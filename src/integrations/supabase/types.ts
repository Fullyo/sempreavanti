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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          accommodation_currency: string
          accommodation_fare: number
          amount_paid: number | null
          cash_collected: number
          cc_fee: number
          cc_fee_on: boolean
          checkin: string
          checkout: string | null
          created_at: string
          exchange_rate: number
          gratuity_waived: boolean
          grocery_allocation: number
          grocery_allocation_currency: string
          guest: string
          guest_gratuity: number | null
          guest_tip: number | null
          guesty_fare: number | null
          guesty_id: string | null
          id: number
          items: Json
          listing_name: string | null
          meal_token: string
          nights: number | null
          notes: string | null
          paid_at: string | null
          pay_token: string
          payment_status: string
          res_status: string | null
          saved_at: string
          source: string
          stripe_session_id: string | null
          tip: number
          tip_cash: number
          tip_cash_currency: string
          tip_cash_mxn: number
          tip_cash_usd: number
          tip_cash_value: number
          tip_currency: string
          tip_method: string
          tip_mode: string
          tip_value: number
          total_guest: number
          total_profit: number
        }
        Insert: {
          accommodation_currency?: string
          accommodation_fare?: number
          amount_paid?: number | null
          cash_collected?: number
          cc_fee?: number
          cc_fee_on?: boolean
          checkin: string
          checkout?: string | null
          created_at?: string
          exchange_rate?: number
          gratuity_waived?: boolean
          grocery_allocation?: number
          grocery_allocation_currency?: string
          guest: string
          guest_gratuity?: number | null
          guest_tip?: number | null
          guesty_fare?: number | null
          guesty_id?: string | null
          id?: number
          items?: Json
          listing_name?: string | null
          meal_token?: string
          nights?: number | null
          notes?: string | null
          paid_at?: string | null
          pay_token?: string
          payment_status?: string
          res_status?: string | null
          saved_at?: string
          source?: string
          stripe_session_id?: string | null
          tip?: number
          tip_cash?: number
          tip_cash_currency?: string
          tip_cash_mxn?: number
          tip_cash_usd?: number
          tip_cash_value?: number
          tip_currency?: string
          tip_method?: string
          tip_mode?: string
          tip_value?: number
          total_guest?: number
          total_profit?: number
        }
        Update: {
          accommodation_currency?: string
          accommodation_fare?: number
          amount_paid?: number | null
          cash_collected?: number
          cc_fee?: number
          cc_fee_on?: boolean
          checkin?: string
          checkout?: string | null
          created_at?: string
          exchange_rate?: number
          gratuity_waived?: boolean
          grocery_allocation?: number
          grocery_allocation_currency?: string
          guest?: string
          guest_gratuity?: number | null
          guest_tip?: number | null
          guesty_fare?: number | null
          guesty_id?: string | null
          id?: number
          items?: Json
          listing_name?: string | null
          meal_token?: string
          nights?: number | null
          notes?: string | null
          paid_at?: string | null
          pay_token?: string
          payment_status?: string
          res_status?: string | null
          saved_at?: string
          source?: string
          stripe_session_id?: string | null
          tip?: number
          tip_cash?: number
          tip_cash_currency?: string
          tip_cash_mxn?: number
          tip_cash_usd?: number
          tip_cash_value?: number
          tip_currency?: string
          tip_method?: string
          tip_mode?: string
          tip_value?: number
          total_guest?: number
          total_profit?: number
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      guesty_cache: {
        Row: {
          expires_at: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          expires_at?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          expires_at?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          created_at: string | null
          email: string
          first_name: string
          group_size: string | null
          guesty_reservation_id: string | null
          id: string
          last_name: string
          message: string | null
          phone: string | null
          preferred_dates: string | null
          selected_activities: string[] | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          first_name: string
          group_size?: string | null
          guesty_reservation_id?: string | null
          id?: string
          last_name: string
          message?: string | null
          phone?: string | null
          preferred_dates?: string | null
          selected_activities?: string[] | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          first_name?: string
          group_size?: string | null
          guesty_reservation_id?: string | null
          id?: string
          last_name?: string
          message?: string | null
          phone?: string | null
          preferred_dates?: string | null
          selected_activities?: string[] | null
          status?: string | null
        }
        Relationships: []
      }
      meal_plans: {
        Row: {
          breakfast_time: string | null
          checkin: string | null
          checkout: string | null
          created_at: string
          guest: string | null
          id: string
          lunch_time: string | null
          meal_token: string
          reservation_id: string | null
          special_requests: string | null
          updated_at: string
        }
        Insert: {
          breakfast_time?: string | null
          checkin?: string | null
          checkout?: string | null
          created_at?: string
          guest?: string | null
          id?: string
          lunch_time?: string | null
          meal_token: string
          reservation_id?: string | null
          special_requests?: string | null
          updated_at?: string
        }
        Update: {
          breakfast_time?: string | null
          checkin?: string | null
          checkout?: string | null
          created_at?: string
          guest?: string | null
          id?: string
          lunch_time?: string | null
          meal_token?: string
          reservation_id?: string | null
          special_requests?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_plans_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_selections: {
        Row: {
          course: string
          created_at: string
          day: string
          dish_id: string | null
          free_text: string | null
          id: string
          meal_plan_id: string
          skip: boolean
          updated_at: string
        }
        Insert: {
          course: string
          created_at?: string
          day: string
          dish_id?: string | null
          free_text?: string | null
          id?: string
          meal_plan_id: string
          skip?: boolean
          updated_at?: string
        }
        Update: {
          course?: string
          created_at?: string
          day?: string
          dish_id?: string | null
          free_text?: string | null
          id?: string
          meal_plan_id?: string
          skip?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_selections_dish_id_fkey"
            columns: ["dish_id"]
            isOneToOne: false
            referencedRelation: "menu_dishes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_selections_meal_plan_id_fkey"
            columns: ["meal_plan_id"]
            isOneToOne: false
            referencedRelation: "meal_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_dishes: {
        Row: {
          course: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          course: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          course?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      petty_cash: {
        Row: {
          booking_ref: string
          currency: string
          float_amount: number
          notes: string | null
          updated_at: string
        }
        Insert: {
          booking_ref: string
          currency?: string
          float_amount?: number
          notes?: string | null
          updated_at?: string
        }
        Update: {
          booking_ref?: string
          currency?: string
          float_amount?: number
          notes?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          checkin: string | null
          checkout: string | null
          created_at: string
          guest: string | null
          guesty_id: string
          id: string
          listing_id: string | null
          listing_name: string | null
          meal_token: string
          nights: number | null
          raw: Json | null
          status: string | null
          updated_at: string
        }
        Insert: {
          checkin?: string | null
          checkout?: string | null
          created_at?: string
          guest?: string | null
          guesty_id: string
          id?: string
          listing_id?: string | null
          listing_name?: string | null
          meal_token?: string
          nights?: number | null
          raw?: Json | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          checkin?: string | null
          checkout?: string | null
          created_at?: string
          guest?: string | null
          guesty_id?: string
          id?: string
          listing_id?: string | null
          listing_name?: string | null
          meal_token?: string
          nights?: number | null
          raw?: Json | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          created_at: string
          id: number
          is_active: boolean
          name: string
          price: number
          sort_order: number
          sub_text: string | null
          type: string
          unit_cost: number | null
        }
        Insert: {
          category: string
          created_at?: string
          id?: number
          is_active?: boolean
          name: string
          price?: number
          sort_order?: number
          sub_text?: string | null
          type: string
          unit_cost?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: number
          is_active?: boolean
          name?: string
          price?: number
          sort_order?: number
          sub_text?: string | null
          type?: string
          unit_cost?: number | null
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
