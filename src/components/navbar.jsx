import { NavLink, Link } from "react-router-dom";
import {
  FaHouse,
  FaFilm,
  FaMagnifyingGlass,
  FaUserGroup,
  FaVideo,
  FaBookmark,
  FaCircleUser,
} from "react-icons/fa6"; // react icons
import "./navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        Movies4US <span className="logo-dot">•</span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <FaHouse />
          <span>Home</span>
        </NavLink>

        <NavLink to="/browse" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <FaFilm />
          <span>Browse</span>
        </NavLink>

        <NavLink to="/search" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <FaMagnifyingGlass />
          <span>Search</span>
        </NavLink>

        <NavLink to="/info" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <FaUserGroup />
          <span>Actors</span>
        </NavLink>

        <NavLink to="/info" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <FaVideo />
          <span>Directors</span>
        </NavLink>

        <a href="#" className="nav-link">
          <FaBookmark />
          <span>Watchlist</span>
        </a>
      </nav>

      <div className="profile-circle">
        <FaCircleUser />
      </div>
    </header>
  );
}

export default Navbar;