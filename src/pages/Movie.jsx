import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchMoviePageData } from '../services/movieService';
import Navbar from '../components/navbar';
import '../css/movie.css';

export default function Movie() {
  const { movieId } = useParams();

  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(null);
  const [genres, setGenres] = useState([]);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [links, setLinks] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadMovie() {
      try {
        setLoading(true);
        setError('');

        const data = await fetchMoviePageData(movieId);

        setMovie(data.movie);
        setRating(data.rating);
        setGenres(data.genres);
        setCast(data.cast);
        setCrew(data.crew);
        setLinks(data.links);
      } catch (err) {
        console.error(err);
        setError('Failed to load movie.');
      } finally {
        setLoading(false);
      }
    }

    if (movieId) loadMovie();
  }, [movieId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="movie-page">
          <p className="movie-status">Loading...</p>
        </main>
      </>
    );
  }

  if (error || !movie) {
    return (
      <>
        <Navbar />
        <main className="movie-page">
          <p className="movie-status">{error || 'Movie not found.'}</p>
          <Link className="back-link" to="/browse">← Back to Browse</Link>
        </main>
      </>
    );
  }

  const director =
    crew.find((member) => member.job?.toLowerCase() === 'director')?.name || 'N/A';

  const mainCast = cast.slice(0, 3).map((member) => member.name).join(', ') || 'N/A';

  const releaseText =
    movie.release_date ||
    movie.release_year ||
    'N/A';

  const formatMoney = (value) => {
    if (!value) return 'N/A';
    return `$${Number(value).toLocaleString()}`;
  };

  return (
    <>
      <Navbar />

      <main className="movie-page">
        <Link className="back-link" to="/browse">← Back to Browse</Link>

        <section className="movie-hero">
          <Link to="/browse" className="close-btn">×</Link>

          <div className="poster-box"></div>

          <div className="movie-main-info">
            <h1>{movie.title}</h1>
            <p className="movie-year">{movie.release_year || 'N/A'}</p>

            <p className="movie-rating">
              ⭐ <strong>{rating ?? 'N/A'}</strong> <span>/10</span>
            </p>
          </div>
        </section>

        <section className="genre-row">
          {genres.length > 0 ? (
            genres.map((genre) => (
              <span key={genre} className="genre-chip">{genre}</span>
            ))
          ) : (
            <span className="genre-chip">No genres</span>
          )}
        </section>

        <section className="movie-stats">
          <div>
            <span>⏱</span>
            <p>Runtime</p>
            <strong>{movie.runtime ? `${movie.runtime}m` : 'N/A'}</strong>
          </div>

          <div>
            <span>🌐</span>
            <p>Country</p>
            <strong>{movie.production_countries || movie.country || 'N/A'}</strong>
          </div>

          <div>
            <span>文</span>
            <p>Language</p>
            <strong>{movie.original_language || movie.language || 'N/A'}</strong>
          </div>

          <div>
            <span>🗓</span>
            <p>Released</p>
            <strong>{releaseText}</strong>
          </div>
        </section>

        <section className="synopsis">
          <h2>Synopsis</h2>
          <p>
            {movie.overview || 'No overview available.'}
            {movie.overview && <span> Read More</span>}
          </p>
        </section>

        <section className="details-card">
          <div className="detail-row">
            <span>Director</span>
            <strong>{director}</strong>
          </div>

          <div className="detail-row">
            <span>Main Cast</span>
            <strong>{mainCast}</strong>
          </div>

          <div className="detail-row">
            <span>Genre</span>
            <strong>{genres.length > 0 ? genres.join(', ') : 'N/A'}</strong>
          </div>

          <div className="detail-row">
            <span>Budget</span>
            <strong>{formatMoney(movie.budget)}</strong>
          </div>

          <div className="detail-row">
            <span>Box Office</span>
            <strong>{formatMoney(movie.revenue)}</strong>
          </div>

          <div className="detail-row">
            <span>External Links</span>
            <strong>
              IMDb: {links?.imdb_id || 'N/A'} | TMDb: {links?.tmdb_id || 'N/A'}
            </strong>
          </div>
        </section>

        <button className="watchlist-btn">＋ Add to Watchlist</button>

        <section className="full-details">
          <h2>View Full Details</h2>

          <div className="list-section">
            <h3>Cast</h3>
            {cast.length > 0 ? (
              cast.map((member) => (
                <p key={`${member.person_id}-${member.cast_order}`}>
                  <Link to={`/person/${member.person_id}`}>{member.name}</Link>
                  {` as ${member.character || 'Unknown Character'}`}
                </p>
              ))
            ) : (
              <p>No cast information available.</p>
            )}
          </div>

          <div className="list-section">
            <h3>Crew</h3>
            {crew.length > 0 ? (
              crew.map((member, index) => (
                <p key={`${member.person_id}-${member.job}-${index}`}>
                  <Link to={`/person/${member.person_id}`}>{member.name}</Link>
                  {` - ${member.job || 'Unknown Job'} (${member.department || 'Unknown Department'})`}
                </p>
              ))
            ) : (
              <p>No crew information available.</p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}