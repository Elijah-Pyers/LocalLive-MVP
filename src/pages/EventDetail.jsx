import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getEventById } from "../services/ticketmaster.js";
import Loading from "../components/Loading.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { useFavorites } from "../contexts/FavoritesContext.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";

function safe(val, fallback = "—") {
  return val ?? fallback;
}

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const saved = useMemo(() => isFavorite(id), [id, isFavorite]);

  async function load() {
    setError("");
    setLoading(true);
    try {
      const data = await getEventById(id);
      setEvent(data);
    } catch (err) {
      setError(err?.message || "Failed to load event.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function onToggleFavorite() {
    if (!event) return;

    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (saved) removeFavorite(event.id);
    else addFavorite(event);
  }

  async function onShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: event?.name || "Event", url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    } catch {
      // ignore
    }
  }

  if (loading) return <Loading />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!event) return <ErrorState message="Event not found." />;

  const venue = event._embedded?.venues?.[0];
  const image = event.images?.[0]?.url;

  return (
    <div className="detail">
      <div className="detail-header">
        <h2 className="detail-title">{safe(event.name)}</h2>
        <div className="detail-actions">
          <button onClick={onToggleFavorite}>
            {saved ? "★ Saved" : "☆ Save"}
          </button>
          <button onClick={onShare}>Share</button>
        </div>
      </div>

      {image && (
        <img
          src={image}
          alt={event.name}
          style={{ width: "100%", maxHeight: 360, objectFit: "cover", borderRadius: 12 }}
        />
      )}

      <div className="detail-grid">
        <div className="card">
          <h3>When</h3>
          <p>{safe(event.dates?.start?.localDate)}</p>
          <p className="muted">{safe(event.dates?.start?.localTime)}</p>
        </div>

        <div className="card">
          <h3>Where</h3>
          <p>{safe(venue?.name)}</p>
          <p className="muted">
            {safe(venue?.city?.name)} {venue?.state?.stateCode ? `, ${venue.state.stateCode}` : ""}
          </p>
        </div>

        <div className="card">
          <h3>Info</h3>
          <p className="muted">{safe(event.info, "No description provided.")}</p>
        </div>
      </div>
    </div>
  );
}
