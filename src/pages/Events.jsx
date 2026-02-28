import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchEvents } from "../services/ticketmaster.js";
import Filters from "../components/Filters.jsx";
import Loading from "../components/Loading.jsx";
import ErrorState from "../components/ErrorState.jsx";
import EventCard from "../components/EventCard.jsx";

export default function Events() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCity = searchParams.get("city") || "Phoenix";
  const initialKeyword = searchParams.get("keyword") || "";

  const [city, setCity] = useState(initialCity);
  const [filters, setFilters] = useState({ keyword: initialKeyword, segment: "" });

  const [events, setEvents] = useState([]);
  const [pageInfo, setPageInfo] = useState({ number: 0, totalPages: 0, totalElements: 0 });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  async function runSearch({ resetPage = true } = {}) {
    setError("");
    setLoading(true);

    try {
      const page = resetPage ? 0 : pageInfo.number;
      const result = await searchEvents({
        city,
        keyword: filters.keyword,
        segment: filters.segment,
        page,
        size: 20,
      });

      setEvents(result.events);
      setPageInfo(result.pageInfo);

      // keep URL in sync (MVP-friendly)
      const sp = new URLSearchParams();
      sp.set("city", city);
      if (filters.keyword) sp.set("keyword", filters.keyword);
      setSearchParams(sp);
    } catch (err) {
      setError(err?.message || "Failed to load events.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load
    runSearch({ resetPage: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onApply() {
    setPageInfo((p) => ({ ...p, number: 0 }));
    runSearch({ resetPage: true });
  }

  async function onLoadMore() {
    if (pageInfo.number + 1 >= pageInfo.totalPages) return;

    setError("");
    setLoading(true);
    try {
      const nextPage = pageInfo.number + 1;
      const result = await searchEvents({
        city,
        keyword: filters.keyword,
        segment: filters.segment,
        page: nextPage,
        size: 20,
      });

      setEvents((prev) => [...prev, ...(result.events || [])]);
      setPageInfo(result.pageInfo);
    } catch (err) {
      setError(err?.message || "Failed to load more events.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="grid">
      <div className="panel">
        <h2 style={{ marginTop: 0 }}>Events</h2>

        <label>
          City
          <input value={city} onChange={(e) => setCity(e.target.value)} />
        </label>

        <div className="row" style={{ marginTop: "0.75rem" }}>
          <button onClick={() => runSearch({ resetPage: true })}>Search</button>
          <button className="secondary" onClick={() => { setFilters({ keyword: "", segment: "" }); }}>
            Clear Filters
          </button>
        </div>

        <p className="helper" style={{ marginBottom: 0 }}>
          Tip: add keyword/category in Filters, then click “Apply”.
        </p>
      </div>

      <Filters filters={filters} setFilters={setFilters} />

      <div className="panel" style={{ gridColumn: "1 / -1" }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h2 style={{ margin: 0 }}>
            Results{" "}
            <span className="helper">
              ({events.length} shown{pageInfo.totalElements ? ` / ${pageInfo.totalElements}` : ""})
            </span>
          </h2>
          <button onClick={onApply}>Apply</button>
        </div>

        <hr />

        {loading && events.length === 0 ? <Loading title="Loading events..." /> : null}
        {error ? <ErrorState message={error} onRetry={() => runSearch({ resetPage: false })} /> : null}

        {!loading && !error && events.length === 0 ? (
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>No events found</h3>
            <p className="helper">
              Try a different keyword, or remove the category filter.
            </p>
          </div>
        ) : null}

        <div className="grid" style={{ marginTop: "0.9rem" }}>
          {events.map((ev) => (
            <EventCard key={ev.id} event={ev} />
          ))}
        </div>

        <div className="row" style={{ marginTop: "1rem", justifyContent: "center" }}>
          {pageInfo.number + 1 < pageInfo.totalPages ? (
            <button onClick={onLoadMore} disabled={loading}>
              {loading ? "Loading..." : "Load more"}
            </button>
          ) : (
            <span className="helper">End of results</span>
          )}
        </div>
      </div>
    </section>
  );
}
