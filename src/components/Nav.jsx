import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useFavorites } from "../contexts/FavoritesContext.jsx";

export default function Nav() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();
  const { getUserFavorites } = useFavorites();
  const navigate = useNavigate();

  const favCount = isAuthenticated ? getUserFavorites().length : 0;

  function onLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="nav">
      <div className="nav-inner" style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ display: "flex", gap: 16 }}>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/events">Events</NavLink>

          {isAuthenticated && (
            <NavLink to="/favorites">Favorites ({favCount})</NavLink>
          )}

          {isAuthenticated && isAdmin() && <NavLink to="/admin">Admin</NavLink>}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 12, alignItems: "center" }}>
          {isAuthenticated ? (
            <>
              <span className="muted">👤 {user.username}{isAdmin() ? " (admin)" : ""}</span>
              <button onClick={onLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
