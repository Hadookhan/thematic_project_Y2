import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import '../css/home.css';
import Navbar from '../components/navbar';
import { Link } from 'react-router-dom';

export default function Home() {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [featuredRating, setFeaturedRating] = useState(null);
  const [featuredGenres, setFeaturedGenres] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchRating(movieId) {
    const { data, error } = await supabase
      .from('ratings')
      .select('rating, movie_id')
      .eq('movie_id', movieId);

    if (error || !data || data.length === 0) return null;

    const avg = data.reduce((sum, row) => sum + Number(row.rating), 0) / data.length;
    return avg.toFixed(1);
  }

  async function fetchGenre(movieId) {
    const { data: movieGenreRows, error: movieGenreError } = await supabase
      .from('movie_genres')
      .select('genre_id')
      .eq('movie_id', movieId);

    if (movieGenreError || !movieGenreRows || movieGenreRows.length === 0) return [];

    const genreIds = movieGenreRows.map((row) => row.genre_id);

    const { data: genreRows, error: genreError } = await supabase
      .from('genres')
      .select('genre_id, name')
      .in('genre_id', genreIds);

    if (genreError) return [];

    return genreRows?.map((row) => row.name) ?? [];
  }

  async function enrichMovies(movies) {
    return Promise.all(
      (movies || []).map(async (movie) => {
        const rating = await fetchRating(movie.movie_id);
        const genres = await fetchGenre(movie.movie_id);

        return {
          ...movie,
          rating,
          genres,
        };
      })
    );
  }

  async function searchQuery(inputStr) {
    if (!inputStr.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError('');

    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .ilike('title', `%${inputStr}%`)
      .limit(12);

    if (error) {
      setError('Failed to search movies.');
      setSearchResults([]);
      setLoading(false);
      return;
    }

    const enrichedResults = await enrichMovies(data);
    setSearchResults(enrichedResults);
    setLoading(false);
  }

  function clearData() {
    setSearchInput('');
    setSearchResults([]);
    setError('');
  }

  useEffect(() => {
    async function loadHomeData() {
      setLoading(true);
      setError('');

      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .limit(8);

      if (error) {
        setError('Failed to load movies.');
        setLoading(false);
        return;
      }

      const enrichedMovies = await enrichMovies(data);

      setFeaturedMovie(enrichedMovies[0]);
      setFeaturedRating(enrichedMovies[0]?.rating ?? null);
      setFeaturedGenres(enrichedMovies[0]?.genres ?? []);
      setTrendingMovies(enrichedMovies.slice(1));
      setLoading(false);
    }

    loadHomeData();
  }, []);

  async function handleSearch(e) {
    e.preventDefault();
    await searchQuery(searchInput);
  }

  const displayMovies = searchResults.length > 0 ? searchResults : trendingMovies;

  return (
    <>
    <Navbar />
    <main className="home-shell">

      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h2>{featuredMovie?.title ?? 'Interstellar'}</h2>

            <div className="hero-meta">
              <span className="genre-pill">
                {featuredGenres?.[0] ?? 'Sci-Fi'}
              </span>
              <span className="rating">
                ⭐ {featuredRating ?? '8.7'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="search-section">
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit">Search</button>
          <button type="button" onClick={clearData}>
            Clear
          </button>
        </form>
      </section>

      {error && <p className="status-text">{error}</p>}
      {loading && <p className="status-text">Loading...</p>}

      <section className="movie-section">
        <div className="section-header">
          <div>
            <p>TRENDING</p>
            <h2>{searchResults.length > 0 ? 'Search Results' : 'This Week'}</h2>
          </div>
          <a href="/browse">See All ›</a>
        </div>

        <div className="movie-grid">
          {displayMovies.length > 0 ? (
            displayMovies.map((movie) => (
              <Link
                to={`/movie/${movie.movie_id}`}
                key={movie.movie_id}
                className="movie-card-link"
              >
                <article className="movie-card">
                  <div className="poster-placeholder">
                    <button className="bookmark">♡</button>
                  </div>

                  <h3>{movie.title}</h3>

                  <div className="movie-info">
                    <span>{movie.release_year ?? movie.year ?? '2024'}</span>
                    <span>⭐ {movie.rating ?? 'N/A'}</span>
                  </div>

                  <p className="movie-genres">
                    {movie.genres?.length > 0
                      ? movie.genres.join(', ')
                      : 'No genres'}
                  </p>
                </article>
              </Link>
            ))
          ) : (
            !loading && <p className="status-text">No movies found.</p>
          )}
        </div>
      </section>
    </main>
    </>
  );
}