/**
 * Directors/Actors Database Page - SUPABASE VERSION
 *
 * This version uses real Supabase queries to fetch data.
 * To use this version:
 * 1. Set up your .env file with Supabase credentials
 * 2. Create tables in Supabase matching the schema below
 * 3. Replace ActorsPage.tsx with this file
 *
 * Required Supabase Tables:
 * - people (id, name, known_for, birth_place, movie_count, genres, awards, active_years, biography)
 * - movies (id, title, year, role, character, rating, person_id)
 */

import { useState, useEffect } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../../lib/supabase';

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
  known_for?: string;
  birth_place?: string;
  movie_count?: number;
  genres?: string[];
  awards?: number;
  active_years?: string;
  movies?: Movie[];
  biography?: string;
}

export function ActorsPage() {
  const [actors, setActors] = useState<Actor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [selectedPerson, setSelectedPerson] = useState<Actor | null>(null);

  // Fetch people from Supabase
  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('people')
        .select(`
          *,
          movies (
            id,
            title,
            year,
            role,
            character,
            rating
          )
        `)
        .order('name');

      if (error) {
        console.error('Error fetching people:', error);
        return;
      }

      setActors(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique genres
  const allGenres = Array.from(
    new Set(actors.flatMap(actor => actor.genres || []))
  ).sort();

  const filteredActors = actors
    .filter(actor => {
      const matchesSearch = actor.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'all' ||
        (selectedRole === 'actors' && actor.known_for?.toLowerCase() === 'actor') ||
        (selectedRole === 'directors' && actor.known_for?.toLowerCase() === 'director');
      const matchesGenre = selectedGenre === 'all' ||
        (actor.genres?.includes(selectedGenre));
      return matchesSearch && matchesRole && matchesGenre;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'awards':
          return (b.awards || 0) - (a.awards || 0);
        case 'movies':
          return (b.movie_count || 0) - (a.movie_count || 0);
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
              {/* Modal Header */}
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

              {/* Modal Content */}
              <div style={{ padding: '2rem' }}>
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
                        {selectedPerson.known_for}
                      </div>
                    </div>
                    {selectedPerson.birth_place && (
                      <div>
                        <div style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          Born
                        </div>
                        <div style={{ color: 'white', fontWeight: 600 }}>
                          {selectedPerson.birth_place}
                        </div>
                      </div>
                    )}
                    {selectedPerson.active_years && (
                      <div>
                        <div style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          Active Years
                        </div>
                        <div style={{ color: 'white', fontWeight: 600 }}>
                          {selectedPerson.active_years}
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
                      {selectedPerson.known_for === 'Director' ? 'Directed' : 'Filmography'}
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
                      {actor.known_for && (
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
                          {actor.known_for}
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
                      {actor.genres && actor.genres.length > 0 && (
                        <div style={{
                          display: 'flex',
                          gap: '0.375rem',
                          flexWrap: 'wrap',
                          marginBottom: '0.75rem'
                        }}>
                          {actor.genres.slice(0, 2).map((genre, idx) => (
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
                        {actor.movie_count !== undefined && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <svg style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                            <span>{actor.movie_count} {actor.movie_count === 1 ? 'film' : 'films'}</span>
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
                      {actor.active_years && (
                        <div style={{
                          color: '#64748B',
                          fontSize: '0.75rem'
                        }}>
                          Active: {actor.active_years}
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
