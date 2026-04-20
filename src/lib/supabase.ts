/**
 * Supabase Client Configuration
 *
 * Replace these with your actual Supabase credentials from:
 * https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
 */

import { createClient } from '@supabase/supabase-js';

// Get these from your Supabase project settings
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for TypeScript autocomplete
export interface Movie {
  id: string;
  title: string;
  year: number;
  role?: string;
  character?: string;
  rating?: number;
}

export interface Person {
  id: string;
  name: string;
  known_for?: string;
  birth_place?: string;
  movie_count?: number;
  genres?: string[];
  awards?: number;
  active_years?: string;
  biography?: string;
}
