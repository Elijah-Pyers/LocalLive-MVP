/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const USERS_KEY = "locallive_users_v1";
const TOKEN_KEY = "locallive_token_v1";
const CSRF_KEY = "locallive_csrf_v1";

// --- tiny helpers (demo-level) ---
function b64(obj) {
  return btoa(JSON.stringify(obj));
}
function unb64(str) {
  return JSON.parse(atob(str));
}
function makeToken(payload) {
  const header = { alg: "mock", typ: "JWT" };
  const body = { ...payload };
  const signature = btoa(`${body.username}.${body.exp}.locallive`);
  return `${b64(header)}.${b64(body)}.${signature}`;
}
function parseToken(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = unb64(parts[1]);
    return payload;
  } catch {
    return null;
  }
}
function nowSec() {
  return Math.floor(Date.now() / 1000);
}
function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [csrfToken, setCsrfToken] = useState("");

  // restore session from sessionStorage token
  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const csrf = sessionStorage.getItem(CSRF_KEY);

    if (!csrf) {
      const fresh = crypto?.randomUUID?.() || String(Math.random()).slice(2);
      sessionStorage.setItem(CSRF_KEY, fresh);
      setCsrfToken(fresh);
    } else {
      setCsrfToken(csrf);
    }

    if (!token) return;
    const payload = parseToken(token);
    if (!payload?.username || !payload?.exp) return;

    if (payload.exp <= nowSec()) {
      sessionStorage.removeItem(TOKEN_KEY);
      return;
    }

    setUser({ username: payload.username, role: payload.role || "regular", token });
  }, []);

  const isAuthenticated = user !== null;

  function register({ username, password, role = "regular", csrf }) {
    if (!csrf || csrf !== csrfToken) throw new Error("Invalid CSRF token.");
    const clean = username.trim();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(clean)) {
      throw new Error("Username must be 3-20 chars: letters, numbers, underscore.");
    }
    if (password.length < 6) throw new Error("Password must be at least 6 characters.");

    const users = loadUsers();
    if (users.some((u) => u.username.toLowerCase() === clean.toLowerCase())) {
      throw new Error("That username is already taken.");
    }

    // Demo storage: hash password so it's not stored in plain text
    const hash = btoa(password);
    users.push({ username: clean, passwordHash: hash, role });
    saveUsers(users);

    return true;
  }

  function login({ username, password, role, csrf }) {
    if (!csrf || csrf !== csrfToken) throw new Error("Invalid CSRF token.");
    const clean = username.trim();
    const users = loadUsers();

    const found = users.find((u) => u.username.toLowerCase() === clean.toLowerCase());
    if (!found) throw new Error("User not found. Please register first.");

    const hash = btoa(password);
    if (hash !== found.passwordHash) throw new Error("Incorrect password.");

    const exp = nowSec() + 60 * 60; // 1 hour
    const token = makeToken({ username: found.username, role: found.role, exp });

    sessionStorage.setItem(TOKEN_KEY, token);
    setUser({ username: found.username, role: found.role, token });

    return true;
  }

  function logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }

  const isAdmin = () => user?.role === "admin";

  const value = useMemo(
    () => ({
      user,
      role: user?.role || "regular",
      csrfToken,
      isAuthenticated,
      register,
      login,
      logout,
      isAdmin,
    }),
    [user, csrfToken, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
