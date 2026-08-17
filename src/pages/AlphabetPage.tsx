import { useState } from 'react';
import { consonants } from '../data/alphabet';
import { useSpeech } from '../hooks/useSpeech';
import SpeechPractice from '../components/SpeechPractice';

type ConsonantClass = 'all' | 'mid' | 'high' | 'low';

const classColors: Record<string, string> = {
  mid: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  high: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  low: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
};

const classGradients: Record<string, string> = {
  mid: 'from-blue-500 to-blue-600',
  high: 'from-red-500 to-red-600',
  low: 'from-green-500 to-emerald-600',
};

const classLabels: Record<string, string> = {
  mid: '中辅音',
  high: '高辅音',
  low: '低辅音',
};

interface Props {
  goBack: () => void;
}

export default function AlphabetPage({ goBack }: Props) {
  const [filter, setFilter] = useState<ConsonantClass>('all');
  const [selected, setSelected] = useState<number | null>(null);
  const [practiceConsonant, setPracticeConsonant] = useState<typeof consonants[0] | null>(null);
  const { speakLao, isSpeaking } = useSpeech();

  const filtered = filter === 'all'
    ? consonants
    : consonants.filter(c => c.class === filter);

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#0A0A0A] page-enter">
      {/* Header */}
      <div className="glass bg-white/80 dark:bg-black/80 border-b border-gray-200/50 dark:border-gray-800/50 px-5 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={goBack} className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors active:scale-90">
          <svg className="w-4 h-4 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-base font-bold dark:text-white">字母表</h1>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 py-3">
        <div className="flex gap-2 bg-white dark:bg-[#1A1A1A] rounded-2xl p-1.5 shadow-sm">
          {(['all', 'mid', 'high', 'low'] as const).map(cls => (
            <button
              key={cls}
              onClick={() => { setFilter(cls); setSelected(null); }}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                filter === cls
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {cls === 'all' ? '全部' : classLabels[cls]}
            </button>
          ))}
        </div>
      </div>

      {/* Alphabet Grid */}
      <div className="px-5 pb-4">
        <div className="grid grid-cols-3 gap-2.5">
          {filtered.map((c, i) => (
            <button
              key={`${c.char}-${i}`}
              onClick={() => setSelected(selected === i ? null : i)}
              className={`bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 shadow-sm transition-all duration-200 card-press
                ${selected === i
                  ? 'ring-2 ring-orange-500 shadow-md shadow-orange-500/10'
                  : ''
                }`}
            >
              <div className="lao-text text-4xl font-bold text-center text-gray-800 dark:text-white mb-1.5">
                {c.char}
              </div>
              <div className="text-[10px] text-gray-400 text-center mb-2">{c.name}</div>
              <div className={`text-[10px] text-center px-2 py-0.5 rounded-full font-medium ${classColors[c.class]}`}>
                {classLabels[c.class]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail Panel - Bottom Sheet */}
      {selected !== null && filtered[selected] && (
        <div className="fixed inset-0 z-20" onClick={() => setSelected(null)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1A1A1A] rounded-t-[28px] p-6 max-w-[480px] mx-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-5" />

            {/* Character */}
            <div className="flex items-start gap-5 mb-5">
              <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${classGradients[filtered[selected].class]} flex items-center justify-center shadow-lg`}>
                <span className="lao-text text-5xl font-bold text-white">{filtered[selected].char}</span>
              </div>
              <div className="flex-1 pt-1">
                <div className="text-xl font-bold text-gray-800 dark:text-white mb-1">{filtered[selected].name}</div>
                <div className="flex gap-2 mb-2">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 font-medium">
                    声母: {filtered[selected].sound}
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-medium">
                    近似: {filtered[selected].pinyin}
                  </span>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-medium ${classColors[filtered[selected].class]}`}>
                  {classLabels[filtered[selected].class]} · {filtered[selected].meaning}
                </span>
              </div>
            </div>

            {/* Example */}
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 mb-5">
              <div className="text-[10px] text-gray-400 mb-1.5 font-medium uppercase tracking-wider">示例单词</div>
              <div className="flex items-baseline gap-3">
                <span className="lao-text text-3xl font-bold text-gray-800 dark:text-white">{filtered[selected].example}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{filtered[selected].exampleMeaning}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2.5">
              <button
                onClick={() => speakLao(filtered[selected].name, 1.3)}
                disabled={isSpeaking}
                className="flex-1 py-3.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-semibold text-sm shadow-lg shadow-blue-500/25 active:scale-[0.97] transition-transform disabled:opacity-50"
              >
                🔊 听发音
              </button>
              <button
                onClick={() => speakLao(filtered[selected].example, 1.3)}
                disabled={isSpeaking}
                className="flex-1 py-3.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl font-semibold text-sm shadow-lg shadow-purple-500/25 active:scale-[0.97] transition-transform disabled:opacity-50"
              >
                🔊 听例词
              </button>
            </div>

            <button
              onClick={() => { setPracticeConsonant(filtered[selected]); setSelected(null); }}
              className="w-full mt-2.5 py-3.5 gradient-green text-white rounded-2xl font-semibold text-sm shadow-lg shadow-green-500/25 active:scale-[0.97] transition-transform"
            >
              🎤 跟读练习
            </button>
          </div>
        </div>
      )}

      {/* Speech Practice Modal */}
      {practiceConsonant && (
        <SpeechPractice
          targetText={practiceConsonant.char}
          chineseText={practiceConsonant.name}
          pinyin={practiceConsonant.pinyin}
          onClose={() => setPracticeConsonant(null)}
        />
      )}
    </div>
  );
}
