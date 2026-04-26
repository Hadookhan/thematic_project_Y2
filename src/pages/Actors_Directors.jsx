import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchPersonPageData } from '../services/Actors_Directors_Service';
import Navbar from '../components/navbar';

export default function Actors_Directors() {
  const { personId } = useParams();

  const [person, setPerson] = useState(null);
  const [actorCredits, setActorCredits] = useState([]);
  const [directorCredits, setDirectorCredits] = useState([]);
  const [isActor, setIsActor] = useState(false);
  const [isDirector, setIsDirector] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPerson() {
      try {
        setLoading(true);
        setError('');

        const data = await fetchPersonPageData(personId);

        setPerson(data.person);
        setActorCredits(data.actorCredits);
        setDirectorCredits(data.directorCredits);
        setIsActor(data.isActor);
        setIsDirector(data.isDirector);
      } catch (err) {
        console.error(err);
        setError('Failed to load person details.');
      } finally {
        setLoading(false);
      }
    }

    if (personId) {
      loadPerson();
    }
  }, [personId]);

  if (loading) {
    return (
      <div className="person-page">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="person-page">
        <p>{error}</p>
        <Link to="/browse">Back to Browse</Link>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="person-page">
        <p>Person not found.</p>
        <Link to="/browse">Back to Browse</Link>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="person-page">
      <Link to="/browse">← Back to Browse</Link>

      <h1>{person.name}</h1>

      <p>
        <strong>Role Type:</strong>{' '}
        {isActor && isDirector
          ? 'Actor / Director'
          : isActor
          ? 'Actor'
          : isDirector
          ? 'Director'
          : 'Person'}
      </p>

      {isActor && (
        <section>
          <h2>Acting Credits</h2>
          {actorCredits.length > 0 ? (
            <ul>
              {actorCredits.map((credit, index) => (
                <li key={`${credit.movie_id}-${index}`}>
                  <Link to={`/movie/${credit.movie_id}`}>
                    {credit.title}
                  </Link>
                  {' '}
                  ({credit.release_year ?? 'N/A'})
                  {credit.character ? ` — as ${credit.character}` : ''}
                </li>
              ))}
            </ul>
          ) : (
            <p>No acting credits found.</p>
          )}
        </section>
      )}

      {isDirector && (
        <section>
          <h2>Directed Movies</h2>
          {directorCredits.length > 0 ? (
            <ul>
              {directorCredits.map((credit, index) => (
                <li key={`${credit.movie_id}-${index}`}>
                  <Link to={`/movie/${credit.movie_id}`}>
                    {credit.title}
                  </Link>
                  {' '}
                  ({credit.release_year ?? 'N/A'})
                </li>
              ))}
            </ul>
          ) : (
            <p>No directing credits found.</p>
          )}
        </section>
      )}

      {!isActor && !isDirector && (
        <section>
          <p>No actor or director data found for this person.</p>
        </section>
      )}
    </div>
    </>
  );
}