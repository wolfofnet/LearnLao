import { useState } from 'react';
import { tones, toneMarks } from '../data/alphabet';

interface Props {
  goBack: () => void;
}

const toneColors = [
  'bg-blue-500',
  'bg-green-500', 
  'bg-orange-500',
  'bg-red-500',
  'bg-purple-500',
  'bg-gray-500',
];

export default function TonePage({ goBack }: Props) {
  const [selectedTone, setSelectedTone] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">声调学习</h1>
      </div>

      {/* Intro */}
      <div className="px-4 py-4">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">🎯 重点：</span>老挝语有6个声调，声调不同意思完全不同。
            掌握声调是说好老挝语的关键！
          </p>
        </div>
      </div>

      {/* Tone Marks */}
      <div className="px-4 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">声调符号</h2>
        <div className="grid grid-cols-4 gap-2">
          {toneMarks.map((mark, i) => (
            <div key={i} className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-100">
              <div className="lao-text text-3xl font-bold text-blue-600 mb-1">
                ກ{mark.mark}
              </div>
              <div className="text-xs text-gray-500">{mark.name}</div>
              <div className="text-xs text-amber-600">{mark.effect}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tones */}
      <div className="px-4 pb-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">6个声调</h2>
        <div className="space-y-3">
          {tones.map((tone, i) => (
            <button
              key={i}
              onClick={() => setSelectedTone(selectedTone === i ? null : i)}
              className={`w-full bg-white rounded-2xl p-4 shadow-sm border-2 transition-all duration-200 text-left
                ${selectedTone === i ? 'border-blue-500 shadow-md' : 'border-transparent'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${toneColors[i]} rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md`}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-800">{tone.name}</h3>
                    <span className="text-lg">{tone.pattern}</span>
                  </div>
                  <p className="text-sm text-gray-600">{tone.description}</p>
                </div>
              </div>

              {selectedTone === i && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-gray-400 mb-1">示例</div>
                      <div className="lao-text text-2xl font-semibold text-gray-800">{tone.example}</div>
                      <div className="text-sm text-gray-600">{tone.exampleMeaning}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400 mb-1">声调走向</div>
                      <div className="text-3xl">{tone.pattern}</div>
                    </div>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="px-4 pb-8">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p className="text-sm text-amber-800">
            <span className="font-semibold">💡 学习技巧：</span>
            先记住中辅音的声调作为基准，然后理解高辅音和低辅音的声调变化规律。
            多听多模仿是掌握声调的最好方法！
          </p>
        </div>
      </div>
    </div>
  );
}
