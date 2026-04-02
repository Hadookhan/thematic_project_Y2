import { supabase } from '../lib/supabase';

// -----------------------------------
// fetch single movie by movie_id
// -----------------------------------
export async function fetchMovieById(movieId) {
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
    .eq('movie_id', movieId)
    .single();

  if (error) {
    console.error('Error fetching movie:', error.message);
    throw new Error('Failed to fetch movie.');
  }

  return data;
}

// -----------------------------------
// fetch average rating for a movie
// -----------------------------------
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

// -----------------------------------
// fetch genre names for a movie
// -----------------------------------
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
    .select('genre_id, name')
    .in('genre_id', genreIds);

  if (genreError) {
    console.error('Error fetching genres:', genreError.message);
    return [];
  }

  return genreRows?.map((row) => row.name) ?? [];
}

// -----------------------------------
// fetch cast for a movie
// cast_credits joins people
// -----------------------------------
export async function fetchCast(movieId) {
  const { data, error } = await supabase
    .from('cast_credits')
    .select(`
      person_id,
      character,
      cast_order,
      people (
        name
      )
    `)
    .eq('movie_id', movieId)
    .order('cast_order', { ascending: true });

  if (error) {
    console.error('Error fetching cast:', error.message);
    return [];
  }

  return (data || []).map((row) => ({
    person_id: row.person_id,
    character: row.character,
    cast_order: row.cast_order,
    name: row.people?.name ?? 'Unknown',
  }));
}

// -----------------------------------
// fetch crew for a movie
// crew_credits joins people
// -----------------------------------
export async function fetchCrew(movieId) {
  const { data, error } = await supabase
    .from('crew_credits')
    .select(`
      person_id,
      job,
      department,
      people (
        name
      )
    `)
    .eq('movie_id', movieId)
    .order('department', { ascending: true });

  if (error) {
    console.error('Error fetching crew:', error.message);
    return [];
  }

  return (data || []).map((row) => ({
    person_id: row.person_id,
    job: row.job,
    department: row.department,
    name: row.people?.name ?? 'Unknown',
  }));
}

// -----------------------------------
// fetch imdb/tmdb links
// -----------------------------------
export async function fetchMovieLinks(movieId) {
  const { data, error } = await supabase
    .from('links')
    .select('imdb_id, tmdb_id')
    .eq('movie_id', movieId)
    .single();

  if (error) {
    console.error('Error fetching movie links:', error.message);
    return null;
  }

  return data;
}

// -----------------------------------
// load all movie page data together
// -----------------------------------
export async function fetchMoviePageData(movieId) {
  const [movie, rating, genres, cast, crew, links] = await Promise.all([
    fetchMovieById(movieId),
    fetchRating(movieId),
    fetchGenre(movieId),
    fetchCast(movieId),
    fetchCrew(movieId),
    fetchMovieLinks(movieId),
  ]);

  return {
    movie,
    rating,
    genres,
    cast,
    crew,
    links,
  };
}