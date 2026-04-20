import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        Movies4US <span className="logo-dot">•</span>
      </Link>

      <nav className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/browse" className="nav-link">Browse</Link>
        <Link to="/search" className="nav-link">Search</Link>

        {/* single combined page */}
        <Link to="/people" className="nav-link">
          Actors & Directors
        </Link>

        {/* disable or hide until built */}
        <span className="nav-link disabled">Watchlist</span>
      </nav>

      <div className="profile-circle">◌</div>
    </header>
  );
}

export default Navbar;