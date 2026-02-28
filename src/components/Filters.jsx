export default function Filters({ filters, setFilters }) {
  function update(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="panel">
      <h2 style={{ marginTop: 0 }}>Filters</h2>

      <div className="grid">
        <div>
          <label>
            Category
            <select
              value={filters.segment}
              onChange={(e) => update("segment", e.target.value)}
            >
              <option value="">Any</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Arts & Theatre">Arts & Theatre</option>
              <option value="Film">Film</option>
              <option value="Miscellaneous">Misc</option>
            </select>
          </label>
          <div className="helper">Ticketmaster “segmentName” filter.</div>
        </div>

        <div>
          <label>
            Keyword
            <input
              value={filters.keyword}
              onChange={(e) => update("keyword", e.target.value)}
              placeholder="rock, comedy, suns..."
            />
          </label>
          <div className="helper">Search within event names.</div>
        </div>
      </div>
    </div>
  );
}
