import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Uwaga: Service role key NIE MOŻE być używany w przeglądarce ze względów bezpieczeństwa!
// Użyj Supabase Edge Functions lub backend API do operacji wymagających admin uprawnień.

