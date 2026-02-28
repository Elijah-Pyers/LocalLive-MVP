import { Link } from "react-router-dom";

export default function EventCard({ event, rightSlot }) {
  const name = event?.name ?? "Untitled Event";
  const date = event?.dates?.start?.localDate ?? "Date TBD";
  const time = event?.dates?.start?.localTime ?? "";
  const venue =
    event?._embedded?.venues?.[0]?.name ??
    event?._embedded?.venues?.[0]?.address?.line1 ??
    "Venue TBD";

  return (
    <div className="card" data-testid="event-card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <span className="badge">{date}{time ? ` • ${time}` : ""}</span>
        {rightSlot}
      </div>

      <h3>
        <Link to={`/events/${event.id}`}>{name}</Link>
      </h3>
      <p>{venue}</p>
    </div>
  );
}
