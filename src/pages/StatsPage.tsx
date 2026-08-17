import { useStats } from '../hooks/useStats';

interface Props {
  goBack: () => void;
}

const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

export default function StatsPage({ goBack }: Props) {
  const { stats, getTodayStats, getWeekStats } = useStats();
  const today = getTodayStats();
  const week = getWeekStats();
  const maxWords = Math.max(...week.map(d => d.wordsLearned), 1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={goBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <svg className="w-5 h-5 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold dark:text-white">学习统计</h1>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Streak Card */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-80">连续学习</div>
              <div className="text-5xl font-bold mt-1">{stats.streak}</div>
              <div className="text-sm opacity-80 mt-1">天</div>
            </div>
            <div className="text-6xl">🔥</div>
          </div>
        </div>

        {/* Today Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">📊 今日学习</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{today.wordsLearned}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">学习词汇</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/30 rounded-xl">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{today.practiceMinutes}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">练习分钟</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{today.flashcardScore}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">闪卡最高分</div>
            </div>
            <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
              <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{today.dialoguesPracticed}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">对话练习</div>
            </div>
          </div>
        </div>

        {/* Week Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">📈 本周学习</h2>
          <div className="flex items-end justify-between h-32 gap-2">
            {week.map((day, i) => {
              const date = new Date(day.date);
              const dayName = weekDays[date.getDay()];
              const height = Math.max((day.wordsLearned / maxWords) * 100, 4);
              const isToday = i === 6;
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-400">{day.wordsLearned || ''}</span>
                  <div className="w-full flex items-end justify-center" style={{ height: '100px' }}>
                    <div 
                      className={`w-full max-w-[24px] rounded-t-md transition-all ${
                        isToday ? 'bg-blue-500' : 'bg-blue-200 dark:bg-blue-800'
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className={`text-xs ${isToday ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                    {dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">🏆 累计成就</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">📚 累计学习词汇</span>
              <span className="font-bold text-gray-800 dark:text-white">{stats.totalWordsLearned} 个</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">⏱️ 累计练习时长</span>
              <span className="font-bold text-gray-800 dark:text-white">{stats.totalPracticeMinutes} 分钟</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">🔥 最长连续学习</span>
              <span className="font-bold text-gray-800 dark:text-white">{stats.streak} 天</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
