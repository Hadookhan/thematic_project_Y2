# Supabase Setup Guide

This guide will help you integrate your Directors/Actors database with Supabase.

## Prerequisites

- A Supabase account (free tier works fine)
- Node.js installed on your machine

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" or "New Project"
3. Fill in your project details:
   - **Name**: directors-actors-db (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select the region closest to you
4. Click "Create new project"
5. Wait 2-3 minutes for your database to be provisioned

## Step 2: Set Up Database Tables

1. In your Supabase dashboard, click on the **SQL Editor** in the left sidebar
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" to execute the SQL

This will create:
- `people` table (for actors and directors)
- `movies` table (for filmography)
- Indexes for performance
- Sample data (Christopher Nolan and Leonardo DiCaprio)
- Row Level Security policies for public read access

## Step 3: Get Your API Keys

1. In your Supabase dashboard, click **Project Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. You'll see two important values:
   - **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
   - **anon/public key**: A long JWT token string

## Step 4: Configure Your App

1. Copy the `.env.example` file to create a new `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and add your credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Replace the placeholder values with your actual Supabase URL and anon key

## Step 5: Switch to Supabase Version

You have two options:

### Option A: Replace the file (Recommended)
```bash
cp src/app/pages/ActorsPageWithSupabase.tsx src/app/pages/ActorsPage.tsx
```

### Option B: Update App.tsx
Edit `src/app/App.tsx` to import the Supabase version:
```typescript
import { ActorsPage } from './pages/ActorsPageWithSupabase';
```

## Step 6: Run Your App

```bash
npm run dev
# or
pnpm dev
```

Your app should now be connected to Supabase! You'll see the sample data (Christopher Nolan and Leonardo DiCaprio) on the page.

## Adding More Data

### Via Supabase Dashboard

1. Go to **Table Editor** in your Supabase dashboard
2. Select the `people` table
3. Click "Insert row"
4. Fill in the fields
5. Click "Save"

### Via SQL

You can add more data using SQL queries in the SQL Editor:

```sql
-- Add a person
INSERT INTO people (name, known_for, birth_place, movie_count, genres, awards, active_years, biography)
VALUES (
  'Martin Scorsese',
  'Director',
  'New York City, New York',
  25,
  ARRAY['Crime', 'Drama'],
  112,
  '1963-Present',
  'Martin Charles Scorsese is an American film director, producer, and screenwriter.'
);

-- Add movies for that person (replace the UUID with the actual person's ID)
INSERT INTO movies (person_id, title, year, role, rating) VALUES
('PERSON_UUID_HERE', 'Goodfellas', 1990, 'Director', 8.7),
('PERSON_UUID_HERE', 'The Departed', 2006, 'Director', 8.5);
```

## Troubleshooting

### "Failed to fetch" error
- Check that your `.env` file exists and has the correct values
- Verify your Supabase URL and anon key are correct
- Make sure your app is running (`npm run dev`)

### No data showing
- Check the browser console for errors
- Verify your database tables exist (check Table Editor in Supabase)
- Make sure Row Level Security policies are set up (they should be if you ran the schema SQL)

### CORS errors
- Supabase anon key should work from any domain
- If you're seeing CORS errors, check your Supabase project settings

## Security Notes

- The `.env` file is gitignored - never commit it!
- The anon key is safe to use in frontend code
- Row Level Security (RLS) policies control what data is accessible
- For production, review and customize your RLS policies

## Next Steps

- Add more actors and directors to your database
- Customize the database schema for your needs
- Add authentication to allow users to create accounts
- Implement user-specific features (favorites, ratings, etc.)
- Deploy your app to Vercel, Netlify, or your preferred hosting platform

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
