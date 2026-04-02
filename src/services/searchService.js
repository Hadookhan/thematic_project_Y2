import { supabase } from '../lib/supabase';

// -----------------------------------
// clear_data(data_box)
// -----------------------------------
export function clearSearchData() {
  return {
    searchInput: '',
    searchType: 'all',
    results: {
      movies: [],
      people: [],
    },
    error: '',
  };
}

// -----------------------------------
// string_to_query(string, col, table)
// safe query descriptor
// -----------------------------------
export function stringToQuery(value, column, table) {
  return {
    value: String(value).trim(),
    column,
    table,
  };
}

// -----------------------------------
// add_to_query(cur_query, new_query)
// -----------------------------------
export function addToQuery(currentQuery, newQuery) {
  if (!currentQuery) return [newQuery];
  return [...currentQuery, newQuery];
}

// -----------------------------------
// fetch movie rating
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
// fetch movie genres
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
    .select('name')
    .in('genre_id', genreIds);

  if (genreError) {
    console.error('Error fetching genres:', genreError.message);
    return [];
  }

  return genreRows?.map((row) => row.name) ?? [];
}

// -----------------------------------
// search_query(input_str, target_col, table)
// generic movie search
// -----------------------------------
export async function searchMovies(inputStr, targetCol = 'title', table = 'movies') {
  const trimmed = inputStr.trim();

  if (!trimmed) return [];

  const { data, error } = await supabase
    .from(table)
    .select(`
      movie_id,
      title,
      overview,
      release_date,
      release_year,
      runtime
    `)
    .ilike(targetCol, `%${trimmed}%`)
    .order('release_year', { ascending: false });

  if (error) {
    console.error('Movie search error:', error.message);
    throw new Error('Failed to search movies.');
  }

  const enriched = await Promise.all(
    (data || []).map(async (movie) => {
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

  return enriched;
}

// -----------------------------------
// search people by name
// finds actors/directors/crew in people table
// -----------------------------------
export async function searchPeople(inputStr) {
  const trimmed = inputStr.trim();

  if (!trimmed) return [];

  const { data, error } = await supabase
    .from('people')
    .select('person_id, name')
    .ilike('name', `%${trimmed}%`)
    .order('name', { ascending: true });

  if (error) {
    console.error('People search error:', error.message);
    throw new Error('Failed to search people.');
  }

  const enriched = await Promise.all(
    (data || []).map(async (person) => {
      const [castRows, directorRows] = await Promise.all([
        supabase
          .from('cast_credits')
          .select('movie_id', { count: 'exact', head: false })
          .eq('person_id', person.person_id),
        supabase
          .from('crew_credits')
          .select('movie_id', { count: 'exact', head: false })
          .eq('person_id', person.person_id)
          .eq('job', 'Director'),
      ]);

      const actingCount = castRows.data?.length ?? 0;
      const directingCount = directorRows.data?.length ?? 0;

      let roleLabel = 'Person';

      if (actingCount > 0 && directingCount > 0) {
        roleLabel = 'Actor / Director';
      } else if (actingCount > 0) {
        roleLabel = 'Actor';
      } else if (directingCount > 0) {
        roleLabel = 'Director';
      }

      return {
        ...person,
        actingCount,
        directingCount,
        roleLabel,
      };
    })
  );

  return enriched;
}

// -----------------------------------
// global search
// -----------------------------------
export async function runSearch(inputStr, searchType = 'all') {
  const trimmed = inputStr.trim();

  if (!trimmed) {
    return {
      movies: [],
      people: [],
    };
  }

  if (searchType === 'movies') {
    const movies = await searchMovies(trimmed, 'title', 'movies');
    return { movies, people: [] };
  }

  if (searchType === 'people') {
    const people = await searchPeople(trimmed);
    return { movies: [], people };
  }

  const [movies, people] = await Promise.all([
    searchMovies(trimmed, 'title', 'movies'),
    searchPeople(trimmed),
  ]);

  return {
    movies,
    people,
  };
}