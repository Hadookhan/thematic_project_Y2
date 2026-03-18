import {    Link } from "react-router-dom";

function Navbar() {
    return (
        <header className="navbar">
      <Link to="/" className="logo">
        Movies4US <span className="logo-dot">•</span>
      </Link>

      <nav className="nav-links">
        <Link to="/" className="nav-link active">
          Home
        </Link>

        <a href="#" className="nav-link">
          Browse
        </a>

        <a href="#" className="nav-link">
          Search
        </a>

        <a href="#" className="nav-link">
          Actors
        </a>

        <a href="#" className="nav-link">
          Directors
        </a>

        <a href="#" className="nav-link">
          Watchlist
        </a>
      </nav>

      <div className="profile-circle">◌</div>
    </header>
  );
}

export default Navbar;