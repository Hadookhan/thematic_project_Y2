import { supabase } from '../lib/supabase';

// -----------------------------
// fetch_rating(movie_id)
// Returns average rating for a movie
// -----------------------------
export async function fetchRating(movieId) {
  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .eq('movie_id', movieId);

  if (error) {
    console.error('Error fetching rating:', error.message);
    return null;
  }

  if (!data || data.length === 0) {
    return null;
  }

  const avg =
    data.reduce((sum, row) => sum + Number(row.rating), 0) / data.length;

  return Number(avg.toFixed(1));
}

// -----------------------------
// fetch_genre(movie_id)
// Uses movie_genres + genres
// -----------------------------
export async function fetchGenre(movieId) {
  const { data: movieGenreRows, error: movieGenreError } = await supabase
    .from('movie_genres')
    .select('genre_id')
    .eq('movie_id', movieId);

  if (movieGenreError) {
    console.error('Error fetching movie_genres:', movieGenreError.message);
    return [];
  }

  if (!movieGenreRows || movieGenreRows.length === 0) {
    return [];
  }

  const genreIds = movieGenreRows.map((row) => row.genre_id);

  const { data: genreRows, error: genreError } = await supabase
    .from('genres')
    .select('name')
    .in('genre_id', genreIds);

  if (genreError) {
    console.error('Error fetching genres:', genreError.message);
    return [];
  }

  return genreRows?.map((row) => row.name) ?? [];
}

// -----------------------------
// clear_data()
// returns empty browse state shape
// -----------------------------
export function clearBrowseData() {
  return {
    searchInput: '',
    selectedGenre: '',
    minYear: '',
    maxYear: '',
    minRating: '',
    results: [],
    error: '',
  };
}

// -----------------------------
// string_to_query()
// safe descriptor instead of raw SQL
// -----------------------------
export function stringToQuery(value, column, table) {
  return {
    value: String(value).trim(),
    column,
    table,
  };
}

// -----------------------------
// add_to_query()
// combine query descriptors
// -----------------------------
export function addToQuery(currentQuery, newQuery) {
  if (!currentQuery) return [newQuery];
  return [...currentQuery, newQuery];
}

// -----------------------------
// get_all_movies()
// base browse fetch
// -----------------------------
export async function getAllMovies(limit = 24) {
  const { data, error } = await supabase
    .from('movies')
    .select('movie_id, title, overview, release_date, release_year, runtime')
    .order('release_year', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching movies:', error.message);
    throw new Error('Failed to fetch movies.');
  }

  return data || [];
}

// -----------------------------
// search_query(input_str, target_col, table)
// movie title search
// -----------------------------
export async function searchMoviesByTitle(inputStr, targetCol = 'title', table = 'movies') {
  const trimmed = inputStr.trim();

  if (!trimmed) return [];

  const { data, error } = await supabase
    .from(table)
    .select('movie_id, title, overview, release_date, release_year, runtime')
    .ilike(targetCol, `%${trimmed}%`)
    .order('release_year', { ascending: false });

  if (error) {
    console.error('Search error:', error.message);
    throw new Error('Failed to search movies.');
  }

  return data || [];
}

// -----------------------------
// fetch_all_genres()
// for filter dropdown
// -----------------------------
export async function fetchAllGenres() {
  const { data, error } = await supabase
    .from('genres')
    .select('genre_id, name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching all genres:', error.message);
    throw new Error('Failed to fetch genres.');
  }

  return data || [];
}

// -----------------------------
// enrich movies with ratings + genres
// -----------------------------
export async function enrichMovies(movieRows) {
  return Promise.all(
    (movieRows || []).map(async (movie) => {
      const [rating, genres] = await Promise.all([
        fetchRating(movie.movie_id),
        fetchGenre(movie.movie_id),
      ]);

      return {
        ...movie,
        rating,
        genres,
      };
    })
  );
}

// -----------------------------
// apply browse filters in JS
// Since rating/genres are computed separately
// -----------------------------
export function filterMovies(movies, filters) {
  const {
    selectedGenre = '',
    minYear = '',
    maxYear = '',
    minRating = '',
  } = filters;

  return (movies || []).filter((movie) => {
    const movieYear = Number(movie.release_year);
    const movieRating = movie.rating == null ? null : Number(movie.rating);
    const movieGenres = movie.genres || [];

    const matchesGenre =
      !selectedGenre || movieGenres.includes(selectedGenre);

    const matchesMinYear =
      !minYear || (!Number.isNaN(movieYear) && movieYear >= Number(minYear));

    const matchesMaxYear =
      !maxYear || (!Number.isNaN(movieYear) && movieYear <= Number(maxYear));

    const matchesMinRating =
      !minRating ||
      (movieRating !== null && movieRating >= Number(minRating));

    return (
      matchesGenre &&
      matchesMinYear &&
      matchesMaxYear &&
      matchesMinRating
    );
  });
}

// -----------------------------
// main browse loader
// -----------------------------
export async function browseMovies({
  searchInput = '',
  selectedGenre = '',
  minYear = '',
  maxYear = '',
  minRating = '',
  limit = 24,
} = {}) {
  let baseMovies = [];

  if (searchInput.trim()) {
    baseMovies = await searchMoviesByTitle(searchInput, 'title', 'movies');
  } else {
    baseMovies = await getAllMovies(limit);
  }

  const enriched = await enrichMovies(baseMovies);

  const filtered = filterMovies(enriched, {
    selectedGenre,
    minYear,
    maxYear,
    minRating,
  });

  filtered.sort((a, b) => {
    const ratingA = a.rating ?? -1;
    const ratingB = b.rating ?? -1;

    if (ratingB !== ratingA) return ratingB - ratingA;

    const yearA = a.release_year ?? 0;
    const yearB = b.release_year ?? 0;

    if (yearB !== yearA) return yearB - yearA;

    return a.title.localeCompare(b.title);
  });

  return filtered;
}