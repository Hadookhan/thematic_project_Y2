import { useEffect, useState } from 'react';
import {
  browseMovies,
  fetchAllGenres,
  clearBrowseData,
} from '../services/browseService';
import { Link } from 'react-router-dom';

export default function Browse() {
  const [movies, setMovies] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);

  const [searchInput, setSearchInput] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [minRating, setMinRating] = useState('');

  const [toggleState, setToggleState] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function toggleOnOff() {
    setToggleState((prev) => !prev);
  }

  function handleClear() {
    const cleared = clearBrowseData();

    setSearchInput(cleared.searchInput);
    setSelectedGenre(cleared.selectedGenre);
    setMinYear(cleared.minYear);
    setMaxYear(cleared.maxYear);
    setMinRating(cleared.minRating);
    setMovies(cleared.results);
    setError(cleared.error);
  }

  async function loadBrowseData() {
    try {
      setLoading(true);
      setError('');

      const results = await browseMovies({
        searchInput,
        selectedGenre,
        minYear,
        maxYear,
        minRating,
      });

      setMovies(results);
    } catch (err) {
      console.error(err);
      setError('Failed to load browse results.');
      setMovies([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadGenres() {
      try {
        const genres = await fetchAllGenres();
        setGenreOptions(genres);
      } catch (err) {
        console.error(err);
      }
    }

    loadGenres();
    loadBrowseData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    await loadBrowseData();
  }

  return (
    <div className="browse-page">
      <h1>Browse Movies</h1>

      {error && <p>{error}</p>}
      {loading && <p>Loading...</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          <option value="">All Genres</option>
          {genreOptions.map((genre) => (
            <option key={genre.genre_id} value={genre.name}>
              {genre.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Year"
          value={minYear}
          onChange={(e) => setMinYear(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Year"
          value={maxYear}
          onChange={(e) => setMaxYear(e.target.value)}
        />

        <input
          type="number"
          step="0.1"
          min="0"
          max="10"
          placeholder="Min Rating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        />

        <button type="submit">Apply</button>
        <button type="button" onClick={handleClear}>
          Clear
        </button>
      </form>

      <section>
        <h2>Toggle Example</h2>
        <button onClick={toggleOnOff}>
          Toggle is {toggleState ? 'ON' : 'OFF'}
        </button>
      </section>

      <section>
        <h2>Results</h2>

        {movies.length > 0 ? (
          movies.map((movie) => (
            <Link to={`/movie/${movie.movie_id}`}>
                <div className="movie-card">
                    <h3>{movie.title}</h3>
                    <p>{movie.overview || 'No overview available.'}</p>
                    <p>Year: {movie.release_year ?? 'N/A'}</p>
                    <p>Runtime: {movie.runtime ?? 'N/A'} mins</p>
                    <p>Rating: {movie.rating ?? 'N/A'}</p>
                    <p>
                    Genres: {movie.genres?.length > 0 ? movie.genres.join(', ') : 'N/A'}
                    </p>
                </div>
            </Link>
          ))
        ) : (
          !loading && <p>No movies found.</p>
        )}
      </section>
    </div>
  );
}