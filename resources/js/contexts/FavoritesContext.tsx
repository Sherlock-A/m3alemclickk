import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type FavoritesContextValue = {
  favorites: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const DEVICE_KEY = 'jobly_device_id';
const FAVORITES_KEY = 'jobly_favorites';

function getDeviceId() {
  const existing = localStorage.getItem(DEVICE_KEY);
  if (existing) return existing;
  const value = crypto.randomUUID();
  localStorage.setItem(DEVICE_KEY, value);
  return value;
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    setFavorites(stored ? JSON.parse(stored) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    const deviceId = getDeviceId();
    axios.post('/api/favorites/sync', { device_id: deviceId, favorites }).catch(() => null);
  }, [favorites]);

  const value = useMemo<FavoritesContextValue>(() => ({
    favorites,
    isFavorite: (id) => favorites.includes(id),
    toggleFavorite: (id) =>
      setFavorites((current) =>
        current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
      ),
  }), [favorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
