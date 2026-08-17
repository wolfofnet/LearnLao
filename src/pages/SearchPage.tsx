import { useState, useMemo } from 'react';
import { vocabulary } from '../data/vocabulary';
import { useSpeech } from '../hooks/useSpeech';
import { useFavorites } from '../hooks/useFavorites';

interface Props {
  goBack: () => void;
}

export default function SearchPage({ goBack }: Props) {
  const [query, setQuery] = useState('');
  const { speakLao, isSpeaking } = useSpeech();
  const { toggleFavorite, isFavorite } = useFavorites();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return vocabulary.filter(v => 
      v.lao.includes(q) || 
      v.chinese.includes(q) || 
      v.pinyin.toLowerCase().includes(q) ||
      v.category.includes(q)
    );
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <svg className="w-5 h-5 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索词汇（中文/老挝文/拼音）"
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm 
                         dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 py-4">
        {query.trim() === '' ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500 dark:text-gray-400">输入中文、老挝文或拼音搜索</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">😅</div>
            <p className="text-gray-500 dark:text-gray-400">没找到匹配的词汇</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">试试其他关键词</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">找到 {results.length} 个结果</p>
            {results.map((item, i) => (
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
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        isFavorite(item.lao) 
                          ? 'bg-red-100 text-red-500' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                      }`}
                    >
                      {isFavorite(item.lao) ? '❤️' : '🤍'}
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
