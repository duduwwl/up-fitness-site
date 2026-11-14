export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      membership_requests: {
        Row: {
          id: string;
          plan_slug: string;
          full_name: string;
          email: string;
          phone: string;
          payment_method: string;
          status: string;
          consent_version: string;
          consented_at: string;
          management_token_hash: string;
          created_at: string;
          updated_at: string;
          expires_at: string;
        };
        Insert: {
          id?: string;
          plan_slug: string;
          full_name: string;
          email: string;
          phone: string;
          payment_method: string;
          status?: string;
          consent_version: string;
          consented_at?: string;
          management_token_hash: string;
          created_at?: string;
          updated_at?: string;
          expires_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["membership_requests"]["Insert"]>;
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          membership_request_id: string | null;
          provider: string;
          provider_order_id: string | null;
          provider_charge_id: string | null;
          method: string;
          amount_cents: number;
          currency: string;
          status: string;
          pix_qr_code: string | null;
          pix_qr_code_url: string | null;
          pix_expires_at: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          membership_request_id?: string | null;
          provider?: string;
          provider_order_id?: string | null;
          provider_charge_id?: string | null;
          method: string;
          amount_cents: number;
          currency?: string;
          status?: string;
          pix_qr_code?: string | null;
          pix_qr_code_url?: string | null;
          pix_expires_at?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payments"]["Insert"]>;
        Relationships: [];
      };
      payment_events: {
        Row: {
          id: string;
          provider: string;
          event_id: string;
          event_type: string | null;
          payment_id: string | null;
          payload: Json | null;
          received_at: string;
        };
        Insert: {
          id?: string;
          provider?: string;
          event_id: string;
          event_type?: string | null;
          payment_id?: string | null;
          payload?: Json | null;
          received_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["payment_events"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      consume_membership_request_rate_limit: {
        Args: { request_scope: string; request_fingerprint: string };
        Returns: boolean;
      };
      purge_expired_membership_requests: { Args: Record<PropertyKey, never>; Returns: number };
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
