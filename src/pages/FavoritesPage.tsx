import { useMemo } from 'react';
import { vocabulary } from '../data/vocabulary';
import { useSpeech } from '../hooks/useSpeech';
import { useFavorites } from '../hooks/useFavorites';

interface Props {
  goBack: () => void;
}

export default function FavoritesPage({ goBack }: Props) {
  const { favorites, toggleFavorite, clearFavorites } = useFavorites();
  const { speakLao, isSpeaking } = useSpeech();

  const favoriteWords = useMemo(() => {
    return vocabulary.filter(v => favorites.words.includes(v.lao));
  }, [favorites]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={goBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <svg className="w-5 h-5 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold dark:text-white flex-1">我的收藏</h1>
        {favoriteWords.length > 0 && (
          <button
            onClick={() => {
              if (confirm('确定清空所有收藏？')) clearFavorites();
            }}
            className="text-sm text-red-500 hover:text-red-600"
          >
            清空
          </button>
        )}
      </div>

      <div className="px-4 py-4">
        {favoriteWords.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📌</div>
            <h2 className="text-xl font-semibold dark:text-white mb-2">还没有收藏</h2>
            <p className="text-gray-500 dark:text-gray-400">在词汇页面点击 ❤️ 收藏常用词汇</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">已收藏 {favoriteWords.length} 个词汇</p>
            {favoriteWords.map((item, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="lao-text text-2xl font-semibold text-gray-800 dark:text-white">{item.lao}</span>
                      <span className="text-xs px-2 py-0.5 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 mt-1">{item.chinese}</div>
                    <div className="text-sm text-amber-600 dark:text-amber-400 mt-1 font-mono">{item.pinyin}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => speakLao(item.lao)}
                      disabled={isSpeaking}
                      className="w-9 h-9 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center"
                    >
                      🔊
                    </button>
                    <button
                      onClick={() => toggleFavorite(item.lao)}
                      className="w-9 h-9 bg-red-100 text-red-500 rounded-full flex items-center justify-center"
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
