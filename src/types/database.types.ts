export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      doctors: {
        Row: {
          id: string
          first_name: string
          last_name: string
          experience: number | null
          education: string | null
          bio: string | null
          profile_image_url: string | null
          active: boolean
          specialties: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          experience?: number | null
          education?: string | null
          bio?: string | null
          profile_image_url?: string | null
          active?: boolean
          specialties: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          experience?: number | null
          education?: string | null
          bio?: string | null
          profile_image_url?: string | null
          active?: boolean
          specialties?: string
          created_at?: string
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          doctor_id: string
          street: string | null
          city: string | null
          state: string | null
          postal_code: string | null
          country: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          doctor_id: string
          street?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          doctor_id?: string
          street?: string | null
          city?: string | null
          state?: string | null
          postal_code?: string | null
          country?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      ratings: {
        Row: {
          id: string
          doctor_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          doctor_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          doctor_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      search_history: {
        Row: {
          id: string
          user_id: string
          query: string
          specialties: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          query: string
          specialties?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          query?: string
          specialties?: Json | null
          created_at?: string
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

// Pomocnicze typy dla łatwiejszego dostępu do tabel
export type Tables = Database['public']['Tables']
export type TableName = keyof Tables

// Typy dla poszczególnych tabel
export type Doctor = Tables['doctors']['Row']
export type DoctorInsert = Tables['doctors']['Insert']
export type DoctorUpdate = Tables['doctors']['Update']

export type Address = Tables['addresses']['Row']
export type AddressInsert = Tables['addresses']['Insert']
export type AddressUpdate = Tables['addresses']['Update']

export type Rating = Tables['ratings']['Row']
export type RatingInsert = Tables['ratings']['Insert']
export type RatingUpdate = Tables['ratings']['Update']

export type SearchHistory = Tables['search_history']['Row']
export type SearchHistoryInsert = Tables['search_history']['Insert']
export type SearchHistoryUpdate = Tables['search_history']['Update']