/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const FavoritesContext = createContext(null);

const STORAGE_KEY = "locallive_favorites_by_user_v1";

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const username = user?.username;

  // { username: [event, ...] }
  const [favoritesByUser, setFavoritesByUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoritesByUser));
  }, [favoritesByUser]);

  const getUserFavorites = () => {
    if (!username) return [];
    return favoritesByUser[username] || [];
  };

  function addFavorite(event) {
    if (!username) return;

    setFavoritesByUser((prev) => {
      const list = prev[username] || [];
      if (list.some((e) => e.id === event.id)) return prev;

      return {
        ...prev,
        [username]: [event, ...list],
      };
    });
  }

  function removeFavorite(id) {
    if (!username) return;

    setFavoritesByUser((prev) => {
      const list = prev[username] || [];
      return {
        ...prev,
        [username]: list.filter((e) => e.id !== id),
      };
    });
  }

  function isFavorite(id) {
    if (!username) return false;
    return (favoritesByUser[username] || []).some((e) => e.id === id);
  }

  const getAllUserFavorites = () => favoritesByUser;


  const value = {
    favoritesByUser,
    getUserFavorites,
    getAllUserFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
}