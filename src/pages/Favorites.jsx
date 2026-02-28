import EventCard from "../components/EventCard.jsx";
import { useFavorites } from "../contexts/FavoritesContext.jsx";

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();

  return (
    <section className="panel">
      <h2 style={{ marginTop: 0 }}>Favorites</h2>
      <p className="helper">
        Saved events are stored in Context + localStorage for the MVP.
      </p>

      <hr />

      {favorites.length === 0 ? (
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>No favorites yet</h3>
          <p className="helper">Open an event and click “Save”.</p>
        </div>
      ) : (
        <div className="grid">
          {favorites.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              rightSlot={
                <button
                  className="danger"
                  onClick={() => removeFavorite(ev.id)}
                  aria-label={`remove-${ev.id}`}
                >
                  Remove
                </button>
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
