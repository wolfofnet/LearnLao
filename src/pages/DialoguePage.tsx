import { useState } from 'react';
import { dialogues } from '../data/dialogues';
import { useSpeech } from '../hooks/useSpeech';
import SpeechPractice from '../components/SpeechPractice';

interface Props {
  goBack: () => void;
}

export default function DialoguePage({ goBack }: Props) {
  const [selectedDialogue, setSelectedDialogue] = useState<number | null>(null);
  const [showPinyin, setShowPinyin] = useState(true);
  const [practiceLine, setPracticeLine] = useState<{lao: string; chinese: string; pinyin: string} | null>(null);
  const { speakLao, isSpeaking } = useSpeech();

  if (selectedDialogue !== null) {
    const dialogue = dialogues[selectedDialogue];
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
          <button onClick={() => setSelectedDialogue(null)} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{dialogue.title}</h1>
            <p className="text-xs text-gray-500">{dialogue.scenario}</p>
          </div>
          <button
            onClick={() => setShowPinyin(!showPinyin)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium ${
              showPinyin ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {showPinyin ? '隐藏拼音' : '显示拼音'}
          </button>
        </div>

        {/* Dialogue */}
        <div className="px-4 py-4 space-y-3">
          {dialogue.lines.map((line, i) => (
            <div key={i} className={`flex ${line.speaker === 'A' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[85%] rounded-2xl p-4 ${
                line.speaker === 'A' 
                  ? 'bg-white border border-gray-200' 
                  : 'bg-blue-600 text-white'
              }`}>
                <div className={`text-xs mb-1 ${line.speaker === 'A' ? 'text-gray-400' : 'text-blue-200'}`}>
                  {line.speaker === 'A' ? '你' : '老挝人'}
                </div>
                <div className={`lao-text text-xl font-semibold ${line.speaker === 'A' ? 'text-gray-800' : 'text-white'}`}>
                  {line.lao}
                </div>
                <div className={`text-sm mt-1 ${line.speaker === 'A' ? 'text-gray-600' : 'text-blue-100'}`}>
                  {line.chinese}
                </div>
                {showPinyin && (
                  <div className={`text-xs mt-1 font-mono ${line.speaker === 'A' ? 'text-amber-600' : 'text-blue-200'}`}>
                    {line.pinyin}
                  </div>
                )}
                
                {/* 语音按钮 */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => speakLao(line.lao)}
                    disabled={isSpeaking}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors disabled:opacity-50 ${
                      line.speaker === 'A'
                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        : 'bg-blue-500 text-white hover:bg-blue-400'
                    }`}
                  >
                    🔊 听
                  </button>
                  <button
                    onClick={() => setPracticeLine({lao: line.lao, chinese: line.chinese, pinyin: line.pinyin})}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      line.speaker === 'A'
                        ? 'bg-green-100 text-green-600 hover:bg-green-200'
                        : 'bg-green-500 text-white hover:bg-green-400'
                    }`}
                  >
                    🎤 读
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Practice All Button */}
        <div className="px-4 pb-6">
          <button
            onClick={() => {
              const fullLao = dialogue.lines.map(l => l.lao).join(' ');
              const fullChinese = dialogue.lines.map(l => l.chinese).join(' ');
              setPracticeLine({lao: fullLao, chinese: fullChinese, pinyin: ''});
            }}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-bold text-lg 
                       hover:shadow-lg transition-all"
          >
            🎤 整段跟读练习
          </button>
        </div>

        {/* Speech Practice Modal */}
        {practiceLine && (
          <SpeechPractice
            targetText={practiceLine.lao}
            chineseText={practiceLine.chinese}
            pinyin={practiceLine.pinyin}
            onClose={() => setPracticeLine(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">常用对话</h1>
      </div>

      {/* Dialogue List */}
      <div className="px-4 py-4 space-y-3">
        {dialogues.map((d, i) => (
          <button
            key={i}
            onClick={() => setSelectedDialogue(i)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm border border-gray-100 
                       hover:shadow-md hover:border-blue-200 transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                💬
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{d.title}</h3>
                <p className="text-sm text-gray-500">{d.scenario}</p>
                <p className="text-xs text-gray-400 mt-1">{d.lines.length} 句对话 · 🎤 支持跟读</p>
              </div>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
