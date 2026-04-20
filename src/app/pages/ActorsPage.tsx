/**
 * Directors/Actors Database Page
 *
 * This is a template ready for Supabase integration.
 * Replace SAMPLE_ACTORS with your actual database queries.
 *
 * Features:
 * - Search by name
 * - Filter by profession (actors/directors) and genre
 * - Sort by name, awards, or movie count
 * - Click on any person to view their detailed filmography
 */

import { useState } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Movie {
  id: string;
  title: string;
  year: number;
  role?: string;
  character?: string;
  rating?: number;
}

interface Actor {
  id: string;
  name: string;
  profileImage?: string;
  knownFor?: string;
  birthDate?: string;
  birthPlace?: string;
  popularity?: number;
  movieCount?: number;
  genre?: string[];
  awards?: number;
  activeYears?: string;
  movies?: Movie[];
  biography?: string;
}

// Sample data for demonstration
const SAMPLE_ACTORS: Actor[] = [
  {
    id: '1',
    name: 'Christopher Nolan',
    knownFor: 'Director',
    birthPlace: 'London, England',
    movieCount: 12,
    genre: ['Sci-Fi', 'Thriller'],
    awards: 15,
    activeYears: '1998-Present',
    biography: 'Christopher Edward Nolan is a British-American film director, producer, and screenwriter known for his complex narratives and innovative filmmaking techniques.',
    movies: [
      { id: 'm1', title: 'Inception', year: 2010, role: 'Director', rating: 8.8 },
      { id: 'm2', title: 'The Dark Knight', year: 2008, role: 'Director', rating: 9.0 },
      { id: 'm3', title: 'Interstellar', year: 2014, role: 'Director', rating: 8.6 },
      { id: 'm4', title: 'Dunkirk', year: 2017, role: 'Director', rating: 7.8 },
      { id: 'm5', title: 'Tenet', year: 2020, role: 'Director', rating: 7.3 }
    ]
  },
  {
    id: '2',
    name: 'Leonardo DiCaprio',
    knownFor: 'Actor',
    birthPlace: 'Los Angeles, California',
    movieCount: 45,
    genre: ['Drama', 'Thriller'],
    awards: 42,
    activeYears: '1989-Present',
    biography: 'Leonardo Wilhelm DiCaprio is an American actor and film producer known for his work in biopics and period films.',
    movies: [
      { id: 'm6', title: 'Inception', year: 2010, role: 'Actor', character: 'Dom Cobb', rating: 8.8 },
      { id: 'm7', title: 'The Revenant', year: 2015, role: 'Actor', character: 'Hugh Glass', rating: 8.0 },
      { id: 'm8', title: 'Titanic', year: 1997, role: 'Actor', character: 'Jack Dawson', rating: 7.9 },
      { id: 'm9', title: 'The Wolf of Wall Street', year: 2013, role: 'Actor', character: 'Jordan Belfort', rating: 8.2 },
      { id: 'm10', title: 'Django Unchained', year: 2012, role: 'Actor', character: 'Calvin Candie', rating: 8.4 }
    ]
  },
  {
    id: '3',
    name: 'Greta Gerwig',
    // profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    knownFor: 'Director',
    birthPlace: 'Sacramento, California',
    movieCount: 8,
    genre: ['Comedy', 'Drama'],
    awards: 8,
    activeYears: '2006-Present'
  },
  {
    id: '4',
    name: 'Denzel Washington',
    knownFor: 'Actor',
    birthPlace: 'Mount Vernon, New York',
    movieCount: 60,
    genre: ['Action', 'Drama'],
    awards: 67,
    activeYears: '1977-Present',
    biography: 'Denzel Hayes Washington Jr. is an American actor, director, and producer known for his dramatic roles in film and theater.',
    movies: [
      { id: 'm11', title: 'Training Day', year: 2001, role: 'Actor', character: 'Alonzo Harris', rating: 7.7 },
      { id: 'm12', title: 'Glory', year: 1989, role: 'Actor', character: 'Private Trip', rating: 7.8 },
      { id: 'm13', title: 'Malcolm X', year: 1992, role: 'Actor', character: 'Malcolm X', rating: 7.7 },
      { id: 'm14', title: 'The Equalizer', year: 2014, role: 'Actor', character: 'Robert McCall', rating: 7.2 }
    ]
  },
  {
    id: '5',
    name: 'Kathryn Bigelow',
    // profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    knownFor: 'Director',
    birthPlace: 'San Carlos, California',
    movieCount: 15,
    genre: ['Action', 'Thriller'],
    awards: 22,
    activeYears: '1978-Present'
  },
  {
    id: '6',
    name: 'Tom Hanks',
    // profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    knownFor: 'Actor',
    birthPlace: 'Concord, California',
    movieCount: 80,
    genre: ['Drama', 'Comedy'],
    awards: 89,
    activeYears: '1979-Present'
  },
  {
    id: '7',
    name: 'Ava DuVernay',
    // profileImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
    knownFor: 'Director',
    birthPlace: 'Long Beach, California',
    movieCount: 10,
    genre: ['Drama', 'Documentary'],
    awards: 18,
    activeYears: '2005-Present'
  },
  {
    id: '8',
    name: 'Meryl Streep',
    // profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
    knownFor: 'Actor',
    birthPlace: 'Summit, New Jersey',
    movieCount: 70,
    genre: ['Drama', 'Comedy'],
    awards: 158,
    activeYears: '1971-Present',
    biography: 'Mary Louise "Meryl" Streep is an American actress often described as the "best actress of her generation."',
    movies: [
      { id: 'm15', title: 'The Devil Wears Prada', year: 2006, role: 'Actor', character: 'Miranda Priestly', rating: 6.9 },
      { id: 'm16', title: 'Sophies Choice', year: 1982, role: 'Actor', character: 'Sophie Zawistowski', rating: 7.5 },
      { id: 'm17', title: 'The Iron Lady', year: 2011, role: 'Actor', character: 'Margaret Thatcher', rating: 6.4 },
      { id: 'm18', title: 'Doubt', year: 2008, role: 'Actor', character: 'Sister Aloysius', rating: 7.5 },
      { id: 'm19', title: 'Kramer vs. Kramer', year: 1979, role: 'Actor', character: 'Joanna Kramer', rating: 7.8 }
    ]
  },
  {
    id: '9',
    name: 'Quentin Tarantino',
    // profileImage: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400',
    knownFor: 'Director',
    birthPlace: 'Knoxville, Tennessee',
    movieCount: 10,
    genre: ['Crime', 'Thriller'],
    awards: 28,
    activeYears: '1987-Present',
    biography: 'Quentin Jerome Tarantino is an American film director, writer, and actor known for his nonlinear storylines and aestheticization of violence.',
    movies: [
      { id: 'm20', title: 'Pulp Fiction', year: 1994, role: 'Director', rating: 8.9 },
      { id: 'm21', title: 'Django Unchained', year: 2012, role: 'Director', rating: 8.4 },
      { id: 'm22', title: 'Kill Bill: Vol. 1', year: 2003, role: 'Director', rating: 8.2 },
      { id: 'm23', title: 'Inglourious Basterds', year: 2009, role: 'Director', rating: 8.3 },
      { id: 'm24', title: 'Reservoir Dogs', year: 1992, role: 'Director', rating: 8.3 }
    ]
  },
  {
    id: '10',
    name: 'Viola Davis',
    // profileImage: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400',
    knownFor: 'Actor',
    birthPlace: 'St. Matthews, South Carolina',
    movieCount: 50,
    genre: ['Drama', 'Thriller'],
    awards: 74,
    activeYears: '1996-Present'
  },
  {
    id: '11',
    name: 'Martin Scorsese',
    knownFor: 'Director',
    birthPlace: 'New York City, New York',
    movieCount: 25,
    genre: ['Crime', 'Drama'],
    awards: 112,
    activeYears: '1963-Present',
    biography: 'Martin Charles Scorsese is an American film director, producer, and screenwriter, widely regarded as one of the most significant filmmakers in cinema history.',
    movies: [
      { id: 'm25', title: 'Goodfellas', year: 1990, role: 'Director', rating: 8.7 },
      { id: 'm26', title: 'The Departed', year: 2006, role: 'Director', rating: 8.5 },
      { id: 'm27', title: 'Taxi Driver', year: 1976, role: 'Director', rating: 8.2 },
      { id: 'm28', title: 'The Wolf of Wall Street', year: 2013, role: 'Director', rating: 8.2 },
      { id: 'm29', title: 'Shutter Island', year: 2010, role: 'Director', rating: 8.2 }
    ]
  },
  {
    id: '12',
    name: 'Cate Blanchett',
    // profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
    knownFor: 'Actor',
    birthPlace: 'Melbourne, Australia',
    movieCount: 75,
    genre: ['Drama', 'Fantasy'],
    awards: 121,
    activeYears: '1992-Present'
  }
];

export function ActorsPage() {
  const [actors] = useState<Actor[]>(SAMPLE_ACTORS);
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [selectedPerson, setSelectedPerson] = useState<Actor | null>(null);

  // Get unique genres
  const allGenres = Array.from(
    new Set(actors.flatMap(actor => actor.genre || []))
  ).sort();

  const filteredActors = actors
    .filter(actor => {
      const matchesSearch = actor.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'all' ||
        (selectedRole === 'actors' && actor.knownFor?.toLowerCase() === 'actor') ||
        (selectedRole === 'directors' && actor.knownFor?.toLowerCase() === 'director');
      const matchesGenre = selectedGenre === 'all' ||
        (actor.genre?.includes(selectedGenre));
      return matchesSearch && matchesRole && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'awards':
          return (b.awards || 0) - (a.awards || 0);
        case 'movies':
          return (b.movieCount || 0) - (a.movieCount || 0);
        default:
          return 0;
      }
    });

  return (
    <>
      {/* Person Detail Modal */}
      <AnimatePresence>
        {selectedPerson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              zIndex: 50,
              overflow: 'auto',
              padding: '2rem'
            }}
            onClick={() => setSelectedPerson(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                maxWidth: '1200px',
                margin: '0 auto',
                backgroundColor: '#0A1929',
                borderRadius: '1rem',
                overflow: 'hidden',
                border: '1px solid #2C4A6F'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{
                padding: '2rem',
                borderBottom: '1px solid #2C4A6F',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => setSelectedPerson(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#94A3B8',
                    backgroundColor: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#1E3A5F';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94A3B8';
                  }}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={() => setSelectedPerson(null)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '0.5rem'
                  }}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '2rem' }}>
                {/* Person Info */}
                <div style={{ marginBottom: '3rem' }}>
                  <h1 style={{
                    fontSize: '3rem',
                    fontWeight: 700,
                    color: 'white',
                    marginBottom: '1rem'
                  }}>
                    {selectedPerson.name}
                  </h1>

                  <div style={{
                    display: 'flex',
                    gap: '2rem',
                    flexWrap: 'wrap',
                    marginBottom: '2rem'
                  }}>
                    <div>
                      <div style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                        Profession
                      </div>
                      <div style={{ color: 'white', fontWeight: 600 }}>
                        {selectedPerson.knownFor}
                      </div>
                    </div>
                    {selectedPerson.birthPlace && (
                      <div>
                        <div style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          Born
                        </div>
                        <div style={{ color: 'white', fontWeight: 600 }}>
                          {selectedPerson.birthPlace}
                        </div>
                      </div>
                    )}
                    {selectedPerson.activeYears && (
                      <div>
                        <div style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          Active Years
                        </div>
                        <div style={{ color: 'white', fontWeight: 600 }}>
                          {selectedPerson.activeYears}
                        </div>
                      </div>
                    )}
                    {selectedPerson.awards !== undefined && (
                      <div>
                        <div style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          Awards
                        </div>
                        <div style={{ color: '#ff6b1a', fontWeight: 700, fontSize: '1.25rem' }}>
                          {selectedPerson.awards}
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedPerson.biography && (
                    <div>
                      <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        color: 'white',
                        marginBottom: '1rem'
                      }}>
                        Biography
                      </h2>
                      <p style={{
                        color: '#CBD5E1',
                        lineHeight: '1.75',
                        fontSize: '1rem'
                      }}>
                        {selectedPerson.biography}
                      </p>
                    </div>
                  )}
                </div>

                {/* Filmography */}
                {selectedPerson.movies && selectedPerson.movies.length > 0 && (
                  <div>
                    <h2 style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: 'white',
                      marginBottom: '1.5rem'
                    }}>
                      {selectedPerson.knownFor === 'Director' ? 'Directed' : 'Filmography'}
                    </h2>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: '1rem'
                    }}>
                      {selectedPerson.movies.map((movie) => (
                        <div
                          key={movie.id}
                          style={{
                            backgroundColor: '#1E3A5F',
                            border: '1px solid #2C4A6F',
                            borderRadius: '0.75rem',
                            padding: '1.25rem',
                            transition: 'all 0.3s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = '#ff6b1a';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = '#2C4A6F';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'start',
                            marginBottom: '0.5rem'
                          }}>
                            <h3 style={{
                              fontSize: '1.125rem',
                              fontWeight: 700,
                              color: 'white'
                            }}>
                              {movie.title}
                            </h3>
                            {movie.rating && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                color: '#ff6b1a',
                                fontWeight: 700
                              }}>
                                <span>★</span>
                                <span>{movie.rating}</span>
                              </div>
                            )}
                          </div>
                          <div style={{
                            color: '#94A3B8',
                            fontSize: '0.875rem',
                            marginBottom: '0.25rem'
                          }}>
                            {movie.year}
                          </div>
                          {movie.character && (
                            <div style={{
                              color: '#CBD5E1',
                              fontSize: '0.875rem',
                              fontStyle: 'italic'
                            }}>
                              as {movie.character}
                            </div>
                          )}
                          {movie.role && !movie.character && (
                            <div style={{
                              color: '#64748B',
                              fontSize: '0.875rem'
                            }}>
                              {movie.role}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen" style={{ backgroundColor: '#0A1929' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem' }}>
        {/* Page Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: '2rem' }}
        >
          <div style={{
            color: '#ff6b1a',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.5rem'
          }}>
            CELEBRITY DATABASE
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <h1 style={{
              color: 'white',
              fontSize: '3rem',
              fontWeight: 700,
              margin: 0
            }}>
              Directors/Actors
            </h1>

            <div style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ff6b1a',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: '9999px',
              boxShadow: '0 10px 15px -3px rgba(255, 107, 26, 0.3)'
            }}>
              {filteredActors.length}
            </div>
          </div>

          {/* Search and Filter Section */}
          <div style={{ maxWidth: '42rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.25rem',
              backgroundColor: '#1E3A5F',
              border: '1px solid #2C4A6F',
              borderRadius: '0.75rem',
              marginBottom: '1rem'
            }}>
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>

            {/* Filter Controls */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              {/* Profession Filter */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#94A3B8',
                  fontSize: '0.75rem',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Profession
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['all', 'actors', 'directors'].map((role) => (
                    <button
                      key={role}
                      onClick={() => setSelectedRole(role)}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: selectedRole === role ? '#ff6b1a' : '#1E3A5F',
                        color: 'white',
                        border: selectedRole === role ? 'none' : '1px solid #2C4A6F',
                        borderRadius: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        textTransform: 'capitalize'
                      }}
                      onMouseEnter={(e) => {
                        if (selectedRole !== role) {
                          e.currentTarget.style.backgroundColor = '#2C4A6F';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedRole !== role) {
                          e.currentTarget.style.backgroundColor = '#1E3A5F';
                        }
                      }}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre Filter */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#94A3B8',
                  fontSize: '0.75rem',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#1E3A5F',
                    color: 'white',
                    border: '1px solid #2C4A6F',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    outline: 'none',
                    minWidth: '150px'
                  }}
                >
                  <option value="all">All Genres</option>
                  {allGenres.map(genre => (
                    <option key={genre} value={genre}>{genre}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label style={{
                  display: 'block',
                  color: '#94A3B8',
                  fontSize: '0.75rem',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#1E3A5F',
                    color: 'white',
                    border: '1px solid #2C4A6F',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    outline: 'none',
                    minWidth: '150px'
                  }}
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="awards">Most Awards</option>
                  <option value="movies">Most Movies</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #1E3A5F',
              borderTop: '4px solid #ff6b1a',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        )}

        {/* Actors Grid */}
        {!loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginTop: '2rem'
            }}
          >
            {filteredActors.map((actor, index) => (
              <motion.div
                key={actor.id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedPerson(actor)}
                  style={{
                    backgroundColor: '#1E3A5F',
                    border: '1px solid #2C4A6F',
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#ff6b1a';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(255, 107, 26, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#2C4A6F';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                    {/* Profile Placeholder */}
                    <div style={{
                      position: 'relative',
                      aspectRatio: '2/3',
                      overflow: 'hidden',
                      backgroundColor: '#0F2744',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundImage: 'linear-gradient(135deg, #0F2744 0%, #1E3A5F 100%)'
                    }}>
                      <div style={{
                        color: '#ff6b1a',
                        fontSize: '4rem',
                        fontWeight: 700,
                        textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                      }}>
                        {actor.name.charAt(0)}
                      </div>

                      {/* Known For Badge */}
                      {actor.knownFor && (
                        <div style={{
                          position: 'absolute',
                          top: '0.75rem',
                          right: '0.75rem',
                          padding: '0.375rem 0.75rem',
                          backgroundColor: 'rgba(255, 107, 26, 0.95)',
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          borderRadius: '0.375rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          backdropFilter: 'blur(8px)'
                        }}>
                          {actor.knownFor}
                        </div>
                      )}
                    </div>

                    {/* Actor Info */}
                    <div style={{ padding: '1.25rem' }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'white',
                        marginBottom: '0.5rem',
                        transition: 'color 0.3s'
                      }}
                      className="group-hover:text-[#ff6b1a]"
                      >
                        {actor.name}
                      </h3>

                      {/* Genres */}
                      {actor.genre && actor.genre.length > 0 && (
                        <div style={{
                          display: 'flex',
                          gap: '0.375rem',
                          flexWrap: 'wrap',
                          marginBottom: '0.75rem'
                        }}>
                          {actor.genre.slice(0, 2).map((genre, idx) => (
                            <span
                              key={idx}
                              style={{
                                padding: '0.25rem 0.625rem',
                                backgroundColor: 'rgba(255, 107, 26, 0.15)',
                                color: '#ff6b1a',
                                fontSize: '0.75rem',
                                borderRadius: '0.25rem',
                                fontWeight: 600
                              }}
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Stats */}
                      <div style={{
                        display: 'flex',
                        gap: '1rem',
                        color: '#94A3B8',
                        fontSize: '0.875rem',
                        marginBottom: '0.5rem'
                      }}>
                        {actor.movieCount !== undefined && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <svg style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                            <span>{actor.movieCount} {actor.movieCount === 1 ? 'film' : 'films'}</span>
                          </div>
                        )}
                        {actor.awards !== undefined && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <svg style={{ width: '1rem', height: '1rem' }} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>{actor.awards} {actor.awards === 1 ? 'award' : 'awards'}</span>
                          </div>
                        )}
                      </div>

                      {/* Active Years */}
                      {actor.activeYears && (
                        <div style={{
                          color: '#64748B',
                          fontSize: '0.75rem'
                        }}>
                          Active: {actor.activeYears}
                        </div>
                      )}
                    </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredActors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#64748B'
            }}
          >
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem'
            }}>
              🎬
            </div>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              color: '#94A3B8'
            }}>
              No results found
            </h3>
            <p style={{ fontSize: '1rem' }}>
              Try adjusting your filters or search terms
            </p>
          </motion.div>
        )}
      </div>
      </div>

      {/* CSS Animation for Loading Spinner */}
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
