import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        Movies4US <span className="logo-dot">•</span>
      </Link>

      <nav className="nav-links">
        <Link to="/" className="nav-link active">Home</Link>
        <Link to="/browse" className="nav-link">Browse</Link>
        <Link to="/search" className="nav-link">Search</Link>
        <Link to="/info" className="nav-link">Actors</Link>
        <Link to="/info" className="nav-link">Directors</Link>
        <a href="#" className="nav-link">Watchlist</a>
      </nav>

      <div className="profile-circle">◌</div>
    </header>
  );
}

export default Navbar;