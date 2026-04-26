import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchPersonPageData } from '../services/Actors_Directors_Service';
import Navbar from '../components/navbar';
import '../css/actors_directors.css';

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

    if (personId) loadPerson();
  }, [personId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="person-page">
          <p className="person-status">Loading...</p>
        </main>
      </>
    );
  }

  if (error || !person) {
    return (
      <>
        <Navbar />
        <main className="person-page">
          <p className="person-status">{error || 'Person not found.'}</p>
          <Link className="person-back" to="/browse">
            ← Back to Browse
          </Link>
        </main>
      </>
    );
  }

  const roleType =
    isActor && isDirector
      ? 'Actor • Director'
      : isActor
      ? 'Actor'
      : isDirector
      ? 'Director'
      : 'Person';

  const filmography = [
    ...actorCredits.map((credit) => ({
      ...credit,
      roleLabel: credit.character ? `as ${credit.character}` : 'Actor',
    })),
    ...directorCredits.map((credit) => ({
      ...credit,
      roleLabel: 'Director',
    })),
  ];

  const knownFor =
    filmography
      .slice(0, 3)
      .map((credit) => credit.title)
      .join(', ') || 'N/A';

  return (
    <>
      <Navbar />

      <main className="person-page">
        <section className="person-topbar">
          <Link className="person-back" to="/browse">
            ← Back to Actors
          </Link>
        </section>

        <section className="person-hero">
          <div className="person-avatar"></div>

          <div className="person-heading">
            <h1>{person.name}</h1>
            <span>{roleType}</span>
          </div>
        </section>

        <section className="person-bio">
          <h2>Biography</h2>
          <p>
            {person.biography ||
              `${person.name} is listed in the Movies 4 US database. Further biography information is not currently available.`}
            <strong> Read More</strong>
          </p>
        </section>

        <section className="person-info-card">
          <div className="person-info-grid">
            <div>
              <p>Birth Date</p>
              <strong>{person.birth_date || person.birthday || 'N/A'}</strong>
            </div>

            <div>
              <p>Nationality</p>
              <strong>{person.nationality || person.place_of_birth || 'N/A'}</strong>
            </div>

            <div className="known-for">
              <p>Known For</p>
              <strong>{knownFor}</strong>
            </div>
          </div>
        </section>

        {filmography.length > 0 && (
          <section className="filmography-section">
            <p className="section-label">FILMOGRAPHY</p>

            <div className="filmography-grid">
              {filmography.map((credit, index) => (
                <Link
                  to={`/movie/${credit.movie_id}`}
                  className="film-card"
                  key={`${credit.movie_id}-${credit.roleLabel}-${index}`}
                >
                  <div className="film-poster"></div>
                  <h3>{credit.title}</h3>
                  <p>{credit.release_year ?? 'N/A'}</p>
                  <span>{credit.roleLabel}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {!isActor && !isDirector && (
          <section className="empty-person-section">
            <p>No actor or director data found for this person.</p>
          </section>
        )}
      </main>
    </>
  );
}