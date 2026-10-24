import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import "../style/Navbar.css";
 
export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" aria-label="SIBOL home">
          <img src={logo} alt="SIBOL" />
        </Link>
        <ul className="navbar__links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/guide">Guide</NavLink></li>
        </ul>
      </div>
    </nav>
  );
}