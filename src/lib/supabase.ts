
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Better error messages for missing configuration
if (!supabaseUrl) {
  console.error('ERROR: Missing VITE_SUPABASE_URL environment variable. Please connect to Supabase using the green button in the top right corner.');
}

if (!supabaseAnonKey) {
  console.error('ERROR: Missing VITE_SUPABASE_ANON_KEY environment variable. Please connect to Supabase using the green button in the top right corner.');
}

// Create a dummy client when credentials are missing to avoid runtime errors
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        signInWithPassword: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        signUp: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        signInWithOAuth: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        getSession: () => Promise.resolve({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      from: () => ({
        insert: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        select: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') }),
      }),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        }),
      },
    };

export type Incident = {
  id: string;
  created_at: string;
  vehicle_number: string;
  location: string;
  incident_date: string;
  description: string;
  media_url?: string;
  status: 'pending' | 'resolved';
  user_id: string;
};
