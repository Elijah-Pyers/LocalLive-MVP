import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useFavorites } from "../contexts/FavoritesContext.jsx";

export default function Admin() {
  const { isAdmin } = useAuth();
  const { getAllUserFavorites } = useFavorites();

  if (!isAdmin()) return <Navigate to="/" replace />;

  const all = getAllUserFavorites();
  const users = Object.keys(all);

  return (
    <section>
      <h2>Admin Dashboard</h2>
      <p className="muted">View all users and their saved favorites.</p>

      {users.length === 0 ? (
        <div className="message">No users have saved favorites yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {users.map((u) => (
            <div key={u} className="card">
              <h3 style={{ marginTop: 0 }}>{u} ({all[u]?.length || 0})</h3>
              {(all[u] || []).length === 0 ? (
                <p className="muted">No favorites</p>
              ) : (
                <ul>
                  {(all[u] || []).map((ev) => (
                    <li key={ev.id}>
                      <a href={`/events/${ev.id}`}>{ev.name}</a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
