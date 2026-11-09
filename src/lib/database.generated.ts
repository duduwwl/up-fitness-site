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
