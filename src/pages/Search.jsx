import { Link } from 'react-router-dom';
import { useState } from 'react';
import { runSearch, clearSearchData } from '../services/searchService';
import '../css/search.css';
import Navbar from '../components/navbar';

export default function Search() {
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState('all');

  const [movieResults, setMovieResults] = useState([]);
  const [peopleResults, setPeopleResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // SEARCH
  async function handleSearch(e) {
    e.preventDefault();

    if (!searchInput.trim()) {
      setMovieResults([]);
      setPeopleResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setHasSearched(true);

      const results = await runSearch(searchInput, searchType);

      setMovieResults(results.movies || []);
      setPeopleResults(results.people || []);
    } catch (err) {
      console.error(err);
      setError('Failed to perform search.');
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    const cleared = clearSearchData();

    setSearchInput(cleared.searchInput);
    setSearchType(cleared.searchType);
    setMovieResults([]);
    setPeopleResults([]);
    setError('');
    setHasSearched(false);
  }

  const noResults =
    hasSearched &&
    !loading &&
    movieResults.length === 0 &&
    peopleResults.length === 0;

  return (
    <>
    <Navbar />
    <div className="search-page">

      {/* SEARCH UI*/}
      <div className="search-container">
        <h1 className="search-title">Search</h1>

        <form onSubmit={handleSearch} className="search-form">
          <input
            className="search-input"
            type="text"
            placeholder="Search movies or actors..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <select
            className="search-select"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="movies">Movies</option>
            <option value="people">Actors / Directors</option>
          </select>

          <button className="search-btn" type="submit">
            Search
          </button>

          <button className="clear-btn" type="button" onClick={handleClear}>
            Clear
          </button>
        </form>

        {/* STATES */}
        {error && <p className="error">{error}</p>}
        {loading && <p className="loading">Searching...</p>}

        {/* ─────────────────────────────
            NO RESULTS MESSAGE
        ───────────────────────────── */}
        {noResults && (
          <div className="no-results">
            <div className="no-results-icon">🎬</div>
            <h2>No Results Found</h2>
            <p>No matches for "{searchInput}"</p>
            <button onClick={handleClear}>Try Again</button>
          </div>
        )}

       {/* MOVIES */}
{!loading && movieResults.length > 0 && (
  <section className="results-section">
    <h2>Movies</h2>

    <div className="results-grid">
      {movieResults.map((movie) => (
        <Link
          key={movie.movie_id}
          to={`/movie/${movie.movie_id}`}
          className="card"
        >
          <h3>{movie.title}</h3>

          <p className="movie-overview">
            {movie.overview || 'No overview available.'}
          </p>

          <div className="movie-meta">
            <span>📅 {movie.release_year ?? 'N/A'}</span>
            <span>⏱ {movie.runtime ?? 'N/A'} mins</span>
          </div>

          <div className="movie-meta">
            <span>⭐ {movie.rating ?? 'N/A'}</span>
          </div>

          <div className="movie-genres">
            {movie.genres?.length > 0
              ? movie.genres.map((genre, i) => (
                  <span key={i} className="genre-pill">
                    {genre}
                  </span>
                ))
              : <span className="genre-pill">N/A</span>}
          </div>
        </Link>
      ))}
    </div>
  </section>
)}

        {/* ACTORS & DIRECTORS*/}
        {!loading && peopleResults.length > 0 && (
          <section className="results-section">
            <h2>Actors & Directors</h2>

            <div className="results-grid">
              {peopleResults.map((person) => (
                <Link
                  key={person.person_id}
                  to={`/person/${person.person_id}`}
                  className="card"
                >
                  <h3>{person.name}</h3>
                  <p>{person.roleLabel}</p>
                  <p>
                    🎭 {person.actingCount} • 🎬 {person.directingCount}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
    </>
  );
}