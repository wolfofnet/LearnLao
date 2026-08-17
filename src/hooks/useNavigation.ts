import { useState, useCallback } from 'react';

export type Page = 'home' | 'alphabet' | 'vocabulary' | 'dialogue' | 'flashcard' | 'tone' 
  | 'search' | 'favorites' | 'stats' | 'calculator' | 'scenario' | 'tone-game';

export function useNavigation() {
  const [page, setPage] = useState<Page>('home');
  const [history, setHistory] = useState<Page[]>(['home']);

  const navigate = useCallback((newPage: Page) => {
    setHistory(prev => [...prev, newPage]);
    setPage(newPage);
  }, []);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setPage(newHistory[newHistory.length - 1]);
    }
  }, [history]);

  return { page, navigate, goBack, canGoBack: history.length > 1 };
}
