import { NavLink } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/events">Events</NavLink>
        <NavLink to="/favorites">Favorites</NavLink>
      </div>
    </nav>
  );
}
