import { createClient } from '@supabase/supabase-js';

// These values would typically come from environment variables
// For this PoC, we're using placeholders that will be replaced with actual values
// when connecting to Supabase
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    storageKey: 'mediq-auth',
    storage: localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});