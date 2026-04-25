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

// Database types matching your actual schema
export interface Person {
  person_id: number;
  name: string;
}

export interface Movie {
  movie_id: number;
  title: string;
  overview?: string;
  release_date?: string;
  release_year?: number;
  runtime?: number;
  budget?: number;
  revenue?: number;
}

export interface CastCredit {
  movie_id: number;
  person_id: number;
  character?: string;
  cast_order?: number;
  movies?: Movie;
}

export interface CrewCredit {
  movie_id: number;
  person_id: number;
  job: string;
  department?: string;
  movies?: Movie;
}

export interface Genre {
  genre_id: number;
  name: string;
}

export interface MovieGenre {
  movie_id: number;
  genre_id: number;
  genres?: Genre;
}

export interface Rating {
  user_id: number;
  movie_id: number;
  rating: number;
  rating_timestamp?: number;
}
