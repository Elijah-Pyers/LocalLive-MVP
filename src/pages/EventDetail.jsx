import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../services/ticketmaster.js";
import Loading from "../components/Loading.jsx";
import ErrorState from "../components/ErrorState.jsx";
import { useFavorites } from "../contexts/FavoritesContext.jsx";

function safe(val, fallback = "—") {
  return val ?? fallback;
}

export default function EventDetail() {
  const { id } = useParams();
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
    if (saved) removeFavorite(event.id);
    else addFavorite(event);
  }

  async function onShare() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: event?.name || "LocalLive event", url });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Link copied!");
      }
    } catch {
      // ignore share cancellation
    }
  }

  if (loading) return <Loading title="Loading event details..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!event) return <ErrorState message="Event not found." />;

  const venue = event?._embedded?.venues?.[0];
  const date = event?.dates?.start?.localDate;
  const time = event?.dates?.start?.localTime;

  return (
    <section className="panel">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2 style={{ marginTop: 0, marginBottom: 0 }}>{event.name}</h2>
        <button onClick={onToggleFavorite}>
          {saved ? "★ Saved" : "☆ Save"}
        </button>
      </div>

      <p className="helper" style={{ marginTop: "0.35rem" }}>
        {safe(date, "Date TBD")}
        {time ? ` • ${time}` : ""} • {safe(venue?.name, "Venue TBD")}
      </p>

      <hr />

      <div className="grid">
        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Location</h3>
          <p className="helper">
            {safe(venue?.address?.line1, "")}
            {venue?.city?.name ? `, ${venue.city.name}` : ""}
            {venue?.state?.stateCode ? `, ${venue.state.stateCode}` : ""}
          </p>

          {event?.url ? (
            <p>
              <a href={event.url} target="_blank" rel="noreferrer">
                View tickets on Ticketmaster →
              </a>
            </p>
          ) : null}

          <div className="row">
            {event?.url ? (
              <a href={event.url} target="_blank" rel="noreferrer">
                <button>Tickets</button>
              </a>
            ) : null}
            <button className="secondary" onClick={onShare}>
              Share
            </button>
          </div>
        </div>

        <div className="panel">
          <h3 style={{ marginTop: 0 }}>Details</h3>
          <p className="helper">{safe(event?.info, "No additional info provided.")}</p>
          {event?.priceRanges?.[0] ? (
            <p className="helper">
              Price: {event.priceRanges[0].min}–{event.priceRanges[0].max}{" "}
              {event.priceRanges[0].currency}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
