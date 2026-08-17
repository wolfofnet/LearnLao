import { useState } from 'react';
import { vocabulary, categories } from '../data/vocabulary';
import { useSpeech } from '../hooks/useSpeech';
import SpeechPractice from '../components/SpeechPractice';

interface Props {
  goBack: () => void;
}

export default function VocabularyPage({ goBack }: Props) {
  const [category, setCategory] = useState<string>('all');
  const [showPinyin, setShowPinyin] = useState(true);
  const [practiceIndex, setPracticeIndex] = useState<number | null>(null);
  const { speakLao, isSpeaking } = useSpeech();

  const filtered = category === 'all' 
    ? vocabulary 
    : vocabulary.filter(v => v.category === category);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold flex-1">实用词汇</h1>
        <button
          onClick={() => setShowPinyin(!showPinyin)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium ${
            showPinyin ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
          }`}
        >
          {showPinyin ? '隐藏拼音' : '显示拼音'}
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 px-4 py-3 bg-white border-b border-gray-100 overflow-x-auto">
        <button
          onClick={() => setCategory('all')}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            category === 'all'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          全部
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              category === cat
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Vocabulary List */}
      <div className="px-4 py-4 space-y-2">
        {filtered.map((item, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="lao-text text-2xl font-semibold text-gray-800">{item.lao}</span>
                  <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                    {item.category}
                  </span>
                </div>
                <div className="text-gray-700 mt-1">{item.chinese}</div>
                {showPinyin && (
                  <div className="text-sm text-amber-600 mt-1 font-mono">{item.pinyin}</div>
                )}
              </div>
              
              <div className="flex gap-2">
                {/* 听发音按钮 */}
                <button
                  onClick={() => speakLao(item.lao)}
                  disabled={isSpeaking}
                  className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center 
                             hover:bg-blue-200 transition-colors disabled:opacity-50"
                  title="听发音"
                >
                  🔊
                </button>
                
                {/* 跟读练习按钮 */}
                <button
                  onClick={() => setPracticeIndex(i)}
                  className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center 
                             hover:bg-green-200 transition-colors"
                  title="跟读练习"
                >
                  🎤
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Speech Practice Modal */}
      {practiceIndex !== null && filtered[practiceIndex] && (
        <SpeechPractice
          targetText={filtered[practiceIndex].lao}
          chineseText={filtered[practiceIndex].chinese}
          pinyin={filtered[practiceIndex].pinyin}
          onClose={() => setPracticeIndex(null)}
        />
      )}
    </div>
  );
}
