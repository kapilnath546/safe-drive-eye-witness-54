
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if the URL is available and provide helpful error message
if (!supabaseUrl) {
  console.error('Missing VITE_SUPABASE_URL environment variable');
}

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable');
}

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
