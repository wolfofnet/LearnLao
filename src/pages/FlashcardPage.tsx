import { useState, useEffect } from 'react';
import { vocabulary } from '../data/vocabulary';

interface Props {
  goBack: () => void;
}

export default function FlashcardPage({ goBack }: Props) {
  const [cards, setCards] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [known, setKnown] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    // 随机选择20个词汇
    const indices = Array.from({ length: vocabulary.length }, (_, i) => i);
    const shuffled = indices.sort(() => Math.random() - 0.5).slice(0, 20);
    setCards(shuffled);
    setKnown(new Array(20).fill(false));
  }, []);

  if (cards.length === 0) return null;

  if (showResult) {
    const knownCount = known.filter(Boolean).length;
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">复习结果</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="text-6xl mb-4">
            {knownCount >= 16 ? '🎉' : knownCount >= 10 ? '👍' : '💪'}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {knownCount >= 16 ? '太棒了！' : knownCount >= 10 ? '不错！' : '继续加油！'}
          </h2>
          <p className="text-gray-600 mb-6">
            本次掌握 {knownCount}/{cards.length} 个词汇
          </p>

          <div className="w-full max-w-sm space-y-3">
            <button
              onClick={() => {
                const indices = Array.from({ length: vocabulary.length }, (_, i) => i);
                const shuffled = indices.sort(() => Math.random() - 0.5).slice(0, 20);
                setCards(shuffled);
                setKnown(new Array(20).fill(false));
                setCurrentIndex(0);
                setIsFlipped(false);
                setShowResult(false);
              }}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              再来一轮
            </button>
            <button
              onClick={goBack}
              className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    );
  }

  const current = vocabulary[cards[currentIndex]];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button onClick={goBack} className="p-2 hover:bg-gray-100 rounded-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">闪卡复习</h1>
          <p className="text-xs text-gray-500">{currentIndex + 1} / {cards.length}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white px-4 pb-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="w-full max-w-sm aspect-[3/2] bg-white rounded-3xl shadow-lg border-2 border-gray-100 
                     flex flex-col items-center justify-center p-6 transition-all duration-300 hover:shadow-xl
                     active:scale-[0.98]"
        >
          {!isFlipped ? (
            <>
              <div className="text-sm text-gray-400 mb-4">点击翻转</div>
              <div className="lao-text text-5xl font-bold text-gray-800 mb-2">{current.lao}</div>
              <div className="text-sm text-amber-600 font-mono">{current.pinyin}</div>
            </>
          ) : (
            <>
              <div className="text-sm text-gray-400 mb-4">中文释义</div>
              <div className="text-3xl font-bold text-gray-800 mb-2">{current.chinese}</div>
              <div className="text-sm text-gray-500">{current.category}</div>
            </>
          )}
        </button>

        {/* Action Buttons */}
        {isFlipped && (
          <div className="flex gap-4 mt-6 w-full max-w-sm">
            <button
              onClick={() => {
                const newKnown = [...known];
                newKnown[currentIndex] = false;
                setKnown(newKnown);
                if (currentIndex < cards.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                  setIsFlipped(false);
                } else {
                  setShowResult(true);
                }
              }}
              className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-semibold 
                         hover:bg-red-100 transition-colors border-2 border-red-200"
            >
              😅 不会
            </button>
            <button
              onClick={() => {
                const newKnown = [...known];
                newKnown[currentIndex] = true;
                setKnown(newKnown);
                if (currentIndex < cards.length - 1) {
                  setCurrentIndex(currentIndex + 1);
                  setIsFlipped(false);
                } else {
                  setShowResult(true);
                }
              }}
              className="flex-1 py-4 bg-green-50 text-green-600 rounded-2xl font-semibold 
                         hover:bg-green-100 transition-colors border-2 border-green-200"
            >
              😎 认识
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
