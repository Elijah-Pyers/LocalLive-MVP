/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";

const FavoritesContext = createContext(null);

const STORAGE_KEY = "locallive_favorites_v1";

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  function addFavorite(event) {
    setFavorites((prev) => {
      if (prev.some((e) => e.id === event.id)) return prev;
      return [event, ...prev];
    });
  }

  function removeFavorite(id) {
    setFavorites((prev) => prev.filter((e) => e.id !== id));
  }

  function isFavorite(id) {
    return favorites.some((e) => e.id === id);
  }

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
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
