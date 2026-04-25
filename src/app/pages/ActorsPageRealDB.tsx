/**
 * Directors/Actors Database Page - REAL DATABASE VERSION
 *
 * This version uses your actual Supabase database schema with:
 * - people table
 * - cast_credits table
 * - crew_credits table
 * - movies table
 * - movie_genres table
 */

import { useState, useEffect } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../../lib/supabase';

interface MovieCredit {
  movie_id: number;
  title: string;
  release_year?: number;
  character?: string;
  job?: string;
  rating?: number;
}

interface PersonWithCredits {
  person_id: number;
  name: string;
  credits?: MovieCredit[];
  totalMovies?: number;
  isActor?: boolean;
  isDirector?: boolean;
  genres?: string[];
}

export function ActorsPage() {
  const [people, setPeople] = useState<PersonWithCredits[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [selectedPerson, setSelectedPerson] = useState<PersonWithCredits | null>(null);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      setLoading(true);

      // Fetch people with their cast and crew credits
      const { data: peopleData, error: peopleError } = await supabase
        .from('people')
        .select('person_id, name')
        .limit(100);

      if (peopleError) throw peopleError;

      // For each person, fetch their credits
      const peopleWithCredits = await Promise.all(
        (peopleData || []).map(async (person) => {
          // Fetch cast credits
          const { data: castCredits } = await supabase
            .from('cast_credits')
            .select(`
              movie_id,
              character,
              cast_order,
              movies (
                title,
                release_year
              )
            `)
            .eq('person_id', person.person_id)
            .order('cast_order');

          // Fetch crew credits (directors, etc.)
          const { data: crewCredits } = await supabase
            .from('crew_credits')
            .select(`
              movie_id,
              job,
              department,
              movies (
                title,
                release_year
              )
            `)
            .eq('person_id', person.person_id);

          const isActor = (castCredits?.length || 0) > 0;
          const isDirector = crewCredits?.some(c => c.job === 'Director') || false;

          const credits: MovieCredit[] = [
            ...(castCredits || []).map(c => ({
              movie_id: c.movie_id,
              title: c.movies?.title || 'Unknown',
              release_year: c.movies?.release_year,
              character: c.character
            })),
            ...(crewCredits || []).map(c => ({
              movie_id: c.movie_id,
              title: c.movies?.title || 'Unknown',
              release_year: c.movies?.release_year,
              job: c.job
            }))
          ];

          return {
            ...person,
            credits,
            totalMovies: credits.length,
            isActor,
            isDirector,
            genres: [] // You can add genre logic here if needed
          };
        })
      );

      setPeople(peopleWithCredits);
    } catch (error) {
      console.error('Error fetching people:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get unique genres (if you implement genre fetching)
  const allGenres: string[] = [];

  const filteredPeople = people
    .filter(person => {
      const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = selectedRole === 'all' ||
        (selectedRole === 'actors' && person.isActor) ||
        (selectedRole === 'directors' && person.isDirector);
      const matchesGenre = selectedGenre === 'all' ||
        (person.genres?.includes(selectedGenre));
      return matchesSearch && matchesRole && matchesGenre && (person.totalMovies || 0) > 0;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'movies':
          return (b.totalMovies || 0) - (a.totalMovies || 0);
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
                        {selectedPerson.isActor && selectedPerson.isDirector ? 'Actor & Director' :
                         selectedPerson.isDirector ? 'Director' : 'Actor'}
                      </div>
                    </div>
                    {selectedPerson.totalMovies !== undefined && (
                      <div>
                        <div style={{ color: '#94A3B8', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                          Total Films
                        </div>
                        <div style={{ color: '#ff6b1a', fontWeight: 700, fontSize: '1.25rem' }}>
                          {selectedPerson.totalMovies}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Filmography */}
                {selectedPerson.credits && selectedPerson.credits.length > 0 && (
                  <div>
                    <h2 style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: 'white',
                      marginBottom: '1.5rem'
                    }}>
                      Filmography
                    </h2>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                      gap: '1rem'
                    }}>
                      {selectedPerson.credits.map((credit, idx) => (
                        <div
                          key={`${credit.movie_id}-${idx}`}
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
                          <h3 style={{
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: 'white',
                            marginBottom: '0.5rem'
                          }}>
                            {credit.title}
                          </h3>
                          {credit.release_year && (
                            <div style={{
                              color: '#94A3B8',
                              fontSize: '0.875rem',
                              marginBottom: '0.25rem'
                            }}>
                              {credit.release_year}
                            </div>
                          )}
                          {credit.character && (
                            <div style={{
                              color: '#CBD5E1',
                              fontSize: '0.875rem',
                              fontStyle: 'italic'
                            }}>
                              as {credit.character}
                            </div>
                          )}
                          {credit.job && (
                            <div style={{
                              color: '#CBD5E1',
                              fontSize: '0.875rem'
                            }}>
                              {credit.job}
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
              {filteredPeople.length}
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

        {/* People Grid */}
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
            {filteredPeople.map((person, index) => (
              <motion.div
                key={person.person_id}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedPerson(person)}
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
                        {person.name.charAt(0)}
                      </div>

                      {/* Role Badge */}
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
                        {person.isActor && person.isDirector ? 'BOTH' :
                         person.isDirector ? 'DIRECTOR' : 'ACTOR'}
                      </div>
                    </div>

                    {/* Person Info */}
                    <div style={{ padding: '1.25rem' }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'white',
                        marginBottom: '0.75rem',
                        transition: 'color 0.3s'
                      }}>
                        {person.name}
                      </h3>

                      {/* Stats */}
                      <div style={{
                        display: 'flex',
                        gap: '1rem',
                        color: '#94A3B8',
                        fontSize: '0.875rem'
                      }}>
                        {person.totalMovies !== undefined && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <svg style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                            <span>{person.totalMovies} {person.totalMovies === 1 ? 'film' : 'films'}</span>
                          </div>
                        )}
                      </div>
                    </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredPeople.length === 0 && (
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
