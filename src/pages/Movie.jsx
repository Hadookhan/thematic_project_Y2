import { Link } from "react-router-dom";
import "./Movie.css";

function Movie() {
  return (
    <main className="details-shell">
      <section className="details-panel">
        <div className="details-top-row">
          <div className="details-poster">Poster</div>

          <div className="details-main">
            <div className="details-close-row">
              <Link to="/" className="back-home-link">
                Home
              </Link>
              <Link to="/" className="close-button">
                ×
              </Link>
            </div>

            <h1 className="details-movie-title">Movie Name</h1>
            <p className="details-year">Release Year</p>

            <div className="details-rating-row">
              <span className="star large">★</span>
              <span className="details-rating-value">Rating</span>
              <span className="details-out-of">/10</span>
            </div>

            <div className="genre-chip-row">
              <span className="pill-outline">Genre</span>
              <span className="pill-outline">Genre</span>
              <span className="pill-outline">Genre</span>
            </div>
          </div>
        </div>

        <div className="facts-row">
          <div className="fact-tile">
            <p className="fact-label">Runtime</p>
            <p className="fact-value">Runtime</p>
          </div>

          <div className="fact-tile">
            <p className="fact-label">Country</p>
            <p className="fact-value">Country</p>
          </div>

          <div className="fact-tile">
            <p className="fact-label">Language</p>
            <p className="fact-value">Language</p>
          </div>

          <div className="fact-tile">
            <p className="fact-label">Released</p>
            <p className="fact-value">Release Date</p>
          </div>
        </div>

        <section className="synopsis-block">
          <h2>Synopsis</h2>
          <p>
            A movie synopsis will appear here once the frontend is connected to
            the database.
          </p>
        </section>

        <section className="details-table">
          <div className="details-table-row">
            <div className="details-table-label">Director</div>
            <div className="details-table-value">
              <Link to="/person/director/Director-Name" className="person-link">
                Director Name
              </Link>
            </div>
          </div>

          <div className="details-table-row">
            <div className="details-table-label">Main Cast</div>
            <div className="details-table-value cast-links">
              <Link to="/person/actor/Actor-One" className="person-link">
                Actor One
              </Link>
              <span>, </span>
              <Link to="/person/actor/Actor-Two" className="person-link">
                Actor Two
              </Link>
              <span>, </span>
              <Link to="/person/actor/Actor-Three" className="person-link">
                Actor Three
              </Link>
            </div>
          </div>

          <div className="details-table-row">
            <div className="details-table-label">Genre</div>
            <div className="details-table-value">Genre List</div>
          </div>

          <div className="details-table-row">
            <div className="details-table-label">Budget / Revenue</div>
            <div className="details-table-value">Budget / Revenue</div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Movie;