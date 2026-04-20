import { supabase } from '../lib/supabase';

// -----------------------------------
export function clearSearchData() {
  return {
    searchInput: '',
    searchType: 'all',
    results: { movies: [], people: [] },
    error: '',
  };
}

// -----------------------------------
export async function fetchRating(movieId) {
  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .eq('movie_id', movieId);

  if (error || !data || data.length === 0) return null;

  const avg =
    data.reduce((sum, row) => sum + Number(row.rating), 0) / data.length;

  return Number(avg.toFixed(1));
}

// -----------------------------------
export async function fetchGenre(movieId) {
  const { data: movieGenreRows, error } = await supabase
    .from('movie_genres')
    .select('genre_id')
    .eq('movie_id', movieId);

  if (error || !movieGenreRows) return [];

  const genreIds = movieGenreRows.map((row) => row.genre_id);

  const { data: genreRows } = await supabase
    .from('genres')
    .select('name')
    .in('genre_id', genreIds);

  return genreRows?.map((row) => row.name) ?? [];
}

// -----------------------------------
export async function searchMovies(inputStr) {
  const trimmed = inputStr.trim();
  if (!trimmed) return [];

  const { data, error } = await supabase
    .from('movies')
    .select(`
      movie_id,
      title,
      overview,
      release_date,
      release_year,
      runtime
    `)
    .ilike('title', `%${trimmed}%`)
    .order('release_year', { ascending: false });

  if (error) throw new Error('Failed to search movies.');

  return Promise.all(
    (data || []).map(async (movie) => {
      const [rating, genres] = await Promise.all([
        fetchRating(movie.movie_id),
        fetchGenre(movie.movie_id),
      ]);

      return { ...movie, rating, genres };
    })
  );
}

// -----------------------------------
export async function searchPeople(inputStr) {
  const trimmed = inputStr.trim();
  if (!trimmed) return [];

  const { data, error } = await supabase
    .from('people')
    .select('person_id, name')
    .ilike('name', `%${trimmed}%`)
    .order('name');

  if (error) throw new Error('Failed to search people.');

  return Promise.all(
    (data || []).map(async (person) => {
      const [castRows, directorRows] = await Promise.all([
        supabase.from('cast_credits').select('movie_id').eq('person_id', person.person_id),
        supabase.from('crew_credits').select('movie_id').eq('person_id', person.person_id).eq('job', 'Director'),
      ]);

      const actingCount = castRows.data?.length || 0;
      const directingCount = directorRows.data?.length || 0;

      let roleLabel = 'Person';
      if (actingCount && directingCount) roleLabel = 'Actor / Director';
      else if (actingCount) roleLabel = 'Actor';
      else if (directingCount) roleLabel = 'Director';

      return { ...person, actingCount, directingCount, roleLabel };
    })
  );
}

// -----------------------------------
export async function runSearch(inputStr, searchType = 'all') {
  const trimmed = inputStr.trim();
  if (!trimmed) return { movies: [], people: [] };

  if (searchType === 'movies') {
    return { movies: await searchMovies(trimmed), people: [] };
  }

  if (searchType === 'people') {
    return { movies: [], people: await searchPeople(trimmed) };
  }

  const [movies, people] = await Promise.all([
    searchMovies(trimmed),
    searchPeople(trimmed),
  ]);

  return { movies, people };
}