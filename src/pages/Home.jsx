import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [city, setCity] = useState("Phoenix");
  const [keyword, setKeyword] = useState("");

  function onSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("city", city.trim() || "Phoenix");
    if (keyword.trim()) params.set("keyword", keyword.trim());
    navigate(`/events?${params.toString()}`);
  }

  return (
    <section className="panel">
      <h2 style={{ marginTop: 0 }}>Find events near you</h2>

      <form onSubmit={onSearch} className="grid">
        <label>
          Search City
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Phoenix"
          />
        </label>

        <label>
          Keyword
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="rock, comedy, festival..."
          />
        </label>

        <div className="row">
          <button type="submit">Search Events</button>
          <span className="helper">Uses Ticketmaster Discovery API</span>
        </div>
      </form>

      <hr />

      <div className="panel" style={{ padding: "0.9rem" }}>
        <h3 style={{ marginTop: 0 }}>Featured Categories</h3>
        <div className="row">
          <span className="badge">Music</span>
          <span className="badge">Sports</span>
          <span className="badge">Arts & Theatre</span>
        </div>
        <p className="helper">
          (MVP note) Category buttons can be added later. For now, use Events filters.
        </p>
      </div>
    </section>
  );
}
