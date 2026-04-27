import { useEffect, useMemo, useState } from 'react';
import {
  browseMovies,
  fetchAllGenres,
  clearBrowseData,
} from '../services/browseService';
import { Link } from 'react-router-dom';
import '../css/browse.css';
import Navbar from '../components/navbar';

export default function Browse() {
  const [movies, setMovies] = useState([]);
  const [genreOptions, setGenreOptions] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 50;
  const [searchInput, setSearchInput] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedBudgetRanges, setSelectedBudgetRanges] = useState([]);
  const [selectedRevenueRanges, setSelectedRevenueRanges] = useState([]);
  const [actorName, setActorName] = useState('');
  const [directorName, setDirectorName] = useState('');

  const [openSections, setOpenSections] = useState({
    genre: true,
    year: false,
    money: false,
    people: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];

    for (let y = currentYear; y >= 1900; y--) {
      years.push(String(y));
    }

    return years;
  }, []);

  const budgetOptions = [
    '0-10000000',
    '10000000-50000000',
    '50000000-100000000',
    '100000000-200000000',
    '200000000-500000000',
  ];

  const revenueOptions = [
    '0-50000000',
    '50000000-100000000',
    '100000000-300000000',
    '300000000-500000000',
    '500000000-1000000000',
    '1000000000-9999999999',
  ];

  function toggleSection(section) {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }

  function toggleFromArray(value, setter) {
    setter((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  }

  function removeFilter(type, value) {
    if (type === 'genre') {
      setSelectedGenres((prev) => prev.filter((v) => v !== value));
    }
    if (type === 'year') {
      setSelectedYears((prev) => prev.filter((v) => v !== value));
    }
    if (type === 'budget') {
      setSelectedBudgetRanges((prev) => prev.filter((v) => v !== value));
    }
    if (type === 'revenue') {
      setSelectedRevenueRanges((prev) => prev.filter((v) => v !== value));
    }
    if (type === 'actor') {
      setActorName('');
    }
    if (type === 'director') {
      setDirectorName('');
    }
  }

  function handleClear() {
    const cleared = clearBrowseData();

    setSearchInput(cleared.searchInput || '');
    setSelectedGenres(cleared.selectedGenres || []);
    setSelectedYears([]);
    setSelectedBudgetRanges([]);
    setSelectedRevenueRanges([]);
    setActorName(cleared.actorName || '');
    setDirectorName(cleared.directorName || '');
    setMovies(cleared.results || []);
    setError(cleared.error || '');
  }

  function convertRangesToMinMax(ranges) {
    if (!ranges.length) return { min: '', max: '' };

    const parsed = ranges
      .map((range) => {
        const [min, max] = range.split('-').map(Number);
        return { min, max };
      })
      .filter((r) => !Number.isNaN(r.min) && !Number.isNaN(r.max));

    if (!parsed.length) return { min: '', max: '' };

    return {
      min: Math.min(...parsed.map((r) => r.min)),
      max: Math.max(...parsed.map((r) => r.max)),
    };
  }

  function convertYearsToMinMax(years) {
    if (!years.length) return { min: '', max: '' };
    const nums = years.map(Number).filter((n) => !Number.isNaN(n));
    if (!nums.length) return { min: '', max: '' };
    return {
      min: Math.min(...nums),
      max: Math.max(...nums),
    };
  }

  async function loadBrowseData() {
    try {
      setLoading(true);
      setError('');

      const yearRange = convertYearsToMinMax(selectedYears);
      const budgetRange = convertRangesToMinMax(selectedBudgetRanges);
      const revenueRange = convertRangesToMinMax(selectedRevenueRanges);

      const results = await browseMovies({
        searchInput,
        selectedGenres,
        minYear: yearRange.min,
        maxYear: yearRange.max,
        minBudget: budgetRange.min,
        maxBudget: budgetRange.max,
        minRevenue: revenueRange.min,
        maxRevenue: revenueRange.max,
        actorName,
        directorName,
        page,
        pageSize: PAGE_SIZE,
      });

      setMovies((prev) => page === 0 ? results : [...prev, ...results]);
      setHasMore(results.length === PAGE_SIZE);
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
  }, []);

  useEffect(() => {
  loadBrowseData();
  }, [page]);

  const activeFilters = useMemo(() => {
    const pills = [];

    selectedGenres.forEach((genre) =>
      pills.push({ type: 'genre', value: genre, label: genre })
    );

    selectedYears.forEach((year) =>
      pills.push({ type: 'year', value: year, label: year })
    );

    selectedBudgetRanges.forEach((range) =>
      pills.push({ type: 'budget', value: range, label: `Budget ${formatRange(range)}` })
    );

    selectedRevenueRanges.forEach((range) =>
      pills.push({ type: 'revenue', value: range, label: `Revenue ${formatRange(range)}` })
    );

    if (actorName.trim()) {
      pills.push({ type: 'actor', value: actorName, label: actorName });
    }

    if (directorName.trim()) {
      pills.push({ type: 'director', value: directorName, label: directorName });
    }

    return pills;
  }, [
    selectedGenres,
    selectedYears,
    selectedBudgetRanges,
    selectedRevenueRanges,
    actorName,
    directorName,
  ]);

  function formatMoney(n) {
    const value = Number(n);
    if (value >= 1000000000) return `${value / 1000000000}B`;
    if (value >= 1000000) return `${value / 1000000}M`;
    return `${value}`;
  }

  function formatRange(range) {
    const [min, max] = range.split('-');
    return `${formatMoney(min)}-${formatMoney(max)}`;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (page === 0) {
      await loadBrowseData();
    } else {
      setPage(0);
    }
  }

  return (
    <>
    <Navbar />
    <div className="browse-shell">
      <div className="browse-top-spacer" />

      <div className="browse-layout">
        <aside className="browse-sidebar">
          <div className="filters-header">
            <span className="filters-icon">⎇</span>
            <h2>Filters</h2>
          </div>

          <form onSubmit={handleSubmit} className="filters-form">
            <div className="filter-card">
              <button
                type="button"
                className="filter-card-header"
                onClick={() => toggleSection('genre')}
              >
                <span>Genre</span>
                <span className={`chev ${openSections.genre ? 'open' : ''}`}>⌃</span>
              </button>

              {openSections.genre && (
                <div className="genre-chip-list">
                  {genreOptions.map((genre) => {
                    const active = selectedGenres.includes(genre.name);
                    return (
                      <button
                        key={genre.genre_id}
                        type="button"
                        className={`genre-chip ${active ? 'active' : ''}`}
                        onClick={() => toggleFromArray(genre.name, setSelectedGenres)}
                      >
                        {genre.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="filter-card collapsed">
              <button
                type="button"
                className="filter-card-header"
                onClick={() => toggleSection('year')}
              >
                <span>Release Year</span>
                <span className={`chev ${openSections.year ? 'open' : ''}`}>⌄</span>
              </button>

              {openSections.year && (
                <div className="option-list">
                  {yearOptions.map((year) => (
                    <button
                      key={year}
                      type="button"
                      className={`option-chip ${selectedYears.includes(year) ? 'active' : ''}`}
                      onClick={() => toggleFromArray(year, setSelectedYears)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="filter-card collapsed">
              <button
                type="button"
                className="filter-card-header"
                onClick={() => toggleSection('money')}
              >
                <span>Budget & Revenue</span>
                <span className={`chev ${openSections.money ? 'open' : ''}`}>⌄</span>
              </button>

              {openSections.money && (
                <div className="money-sections">
                  <div>
                    <p className="sub-label">Budget</p>
                    <div className="option-list">
                      {budgetOptions.map((range) => (
                        <button
                          key={range}
                          type="button"
                          className={`option-chip ${selectedBudgetRanges.includes(range) ? 'active' : ''}`}
                          onClick={() =>
                            toggleFromArray(range, setSelectedBudgetRanges)
                          }
                        >
                          {formatRange(range)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="sub-label">Revenue</p>
                    <div className="option-list">
                      {revenueOptions.map((range) => (
                        <button
                          key={range}
                          type="button"
                          className={`option-chip ${selectedRevenueRanges.includes(range) ? 'active' : ''}`}
                          onClick={() =>
                            toggleFromArray(range, setSelectedRevenueRanges)
                          }
                        >
                          {formatRange(range)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="filter-card collapsed">
              <button
                type="button"
                className="filter-card-header"
                onClick={() => toggleSection('people')}
              >
                <span>Actor & Director</span>
                <span className={`chev ${openSections.people ? 'open' : ''}`}>⌄</span>
              </button>

              {openSections.people && (
                <div className="people-fields">
                  <input
                    type="text"
                    placeholder="Actor name"
                    value={actorName}
                    onChange={(e) => setActorName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Director name"
                    value={directorName}
                    onChange={(e) => setDirectorName(e.target.value)}
                  />
                </div>
              )}
            </div>

            <button className="apply-btn" type="submit">
              Apply Filters
            </button>
          </form>
        </aside>

        <main className="browse-content">
          <div className="active-filters-row">
            <button type="button" className="clear-all-btn" onClick={handleClear}>
              Clear All
            </button>

            <span className="active-filters-label">Active Filters:</span>

            <div className="active-pill-wrap">
              {activeFilters.map((pill) => (
                <button
                  key={`${pill.type}-${pill.value}`}
                  type="button"
                  className="active-pill"
                  onClick={() => removeFilter(pill.type, pill.value)}
                >
                  {pill.label} <span>×</span>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="browse-message">{error}</p>}
          {loading && <p className="browse-message">Loading...</p>}

          <div className="movie-grid">
            {movies.length > 0 ? (
              movies.map((movie, index) => (
                <Link
                  key={movie.movie_id}
                  to={`/movie/${movie.movie_id}`}
                  className="movie-link"
                >
                  <article className="movie-tile">
                    <div className="poster-placeholder">
                      <div className="rating-badge">⭐ {movie.rating ?? 'N/A'}</div>
                    </div>

                    <div className="movie-meta">
                      <h3>{movie.title || `Movie Title ${index + 1}`}</h3>
                      <p>
                        {movie.release_year ?? 'N/A'} •{' '}
                        {movie.genres?.length ? movie.genres.join(', ') : 'N/A'}
                      </p>
                    </div>
                  </article>
                </Link>
              ))
            ) : (
              !loading && <p className="browse-message">No movies found.</p>
            )}
          </div>
          {hasMore && !loading && (
            <button
              type="button"
              className="apply-btn"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Load More
            </button>
          )}
        </main>
      </div>
    </div>
    </>
  );
}