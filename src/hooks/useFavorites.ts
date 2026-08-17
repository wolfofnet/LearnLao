import { useState, useEffect, useCallback } from 'react';

interface FavoritesState {
  words: string[];  // 存储词汇的 lao 字符串
}

const STORAGE_KEY = 'lao-learner-favorites';

function loadFavorites(): FavoritesState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { words: [] };
  } catch {
    return { words: [] };
  }
}

function saveFavorites(state: FavoritesState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoritesState>(loadFavorites);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const toggleFavorite = useCallback((lao: string) => {
    setFavorites(prev => {
      const exists = prev.words.includes(lao);
      return {
        words: exists 
          ? prev.words.filter(w => w !== lao) 
          : [...prev.words, lao]
      };
    });
  }, []);

  const isFavorite = useCallback((lao: string) => {
    return favorites.words.includes(lao);
  }, [favorites]);

  const clearFavorites = useCallback(() => {
    setFavorites({ words: [] });
  }, []);

  return { favorites, toggleFavorite, isFavorite, clearFavorites };
}
