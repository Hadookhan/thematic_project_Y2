import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchMoviePageData } from '../services/movieService';
import Navbar from '../components/navbar';

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

    if (movieId) {
      loadMovie();
    }
  }, [movieId]);

  if (loading) {
    return (
      <div className="movie-page">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-page">
        <p>{error}</p>
        <Link to="/browse">Back to Browse</Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="movie-page">
        <p>Movie not found.</p>
        <Link to="/browse">Back to Browse</Link>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="movie-page">
      <Link to="/browse">← Back to Browse</Link>

      <h1>{movie.title}</h1>

      <p><strong>Overview:</strong> {movie.overview || 'No overview available.'}</p>
      <p><strong>Release Date:</strong> {movie.release_date || 'N/A'}</p>
      <p><strong>Release Year:</strong> {movie.release_year || 'N/A'}</p>
      <p><strong>Runtime:</strong> {movie.runtime ?? 'N/A'} mins</p>
      <p><strong>Budget:</strong> {movie.budget ?? 'N/A'}</p>
      <p><strong>Revenue:</strong> {movie.revenue ?? 'N/A'}</p>
      <p><strong>Rating:</strong> {rating ?? 'N/A'}</p>
      <p>
        <strong>Genres:</strong>{' '}
        {genres.length > 0 ? genres.join(', ') : 'N/A'}
      </p>

      <section>
        <h2>Cast</h2>
        {cast.length > 0 ? (
          <ul>
            {cast.map((member) => (
              <li key={`${member.person_id}-${member.cast_order}`}>
                <Link to={`/person/${member.person_id}`}>{member.name}</Link>
                {` as ${member.character || 'Unknown Character'}`}
              </li>
            ))}
          </ul>
        ) : (
          <p>No cast information available.</p>
        )}
      </section>

      <section>
        <h2>Crew</h2>
        {crew.length > 0 ? (
          <ul>
            {crew.map((member, index) => (
              <li key={`${member.person_id}-${member.job}-${index}`}>
                <Link to={`/person/${member.person_id}`}>{member.name}</Link>
                {` - ${member.job || 'Unknown Job'} (${member.department || 'Unknown Department'})`}
              </li>
            ))}
          </ul>
        ) : (
          <p>No crew information available.</p>
        )}
      </section>

      <section>
        <h2>External Links</h2>
        {links ? (
          <div>
            <p>IMDb ID: {links.imdb_id || 'N/A'}</p>
            <p>TMDb ID: {links.tmdb_id || 'N/A'}</p>
          </div>
        ) : (
          <p>No external links available.</p>
        )}
      </section>
    </div>
    </>
  );
}