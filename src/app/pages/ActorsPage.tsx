/**
 * Movie Cast Page
 *
 * Displays actors for a specific movie with their filmography.
 *
 * BACKEND INTEGRATION:
 * Pass your actor data as props:
 * <ActorsPage
 *   cast={actorsData}
 *   movieTitle="Inception"
 *   movieYear={2010}
 * />
 *
 * Expected data format (matches your database):
 * {
 *   name: string;
 *   acting: { title: string; year: number; }[]
 * }
 */

import { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Movie {
  title: string;
  year: number;
}

interface Actor {
  name: string;
  acting: Movie[];
}

// Sample data for demonstration - matches your actual database structure
const SAMPLE_ACTORS: Actor[] = [
  {
    name: 'Debi Sue Voorhees',
    acting: [
      { title: 'Friday the 13th: A New Beginning', year: 1985 }
    ]
  },
  {
    name: 'Laura Lane',
    acting: [
      { title: 'Swordfish', year: 2001 }
    ]
  },
  {
    name: 'Miguel Pérez',
    acting: [
      { title: 'Million Dollar Baby', year: 2004 },
      { title: 'Blow', year: 2001 },
      { title: 'A Shock to the System', year: 1990 }
    ]
  },
  {
    name: 'Keishi Nagatsuka',
    acting: [
      { title: 'Sakuran', year: 2007 },
      { title: 'Goth', year: 2008 },
      { title: 'Suspect X', year: 2008 },
      { title: 'Tokyo.sora', year: 2002 },
      { title: 'The Boy and the Beast', year: 2015 }
    ]
  },
  {
    name: 'Parley Baer',
    acting: [
      { title: 'Dave', year: 1993 },
      { title: 'The Ugly Dachshund', year: 1966 },
      { title: 'Skin Game', year: 1971 },
      { title: 'Gypsy', year: 1962 },
      { title: 'Follow Me, Boys!', year: 1966 }
    ]
  },
  {
    name: 'Natalie McNeil',
    acting: [
      { title: 'Spider-Man 3', year: 2007 }
    ]
  },
  {
    name: 'Dido Miles',
    acting: [
      { title: 'Emma', year: 1996 },
      { title: 'Mum & Dad', year: 2008 }
    ]
  },
  {
    name: 'Holly Weston',
    acting: [
      { title: 'Filth and Wisdom', year: 2008 },
      { title: 'Howl', year: 2015 },
      { title: 'The Danish Girl', year: 2015 },
      { title: 'Assassin', year: 2015 }
    ]
  },
  {
    name: 'John Beck',
    acting: [
      { title: 'Rollerball', year: 1975 },
      { title: 'Sleeper', year: 1973 },
      { title: 'Pat Garrett & Billy the Kid', year: 1973 },
      { title: 'The Big Bus', year: 1976 }
    ]
  },
  {
    name: 'Paul Benjamin',
    acting: [
      { title: 'Do the Right Thing', year: 1989 },
      { title: 'The Station Agent', year: 2003 },
      { title: 'Midnight Cowboy', year: 1969 },
      { title: 'Escape from Alcatraz', year: 1979 },
      { title: 'Hoodlum', year: 1997 }
    ]
  }
];

// Props interface - backend team can pass real data here
interface ActorsPageProps {
  cast?: Actor[];           // Array of actors for this movie
  movieTitle?: string;      // e.g., "Inception"
  movieYear?: number;       // e.g., 2010
  loading?: boolean;
}

export function ActorsPage({ cast, movieTitle = "Movie Title", movieYear = 2024, loading = false }: ActorsPageProps = {}) {
  // Use provided cast data, or fall back to sample data for demo
  const actors = cast || SAMPLE_ACTORS;
  const [selectedPerson, setSelectedPerson] = useState<Actor | null>(null);

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
                    marginBottom: '2rem'
                  }}>
                    {selectedPerson.name}
                  </h1>
                </div>

                {/* Filmography */}
                {selectedPerson.acting && selectedPerson.acting.length > 0 && (
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
                      {selectedPerson.acting.map((movie, index) => (
                        <div
                          key={`${movie.title}-${index}`}
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
                            {movie.title}
                          </h3>
                          <div style={{
                            color: '#94A3B8',
                            fontSize: '0.875rem'
                          }}>
                            {movie.year}
                          </div>
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
            CAST & CREW
          </div>

          <h1 style={{
            color: 'white',
            fontSize: '3rem',
            fontWeight: 700,
            margin: 0,
            marginBottom: '2rem'
          }}>
            {movieTitle}
            <span style={{ color: '#94A3B8', fontSize: '1.5rem', fontWeight: 400, marginLeft: '1rem' }}>
              ({movieYear})
            </span>
          </h1>
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

        {/* Cast Section */}
        {!loading && actors.length > 0 && (
          <div>
            <h2 style={{
              color: 'white',
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '1.5rem'
            }}>
              Cast
            </h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {actors.map((actor, index) => (
              <motion.div
                key={`${actor.name}-${index}`}
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
                    </div>

                    {/* Actor Info */}
                    <div style={{ padding: '1.25rem' }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'white',
                        marginBottom: '0.5rem'
                      }}>
                        {actor.name}
                      </h3>

                      {/* Film Count */}
                      <div style={{
                        color: '#94A3B8',
                        fontSize: '0.875rem'
                      }}>
                        {actor.acting.length} {actor.acting.length === 1 ? 'film' : 'films'}
                      </div>
                    </div>
                </motion.div>
              </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Empty State */}
        {!loading && actors.length === 0 && (
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
