import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function Register() {
  const { register, csrfToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("regular");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await register({ username, password, role, csrf: csrfToken });
      setSuccess("Account created! You can now log in.");
      setTimeout(() => navigate("/login"), 500);
    } catch (err) {
      setError(err?.message || "Registration failed.");
    }
  }

  return (
    <section className="auth">
      <h2>Register</h2>
      <p className="muted">
        Username: 3–20 chars (letters/numbers/underscore). Password: 6+ chars.
      </p>

      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}

      <form onSubmit={onSubmit} className="auth-form">
        <input type="hidden" value={csrfToken} readOnly />
        <label>
          Username
          <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
        </label>

        <label>
          Role (for testing)
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="regular">regular</option>
            <option value="admin">admin</option>
          </select>
        </label>

        <button type="submit">Create account</button>
      </form>

      <p className="muted">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}
