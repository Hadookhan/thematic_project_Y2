import { supabase } from '../lib/supabase';

// --------------------------------------------------
// ratings(movie_id, rating)
// returns average rating for one movie
// --------------------------------------------------
export async function fetchRating(movieId) {
  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .eq('movie_id', movieId);

  if (error) {
    console.error('Error fetching rating:', error.message);
    return null;
  }

  if (!data || data.length === 0) return null;

  const avg =
    data.reduce((sum, row) => sum + Number(row.rating), 0) / data.length;

  return Number(avg.toFixed(1));
}

// --------------------------------------------------
// movie_genres(movie_id, genre_id) + genres(genre_id, name)
// --------------------------------------------------
export async function fetchGenre(movieId) {
  const { data: movieGenreRows, error: movieGenreError } = await supabase
    .from('movie_genres')
    .select('genre_id')
    .eq('movie_id', movieId);

  if (movieGenreError) {
    console.error('Error fetching movie_genres:', movieGenreError.message);
    return [];
  }

  if (!movieGenreRows || movieGenreRows.length === 0) return [];

  const genreIds = movieGenreRows.map((row) => row.genre_id);

  const { data: genreRows, error: genreError } = await supabase
    .from('genres')
    .select('genre_id, name')
    .in('genre_id', genreIds);

  if (genreError) {
    console.error('Error fetching genres:', genreError.message);
    return [];
  }

  return genreRows?.map((row) => row.name) ?? [];
}

// --------------------------------------------------
// cast_credits(movie_id, person_id) + people(person_id, name)
// actor filter helper
// --------------------------------------------------
export async function fetchCastNames(movieId) {
  const { data: castRows, error: castError } = await supabase
    .from('cast_credits')
    .select('person_id')
    .eq('movie_id', movieId);

  if (castError) {
    console.error('Error fetching cast_credits:', castError.message);
    return [];
  }

  if (!castRows || castRows.length === 0) return [];

  const personIds = castRows.map((row) => row.person_id);

  const { data: peopleRows, error: peopleError } = await supabase
    .from('people')
    .select('person_id, name')
    .in('person_id', personIds);

  if (peopleError) {
    console.error('Error fetching cast people:', peopleError.message);
    return [];
  }

  return peopleRows?.map((row) => row.name) ?? [];
}

// --------------------------------------------------
// crew_credits(movie_id, person_id, job) + people(person_id, name)
// director filter helper
// --------------------------------------------------
export async function fetchDirectorNames(movieId) {
  const { data: crewRows, error: crewError } = await supabase
    .from('crew_credits')
    .select('person_id, job')
    .eq('movie_id', movieId)
    .eq('job', 'Director');

  if (crewError) {
    console.error('Error fetching crew_credits:', crewError.message);
    return [];
  }

  if (!crewRows || crewRows.length === 0) return [];

  const personIds = crewRows.map((row) => row.person_id);

  const { data: peopleRows, error: peopleError } = await supabase
    .from('people')
    .select('person_id, name')
    .in('person_id', personIds);

  if (peopleError) {
    console.error('Error fetching director people:', peopleError.message);
    return [];
  }

  return peopleRows?.map((row) => row.name) ?? [];
}

// --------------------------------------------------
// genres table for filter list
// genres(genre_id, name)
// --------------------------------------------------
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

// --------------------------------------------------
// reset state helper
// --------------------------------------------------
export function clearBrowseData() {
  return {
    searchInput: '',
    selectedGenres: [],
    actorName: '',
    directorName: '',
    results: [],
    error: '',
  };
}

// --------------------------------------------------
// movies(movie_id, title, overview, release_date, release_year, runtime, budget, revenue)
// base movie fetch
// --------------------------------------------------
export async function getAllMovies(limit = 300) {
  const { data, error } = await supabase
    .from('movies')
    .select(`
      movie_id,
      title,
      overview,
      release_date,
      release_year,
      runtime,
      budget,
      revenue
    `)
    .order('release_year', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching movies:', error.message);
    throw new Error('Failed to fetch movies.');
  }

  return data || [];
}

// --------------------------------------------------
// title search from movies.title
// --------------------------------------------------
export async function searchMoviesByTitle(inputStr) {
  const trimmed = inputStr.trim();

  if (!trimmed) {
    return getAllMovies();
  }

  const { data, error } = await supabase
    .from('movies')
    .select(`
      movie_id,
      title,
      overview,
      release_date,
      release_year,
      runtime,
      budget,
      revenue
    `)
    .ilike('title', `%${trimmed}%`)
    .order('release_year', { ascending: false });

  if (error) {
    console.error('Search error:', error.message);
    throw new Error('Failed to search movies.');
  }

  return data || [];
}

// --------------------------------------------------
// enrich each movie with related data
// --------------------------------------------------
export async function enrichMovies(movieRows) {
  return Promise.all(
    (movieRows || []).map(async (movie) => {
      const [rating, genres, castNames, directorNames] = await Promise.all([
        fetchRating(movie.movie_id),
        fetchGenre(movie.movie_id),
        fetchCastNames(movie.movie_id),
        fetchDirectorNames(movie.movie_id),
      ]);

      return {
        ...movie,
        rating,
        genres,
        castNames,
        directorNames,
      };
    })
  );
}

// --------------------------------------------------
// JS-side filter logic using correct schema fields
// --------------------------------------------------
export function filterMovies(movies, filters) {
  const {
    selectedGenres = [],
    minYear = '',
    maxYear = '',
    minBudget = '',
    maxBudget = '',
    minRevenue = '',
    maxRevenue = '',
    actorName = '',
    directorName = '',
  } = filters;

  return (movies || []).filter((movie) => {
    const movieYear = Number(movie.release_year);
    const movieBudget = Number(movie.budget);
    const movieRevenue = Number(movie.revenue);

    const matchesGenres =
      selectedGenres.length === 0 ||
      selectedGenres.every((genre) => movie.genres?.includes(genre));

    const matchesMinYear =
      minYear === '' || (!Number.isNaN(movieYear) && movieYear >= Number(minYear));

    const matchesMaxYear =
      maxYear === '' || (!Number.isNaN(movieYear) && movieYear <= Number(maxYear));

    const matchesMinBudget =
      minBudget === '' || (!Number.isNaN(movieBudget) && movieBudget >= Number(minBudget));

    const matchesMaxBudget =
      maxBudget === '' || (!Number.isNaN(movieBudget) && movieBudget <= Number(maxBudget));

    const matchesMinRevenue =
      minRevenue === '' || (!Number.isNaN(movieRevenue) && movieRevenue >= Number(minRevenue));

    const matchesMaxRevenue =
      maxRevenue === '' || (!Number.isNaN(movieRevenue) && movieRevenue <= Number(maxRevenue));

    const matchesActor =
      !actorName.trim() ||
      movie.castNames?.some((name) =>
        name.toLowerCase().includes(actorName.toLowerCase())
      );

    const matchesDirector =
      !directorName.trim() ||
      movie.directorNames?.some((name) =>
        name.toLowerCase().includes(directorName.toLowerCase())
      );

    return (
      matchesGenres &&
      matchesMinYear &&
      matchesMaxYear &&
      matchesMinBudget &&
      matchesMaxBudget &&
      matchesMinRevenue &&
      matchesMaxRevenue &&
      matchesActor &&
      matchesDirector
    );
  });
}

// --------------------------------------------------
// main browse loader
// --------------------------------------------------
export async function browseMovies({
  searchInput = '',
  selectedGenres = [],
  minYear = '',
  maxYear = '',
  minBudget = '',
  maxBudget = '',
  minRevenue = '',
  maxRevenue = '',
  actorName = '',
  directorName = '',
} = {}) {
  const baseMovies = await searchMoviesByTitle(searchInput);
  const enrichedMovies = await enrichMovies(baseMovies);

  const filtered = filterMovies(enrichedMovies, {
    selectedGenres,
    minYear,
    maxYear,
    minBudget,
    maxBudget,
    minRevenue,
    maxRevenue,
    actorName,
    directorName,
  });

  filtered.sort((a, b) => {
    const yearA = a.release_year ?? 0;
    const yearB = b.release_year ?? 0;
    return yearB - yearA;
  });

  return filtered;
}