import { Link } from "react-router-dom";
import { useFavorites } from "../contexts/FavoritesContext.jsx";

export default function Favorites() {
  const { getUserFavorites, removeFavorite } = useFavorites();
  const favorites = getUserFavorites();

  return (
    <section>
      <h2>Favorites</h2>

      {favorites.length === 0 ? (
        <div className="message">
          You haven't saved any events yet. <Link to="/events">Browse events</Link>
        </div>
      ) : (
        <div className="grid">
          {favorites.map((ev) => (
            <div key={ev.id} className="card">
              <h3 style={{ marginTop: 0 }}>
                <Link to={`/events/${ev.id}`}>{ev.name}</Link>
              </h3>
              <p className="muted">{ev.dates?.start?.localDate || "—"}</p>
              <button onClick={() => removeFavorite(ev.id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
