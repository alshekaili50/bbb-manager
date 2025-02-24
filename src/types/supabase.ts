export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          subscription_status: 'active' | 'inactive' | 'trial'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subscription_status?: 'active' | 'inactive' | 'trial'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          subscription_status?: 'active' | 'inactive' | 'trial'
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          organization_id: string
          role: 'admin' | 'user'
          name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          organization_id: string
          role?: 'admin' | 'user'
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          organization_id?: string
          role?: 'admin' | 'user'
          name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      instances: {
        Row: {
          id: string
          ec2_instance_id: string
          status: 'running' | 'stopped' | 'terminated'
          organization_id: string
          name: string
          region: string
          type: string
          last_active: string
          cost_per_hour: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          ec2_instance_id: string
          status?: 'running' | 'stopped' | 'terminated'
          organization_id: string
          name: string
          region: string
          type: string
          last_active?: string
          cost_per_hour: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          ec2_instance_id?: string
          status?: 'running' | 'stopped' | 'terminated'
          organization_id?: string
          name?: string
          region?: string
          type?: string
          last_active?: string
          cost_per_hour?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 