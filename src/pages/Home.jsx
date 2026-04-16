import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  const trendingPlaceholders = Array.from({ length: 6 }, (_, i) => i + 1);
  const newReleasePlaceholders = Array.from({ length: 6 }, (_, i) => i + 1);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-backdrop" />
        <div className="hero-gradient" />

        <div className="hero-inner">
          <div className="hero-text">
            <h1 className="hero-title">Featured Movie Title</h1>

            <div className="hero-meta-row">
              <span className="pill-filled">Genre</span>
              <span className="rating-inline">
                <span className="star">★</span> Rating{" "}
                <span className="out-of">/10</span>
              </span>
            </div>

            <p className="hero-description">
              A featured movie description will appear here when data is loaded
              from the database.
            </p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="section-header">
          <div>
            <p className="section-kicker">Trending</p>
            <h2 className="section-heading">This Week</h2>
          </div>
          <Link to="/browse" className="see-all-link">
            See All <span>›</span>
          </Link>
        </div>

        <div className="poster-grid six-col">
          {trendingPlaceholders.map((item) => (
            <Link to={`/movie/${item}`} key={item} className="poster-card">
              <div className="poster-block">Poster</div>
              <h3 className="poster-title">Title</h3>
              <p className="poster-subtitle">Year</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="content-section releases-section">
        <div className="section-header">
          <div>
            <p className="section-kicker">Latest</p>
            <h2 className="section-heading">New Releases</h2>
          </div>
          <Link to="/browse" className="see-all-link">
            See All <span>›</span>
          </Link>
        </div>

        <div className="poster-grid six-col">
          {newReleasePlaceholders.map((item) => (
            <Link to={`/movie/${item}`} key={item} className="poster-card">
              <div className="poster-block">Poster</div>
              <h3 className="poster-title">Title</h3>
              <p className="poster-subtitle">Year</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;