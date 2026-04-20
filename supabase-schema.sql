-- Supabase Database Schema for Directors/Actors Database
-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Table: people (actors and directors)
CREATE TABLE IF NOT EXISTS people (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  known_for TEXT, -- 'Actor' or 'Director'
  birth_place TEXT,
  movie_count INTEGER DEFAULT 0,
  genres TEXT[], -- Array of genres like {'Drama', 'Thriller'}
  awards INTEGER DEFAULT 0,
  active_years TEXT, -- e.g., '1998-Present'
  biography TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: movies
CREATE TABLE IF NOT EXISTS movies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  person_id UUID REFERENCES people(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  year INTEGER,
  role TEXT, -- 'Actor' or 'Director'
  character TEXT, -- Character name for actors
  rating DECIMAL(3,1), -- e.g., 8.8
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_people_name ON people(name);
CREATE INDEX IF NOT EXISTS idx_people_known_for ON people(known_for);
CREATE INDEX IF NOT EXISTS idx_movies_person_id ON movies(person_id);
CREATE INDEX IF NOT EXISTS idx_movies_year ON movies(year);

-- Sample data for Christopher Nolan
INSERT INTO people (name, known_for, birth_place, movie_count, genres, awards, active_years, biography)
VALUES (
  'Christopher Nolan',
  'Director',
  'London, England',
  12,
  ARRAY['Sci-Fi', 'Thriller'],
  15,
  '1998-Present',
  'Christopher Edward Nolan is a British-American film director, producer, and screenwriter known for his complex narratives and innovative filmmaking techniques.'
) RETURNING id;

-- Note: You'll need to replace 'PERSON_ID' below with the actual UUID returned from the above INSERT

-- Sample movies for Christopher Nolan (replace PERSON_ID with actual UUID)
-- INSERT INTO movies (person_id, title, year, role, rating) VALUES
-- ('PERSON_ID', 'Inception', 2010, 'Director', 8.8),
-- ('PERSON_ID', 'The Dark Knight', 2008, 'Director', 9.0),
-- ('PERSON_ID', 'Interstellar', 2014, 'Director', 8.6);

-- Sample data for Leonardo DiCaprio
INSERT INTO people (name, known_for, birth_place, movie_count, genres, awards, active_years, biography)
VALUES (
  'Leonardo DiCaprio',
  'Actor',
  'Los Angeles, California',
  45,
  ARRAY['Drama', 'Thriller'],
  42,
  '1989-Present',
  'Leonardo Wilhelm DiCaprio is an American actor and film producer known for his work in biopics and period films.'
) RETURNING id;

-- Sample movies for Leonardo DiCaprio (replace PERSON_ID with actual UUID)
-- INSERT INTO movies (person_id, title, year, role, character, rating) VALUES
-- ('PERSON_ID', 'Inception', 2010, 'Actor', 'Dom Cobb', 8.8),
-- ('PERSON_ID', 'The Revenant', 2015, 'Actor', 'Hugh Glass', 8.0),
-- ('PERSON_ID', 'Titanic', 1997, 'Actor', 'Jack Dawson', 7.9);

-- Enable Row Level Security (RLS) for public read access
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to people"
  ON people FOR SELECT
  USING (true);

CREATE POLICY "Allow public read access to movies"
  ON movies FOR SELECT
  USING (true);

-- Optional: If you want to allow authenticated users to insert/update
-- CREATE POLICY "Allow authenticated insert to people"
--   ON people FOR INSERT
--   TO authenticated
--   WITH CHECK (true);
