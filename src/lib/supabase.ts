import { createClient } from '@supabase/supabase-js';

// These values would typically come from environment variables
// For this PoC, we're using placeholders that will be replaced with actual values
// when connecting to Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Brakuje zmiennych środowiskowych VITE_SUPABASE_URL lub VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    storageKey: 'mediq-auth',
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    //debug: true // To help diagnose auth issues
  }
});