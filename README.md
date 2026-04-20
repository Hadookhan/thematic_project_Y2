# Directors/Actors Database

A modern, responsive celebrity database web application inspired by IMDb, featuring a sleek dark UI design with comprehensive filtering, sorting, and detailed filmography viewing.

## Features

- **Advanced Search**: Real-time search to filter actors and directors by name
- **Multi-Filter System**:
  - Filter by profession (All, Actors, Directors)
  - Filter by genre (Sci-Fi, Drama, Thriller, Action, Comedy, Crime, Documentary, Fantasy)
  - Sort by name (A-Z), most awards, or most movies
- **Detailed Celebrity Cards**: Each card displays:
  - Initial-based placeholder (template-ready for Supabase integration)
  - Genre tags
  - Film count and awards statistics
  - Active years in the industry
- **Person Detail View**: Click any person to see:
  - Full biography
  - Complete filmography with ratings
  - Character names for actors
  - Role information (Director/Actor)
- **Responsive Grid Layout**: Beautifully designed cards that adapt to any screen size
- **Smooth Animations**: Powered by Framer Motion for fluid interactions, hover effects, and modal transitions
- **Modern Design**: Dark blue background (#0A1929) with vibrant orange accents (#ff6b1a)
- **Supabase Ready**: Template structure designed for easy database integration

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js 16+ installed
- pnpm (or npm/yarn)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <repo-name>
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open your browser and navigate to the provided local URL

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   └── ui/           # shadcn/ui components
│   ├── pages/
│   │   └── ActorsPage.tsx
│   └── App.tsx
├── styles/
│   ├── fonts.css
│   ├── index.css
│   ├── tailwind.css
│   └── theme.css
└── main.tsx
```

## Data Structure

The application expects data in the following format (ready for Supabase integration):

```typescript
interface Movie {
  id: string;
  title: string;
  year: number;
  role?: string;
  character?: string;
  rating?: number;
}

interface Actor {
  id: string;
  name: string;
  knownFor?: string; // 'Actor' or 'Director'
  birthPlace?: string;
  movieCount?: number;
  genre?: string[]; // e.g., ['Sci-Fi', 'Thriller']
  awards?: number;
  activeYears?: string; // e.g., '1998-Present'
  movies?: Movie[];
  biography?: string;
}
```

## Design System

- **Primary Color**: Orange (#ff6b1a)
- **Background**: Dark Blue (#0A1929)
- **Card Background**: Medium Blue (#1E3A5F)
- **Border**: Light Blue (#2C4A6F)
- **Typography**: Plus Jakarta Sans

## Supabase Integration Guide

### Quick Start (3 Steps)

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Wait for your database to be provisioned

2. **Set Up Your Database**
   - Open the SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-schema.sql`
   - Run the SQL to create tables and sample data

3. **Configure Your App**
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials from Project Settings → API
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Switch to Supabase Version**
   - Replace `src/app/pages/ActorsPage.tsx` with `src/app/pages/ActorsPageWithSupabase.tsx`
   - Or manually update ActorsPage to use the Supabase client

### Database Schema

The app expects two tables:

**people** table:
- `id` (UUID, primary key)
- `name` (text)
- `known_for` (text: 'Actor' or 'Director')
- `birth_place` (text)
- `movie_count` (integer)
- `genres` (text array: e.g., ['Sci-Fi', 'Thriller'])
- `awards` (integer)
- `active_years` (text: e.g., '1998-Present')
- `biography` (text)

**movies** table:
- `id` (UUID, primary key)
- `person_id` (UUID, foreign key to people)
- `title` (text)
- `year` (integer)
- `role` (text: 'Actor' or 'Director')
- `character` (text, for actors)
- `rating` (decimal, e.g., 8.8)

### Example Supabase Query

```typescript
import { supabase } from './lib/supabase';

// Fetch all people with their movies
const { data, error } = await supabase
  .from('people')
  .select(`
    *,
    movies (*)
  `)
  .order('name');
```

## Features to Customize

- Add profile images by updating the placeholder logic
- Extend filtering options (by decade, country, etc.)
- Add pagination for large datasets
- Implement user authentication for watchlists
- Add favorite/bookmark functionality

## License

MIT
