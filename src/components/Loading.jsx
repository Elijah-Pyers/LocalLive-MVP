export default function Loading({ title = "Loading..." }) {
  return (
    <div className="panel" aria-label="loading">
      <h2 style={{ marginTop: 0 }}>{title}</h2>
      <div className="grid">
        <div className="skeleton">
          <div className="skel-line w60" />
          <div className="skel-line w80" />
          <div className="skel-line w40" />
        </div>
        <div className="skeleton">
          <div className="skel-line w60" />
          <div className="skel-line w80" />
          <div className="skel-line w40" />
        </div>
      </div>
    </div>
  );
}
