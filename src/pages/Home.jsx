import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [featuredRating, setFeaturedRating] = useState(null);
  const [featuredGenres, setFeaturedGenres] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [toggleState, setToggleState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // ----------------------------------------
  // fetch_rating(movie_id)
  // ratings table is separate
  // ----------------------------------------
  async function fetchRating(movieId) {
    const { data, error } = await supabase
      .from('ratings')
      .select('rating')
      .eq('movie_id', movieId)
      .single();

    if (error) {
      console.error('Error fetching rating:', error.message);
      return null;
    }

    return data?.rating ?? null;
  }

  // ----------------------------------------
  // fetch_genre(movie_id)
  // uses movie_genres junction table + genres table
  // ----------------------------------------
  async function fetchGenre(movieId) {
    // Step 1: get genre ids linked to the movie
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

    // Step 2: get genre names from genres table
    const { data: genreRows, error: genreError } = await supabase
      .from('genres')
      .select('genre_id, name')
      .in('genre_id', genreIds);

    if (genreError) {
      console.error('Error fetching genres:', genreError.message);
      return [];
    }

    return genreRows?.map((row) => row.genre_name) ?? [];
  }

  // ----------------------------------------
  // clear_data(data_box)
  // ----------------------------------------
  function clearData() {
    setSearchInput('');
    setSearchResults([]);
    setError('');
  }

  // ----------------------------------------
  // string_to_query(string, col, table)
  // safer frontend version
  // ----------------------------------------
  function stringToQuery(string, col, table) {
    return {
      value: string.trim(),
      column: col,
      table: table,
    };
  }

  // ----------------------------------------
  // add_to_query(cur_query, new_query)
  // safer frontend version
  // ----------------------------------------
  function addToQuery(curQuery, newQuery) {
    if (!curQuery) return [newQuery];
    return [...curQuery, newQuery];
  }

  // ----------------------------------------
  // search_query(input_str, target_col, table)
  // searches movies by title
  // ----------------------------------------
  async function searchQuery(inputStr, targetCol, table) {
    if (!inputStr.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .ilike(targetCol, `%${inputStr}%`);

    if (error) {
      console.error('Search error:', error.message);
      setError('Failed to search movies.');
      setSearchResults([]);
      setLoading(false);
      return;
    }

    // attach rating + genres to each movie result
    const enrichedResults = await Promise.all(
      (data || []).map(async (movie) => {
        const rating = await fetchRating(movie.movie_id);
        const genres = await fetchGenre(movie.movie_id);

        return {
          ...movie,
          rating,
          genres,
        };
      })
    );

    setSearchResults(enrichedResults);
    setLoading(false);
  }

  // ----------------------------------------
  // toggle_on_off()
  // ----------------------------------------
  function toggleOnOff() {
    setToggleState((prev) => !prev);
  }

  // ----------------------------------------
  // load featured movie on page load
  // ----------------------------------------
  useEffect(() => {
    async function loadFeaturedMovie() {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error loading featured movie:', error.message);
        setError('Failed to load featured movie.');
        setLoading(false);
        return;
      }

      const rating = await fetchRating(data.movie_id);
      const genres = await fetchGenre(data.movie_id);

      setFeaturedMovie(data);
      setFeaturedRating(rating);
      setFeaturedGenres(genres);
      setLoading(false);
    }

    loadFeaturedMovie();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    await searchQuery(searchInput, 'title', 'movies');
  }

  return (
    <div className="home-page">
      <h1>Home</h1>

      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>}

      <section>
        <h2>Featured Movie</h2>
        {featuredMovie ? (
          <div>
            <h3>{featuredMovie.title}</h3>
            <p>Rating: {featuredRating ?? 'N/A'}</p>
            <p>
              Genres:{' '}
              {featuredGenres.length > 0 ? featuredGenres.join(', ') : 'N/A'}
            </p>
          </div>
        ) : (
          !loading && <p>No featured movie found.</p>
        )}
      </section>

      <section>
        <h2>Search Movies</h2>

        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by title..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit">Search</button>
          <button type="button" onClick={clearData}>
            Clear
          </button>
        </form>

        <div>
          {searchResults.length > 0 ? (
            searchResults.map((movie) => (
              <div key={movie.movie_id}>
                <h4>{movie.title}</h4>
                <p>Year: {movie.year ?? 'N/A'}</p>
                <p>Rating: {movie.rating ?? 'N/A'}</p>
                <p>
                  Genres:{' '}
                  {movie.genres?.length > 0 ? movie.genres.join(', ') : 'N/A'}
                </p>
              </div>
            ))
          ) : (
            !loading && <p>No search results.</p>
          )}
        </div>
      </section>

      <section>
        <h2>Toggle Example</h2>
        <button onClick={toggleOnOff}>
          Toggle is {toggleState ? 'ON' : 'OFF'}
        </button>
      </section>
    </div>
  );
}
