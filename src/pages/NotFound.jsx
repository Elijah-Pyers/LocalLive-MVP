import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="panel">
      <h2 style={{ marginTop: 0 }}>404 — Not Found</h2>
      <p className="helper">That page doesn’t exist.</p>
      <Link to="/">Go back home →</Link>
    </section>
  );
}
