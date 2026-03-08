import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Login() {
  const { login, csrfToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login({ username, password, csrf: csrfToken });
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message || "Login failed.");
    }
  }

  return (
    <section className="auth">
      <h2>Login</h2>
      <p className="muted">
        Use your registered account. (Demo auth stored locally.)
      </p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={onSubmit} className="auth-form">
        <input type="hidden" value={csrfToken} readOnly />
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </label>
        <button type="submit">Login</button>
      </form>

      <p className="muted">
        New here? <Link to="/register">Create an account</Link>
      </p>
    </section>
  );
}
