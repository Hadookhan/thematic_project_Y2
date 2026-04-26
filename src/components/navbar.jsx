import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './navbar.css';

function Navbar() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="navbar">
      <button
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation menu"
      >
        ☰
      </button>

      <Link to="/" className="logo" onClick={closeMenu}>
        Movies 4 US <span className="logo-dot">•</span>
      </Link>

      <nav className={`nav-links ${open ? 'open' : ''}`}>
        <NavLink to="/" className="nav-link" onClick={closeMenu}>
          Home
        </NavLink>

        <NavLink to="/browse" className="nav-link" onClick={closeMenu}>
          Browse
        </NavLink>

        <NavLink to="/search" className="nav-link" onClick={closeMenu}>
          Search
        </NavLink>
      </nav>

      <button className="profile-circle" aria-label="Profile">
        ◌
      </button>
    </header>
  );
}

export default Navbar;