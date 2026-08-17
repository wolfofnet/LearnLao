import type { Page } from '../hooks/useNavigation';
import { useTheme } from '../hooks/useTheme';
import { useStats } from '../hooks/useStats';
import { useSpeech } from '../hooks/useSpeech';

interface Props {
  navigate: (page: Page) => void;
}

const mainFeatures = [
  { page: 'alphabet' as Page, icon: 'ອ', title: '字母表', subtitle: '27个辅音', gradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/25' },
  { page: 'tone' as Page, icon: '່', title: '声调', subtitle: '6个声调', gradient: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/25' },
  { page: 'vocabulary' as Page, icon: '词', title: '词汇', subtitle: '做生意必备', gradient: 'from-green-500 to-emerald-600', shadow: 'shadow-green-500/25' },
  { page: 'dialogue' as Page, icon: '💬', title: '对话', subtitle: '砍价·打车', gradient: 'from-orange-500 to-amber-500', shadow: 'shadow-orange-500/25' },
];

const tools = [
  { page: 'calculator' as Page, icon: '🧮', title: '计算器', subtitle: '报价神器', accent: 'bg-orange-50 dark:bg-orange-900/20' },
  { page: 'flashcard' as Page, icon: '🃏', title: '闪卡', subtitle: '间隔重复', accent: 'bg-red-50 dark:bg-red-900/20' },
  { page: 'scenario' as Page, icon: '📍', title: '场景', subtitle: '海关·银行', accent: 'bg-teal-50 dark:bg-teal-900/20' },
  { page: 'tone-game' as Page, icon: '🎮', title: '游戏', subtitle: '寓教于乐', accent: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { page: 'search' as Page, icon: '🔍', title: '搜索', subtitle: '中老双向', accent: 'bg-cyan-50 dark:bg-cyan-900/20' },
  { page: 'favorites' as Page, icon: '📌', title: '收藏', subtitle: '我的词汇', accent: 'bg-pink-50 dark:bg-pink-900/20' },
  { page: 'stats' as Page, icon: '📊', title: '统计', subtitle: '学习进度', accent: 'bg-amber-50 dark:bg-amber-900/20' },
];

export default function HomePage({ navigate }: Props) {
  const { toggleTheme, isDark } = useTheme();
  const { getTodayStats, stats } = useStats();
  const { speakLao, isSpeaking } = useSpeech();
  const today = getTodayStats();

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#0A0A0A] page-enter">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="gradient-orange px-6 pt-14 pb-10 rounded-b-[32px]">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">🇱🇦</span>
                  <h1 className="text-[28px] font-bold text-white tracking-tight">老挝语学习</h1>
                </div>
                <p className="text-white/70 text-sm font-medium">在老挝做生意必备工具</p>
              </div>
              <button
                onClick={toggleTheme}
                className="w-10 h-10 bg-white/15 rounded-2xl flex items-center justify-center hover:bg-white/25 transition-all active:scale-90"
              >
                <span className="text-lg">{isDark ? '☀️' : '🌙'}</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="flex gap-2.5">
              {[
                { value: today.wordsLearned, label: '今日词汇', icon: '📖' },
                { value: stats.streak, label: '连续天数', icon: '🔥' },
                { value: stats.totalWordsLearned, label: '累计词汇', icon: '🏆' },
              ].map((s, i) => (
                <div key={i} className="flex-1 bg-white/12 rounded-2xl p-3 backdrop-blur-sm">
                  <div className="text-lg mb-0.5">{s.icon}</div>
                  <div className="text-2xl font-bold text-white">{s.value}</div>
                  <div className="text-[10px] text-white/60 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - 4 main features */}
      <div className="px-5 -mt-4 relative z-10">
        <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-5 shadow-lg shadow-black/5">
          <div className="grid grid-cols-4 gap-3">
            {mainFeatures.map(item => (
              <button
                key={item.page}
                onClick={() => navigate(item.page)}
                className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} ${item.shadow} shadow-lg flex items-center justify-center`}>
                  <span className="text-white text-2xl font-bold">{item.icon}</span>
                </div>
                <div className="text-center">
                  <div className="text-xs font-semibold text-gray-800 dark:text-white">{item.title}</div>
                  <div className="text-[10px] text-gray-400">{item.subtitle}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audio Test Card */}
      <div className="px-5 mt-4">
        <button
          onClick={() => speakLao('ສະບາຍດີ')}
          disabled={isSpeaking}
          className="w-full bg-white dark:bg-[#1A1A1A] rounded-3xl p-5 shadow-sm flex items-center gap-4 card-press"
        >
          <div className="w-12 h-12 rounded-2xl gradient-blue flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white text-xl">{isSpeaking ? '🔊' : '▶️'}</span>
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-semibold text-gray-800 dark:text-white">
              {isSpeaking ? '正在播放...' : '测试语音'}
            </div>
            <div className="text-xs text-gray-400">点击测试老挝语发音是否正常</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
            <span className="text-sm">🇱🇦</span>
          </div>
        </button>
      </div>

      {/* Tools Grid */}
      <div className="px-5 mt-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-gray-800 dark:text-white">实用工具</h2>
          <span className="text-xs text-gray-400">更多 →</span>
        </div>
        <div className="grid grid-cols-4 gap-2.5">
          {tools.map(item => (
            <button
              key={item.page}
              onClick={() => navigate(item.page)}
              className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-3.5 shadow-sm card-press flex flex-col items-center gap-2"
            >
              <div className={`w-11 h-11 rounded-xl ${item.accent} flex items-center justify-center`}>
                <span className="text-xl">{item.icon}</span>
              </div>
              <div className="text-center">
                <div className="text-[11px] font-semibold text-gray-800 dark:text-white">{item.title}</div>
                <div className="text-[9px] text-gray-400">{item.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Tip */}
      <div className="px-5 mt-5 mb-6">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 rounded-3xl p-5 border border-amber-100 dark:border-amber-900/20">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">学习提示</div>
              <div className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                老挝语是声调语言，先从字母表开始，熟悉辅音分类（中/高/低）对掌握声调很重要！
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
