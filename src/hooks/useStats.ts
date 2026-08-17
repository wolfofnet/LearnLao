import { useState, useEffect, useCallback } from 'react';

interface DayStats {
  date: string;        // YYYY-MM-DD
  wordsLearned: number;
  practiceMinutes: number;
  flashcardScore: number;
  dialoguesPracticed: number;
}

interface StatsState {
  days: Record<string, DayStats>;
  streak: number;
  totalWordsLearned: number;
  totalPracticeMinutes: number;
}

const STORAGE_KEY = 'lao-learner-stats';

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

function loadStats(): StatsState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { days: {}, streak: 0, totalWordsLearned: 0, totalPracticeMinutes: 0 };
  } catch {
    return { days: {}, streak: 0, totalWordsLearned: 0, totalPracticeMinutes: 0 };
  }
}

function saveStats(state: StatsState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function calculateStreak(days: Record<string, DayStats>): number {
  const today = getToday();
  let streak = 0;
  let date = new Date(today);
  
  while (true) {
    const dateStr = date.toISOString().split('T')[0];
    if (days[dateStr] && (days[dateStr].wordsLearned > 0 || days[dateStr].practiceMinutes > 0)) {
      streak++;
      date.setDate(date.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

export function useStats() {
  const [stats, setStats] = useState<StatsState>(loadStats);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  const recordWordLearned = useCallback(() => {
    setStats(prev => {
      const today = getToday();
      const dayStats = prev.days[today] || { date: today, wordsLearned: 0, practiceMinutes: 0, flashcardScore: 0, dialoguesPracticed: 0 };
      dayStats.wordsLearned++;
      const newDays = { ...prev.days, [today]: dayStats };
      return {
        ...prev,
        days: newDays,
        streak: calculateStreak(newDays),
        totalWordsLearned: prev.totalWordsLearned + 1,
      };
    });
  }, []);

  const recordPractice = useCallback((minutes: number) => {
    setStats(prev => {
      const today = getToday();
      const dayStats = prev.days[today] || { date: today, wordsLearned: 0, practiceMinutes: 0, flashcardScore: 0, dialoguesPracticed: 0 };
      dayStats.practiceMinutes += minutes;
      const newDays = { ...prev.days, [today]: dayStats };
      return {
        ...prev,
        days: newDays,
        streak: calculateStreak(newDays),
        totalPracticeMinutes: prev.totalPracticeMinutes + minutes,
      };
    });
  }, []);

  const recordFlashcard = useCallback((score: number) => {
    setStats(prev => {
      const today = getToday();
      const dayStats = prev.days[today] || { date: today, wordsLearned: 0, practiceMinutes: 0, flashcardScore: 0, dialoguesPracticed: 0 };
      dayStats.flashcardScore = Math.max(dayStats.flashcardScore, score);
      return {
        ...prev,
        days: { ...prev.days, [today]: dayStats },
      };
    });
  }, []);

  const recordDialogue = useCallback(() => {
    setStats(prev => {
      const today = getToday();
      const dayStats = prev.days[today] || { date: today, wordsLearned: 0, practiceMinutes: 0, flashcardScore: 0, dialoguesPracticed: 0 };
      dayStats.dialoguesPracticed++;
      const newDays = { ...prev.days, [today]: dayStats };
      return {
        ...prev,
        days: newDays,
        streak: calculateStreak(newDays),
      };
    });
  }, []);

  const getTodayStats = useCallback((): DayStats => {
    const today = getToday();
    return stats.days[today] || { date: today, wordsLearned: 0, practiceMinutes: 0, flashcardScore: 0, dialoguesPracticed: 0 };
  }, [stats]);

  const getWeekStats = useCallback((): DayStats[] => {
    const result: DayStats[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      result.push(stats.days[dateStr] || { date: dateStr, wordsLearned: 0, practiceMinutes: 0, flashcardScore: 0, dialoguesPracticed: 0 });
    }
    return result;
  }, [stats]);

  return {
    stats,
    recordWordLearned,
    recordPractice,
    recordFlashcard,
    recordDialogue,
    getTodayStats,
    getWeekStats,
  };
}
