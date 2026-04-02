import { Link } from 'react-router-dom';
import { useState } from 'react';
import { runSearch, clearSearchData } from '../services/searchService';

export default function Search() {
  const [searchInput, setSearchInput] = useState('');
  const [searchType, setSearchType] = useState('all');

  const [movieResults, setMovieResults] = useState([]);
  const [peopleResults, setPeopleResults] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(e) {
    e.preventDefault();

    if (!searchInput.trim()) {
      setMovieResults([]);
      setPeopleResults([]);
      setError('');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const results = await runSearch(searchInput, searchType);

      setMovieResults(results.movies);
      setPeopleResults(results.people);
    } catch (err) {
      console.error(err);
      setError('Failed to perform search.');
      setMovieResults([]);
      setPeopleResults([]);
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    const cleared = clearSearchData();

    setSearchInput(cleared.searchInput);
    setSearchType(cleared.searchType);
    setMovieResults(cleared.results.movies);
    setPeopleResults(cleared.results.people);
    setError(cleared.error);
  }

  return (
    <div className="search-page">
      <h1>Search</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search movies or people..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="movies">Movies</option>
          <option value="people">Actors / Directors</option>
        </select>

        <button type="submit">Search</button>
        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </form>

      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && !error && movieResults.length === 0 && peopleResults.length === 0 && (
        <p>No results yet.</p>
      )}

      {movieResults.length > 0 && (
        <section>
          <h2>Movies</h2>
          <div>
            {movieResults.map((movie) => (
              <div key={movie.movie_id} className="movie-card">
                <Link to={`/movie/${movie.movie_id}`}>
                  <h3>{movie.title}</h3>
                </Link>

                <p>{movie.overview || 'No overview available.'}</p>
                <p>Year: {movie.release_year ?? 'N/A'}</p>
                <p>Runtime: {movie.runtime ?? 'N/A'} mins</p>
                <p>Rating: {movie.rating ?? 'N/A'}</p>
                <p>
                  Genres:{' '}
                  {movie.genres?.length > 0 ? movie.genres.join(', ') : 'N/A'}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {peopleResults.length > 0 && (
        <section>
          <h2>Actors / Directors</h2>
          <div>
            {peopleResults.map((person) => (
              <div key={person.person_id} className="person-card">
                <Link to={`/person/${person.person_id}`}>
                  <h3>{person.name}</h3>
                </Link>

                <p>Role: {person.roleLabel}</p>
                <p>Acting credits: {person.actingCount}</p>
                <p>Directed movies: {person.directingCount}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}