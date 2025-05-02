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
      specialties: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      doctors_specialties: {
        Row: {
          doctor_id: string
          specialty_id: string
        }
        Insert: {
          doctor_id: string
          specialty_id: string
        }
        Update: {
          doctor_id?: string
          specialty_id?: string
        }
      }
      expertise_areas: {
        Row: {
          id: string
          name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
          updated_at?: string
        }
      }
      doctors_expertise_areas: {
        Row: {
          doctor_id: string
          expertise_area_id: string
        }
        Insert: {
          doctor_id: string
          expertise_area_id: string
        }
        Update: {
          doctor_id?: string
          expertise_area_id?: string
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

export type Specialty = Tables['specialties']['Row']
export type SpecialtyInsert = Tables['specialties']['Insert']
export type SpecialtyUpdate = Tables['specialties']['Update']

export type DoctorSpecialty = Tables['doctors_specialties']['Row']
export type DoctorSpecialtyInsert = Tables['doctors_specialties']['Insert']
export type DoctorSpecialtyUpdate = Tables['doctors_specialties']['Update']

export type ExpertiseArea = Tables['expertise_areas']['Row']
export type ExpertiseAreaInsert = Tables['expertise_areas']['Insert']
export type ExpertiseAreaUpdate = Tables['expertise_areas']['Update']

export type DoctorExpertiseArea = Tables['doctors_expertise_areas']['Row']
export type DoctorExpertiseAreaInsert = Tables['doctors_expertise_areas']['Insert']
export type DoctorExpertiseAreaUpdate = Tables['doctors_expertise_areas']['Update']

export type Rating = Tables['ratings']['Row']
export type RatingInsert = Tables['ratings']['Insert']
export type RatingUpdate = Tables['ratings']['Update']

export type SearchHistory = Tables['search_history']['Row']
export type SearchHistoryInsert = Tables['search_history']['Insert']
export type SearchHistoryUpdate = Tables['search_history']['Update']