
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

