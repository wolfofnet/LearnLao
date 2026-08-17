import { useState, useCallback, useEffect } from 'react';
import { useSpeech } from '../hooks/useSpeech';
import { useStats } from '../hooks/useStats';

interface Props {
  goBack: () => void;
}

// 声调游戏数据
const toneExamples = [
  { lao: 'ກາ', tone: 1, meaning: '乌鸦', toneName: 'สามัญ' },
  { lao: 'ກ່າ', tone: 2, meaning: '过', toneName: 'เอก' },
  { lao: 'ກ້າ', tone: 3, meaning: '勇敢', toneName: 'โท' },
  { lao: 'ມາ', tone: 1, meaning: '来', toneName: 'สามัญ' },
  { lao: 'ໝ່າ', tone: 2, meaning: '骂', toneName: 'เอก' },
  { lao: 'ມ້າ', tone: 3, meaning: '马', toneName: 'โท' },
  { lao: 'ປາ', tone: 1, meaning: '鱼', toneName: 'สามัญ' },
  { lao: 'ປ່າ', tone: 2, meaning: '森林', toneName: 'เอก' },
  { lao: 'ປ້າ', tone: 3, meaning: '姑妈', toneName: 'โท' },
  { lao: 'ຂາ', tone: 1, meaning: '腿', toneName: 'สามัญ' },
  { lao: 'ຂ່າ', tone: 2, meaning: '姜', toneName: 'เอก' },
  { lao: 'ຂ້າ', tone: 3, meaning: '杀', toneName: 'โท' },
];

interface Question {
  word: typeof toneExamples[0];
  options: number[];
  correctIndex: number;
}

function generateQuestion(): Question {
  const word = toneExamples[Math.floor(Math.random() * toneExamples.length)];
  const options: number[] = [word.tone];
  while (options.length < 3) {
    const t = Math.floor(Math.random() * 3) + 1;
    if (!options.includes(t)) options.push(t);
  }
  // Shuffle
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return {
    word,
    options,
    correctIndex: options.indexOf(word.tone),
  };
}

const toneLabels: Record<number, string> = {
  1: '第1声（中平）',
  2: '第2声（低降）',
  3: '第3声（高降）',
};

const toneColors: Record<number, string> = {
  1: 'bg-blue-500',
  2: 'bg-green-500',
  3: 'bg-orange-500',
};

export default function ToneGamePage({ goBack }: Props) {
  const [question, setQuestion] = useState<Question>(generateQuestion());
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { speakLao, isSpeaking } = useSpeech();
  const { recordFlashcard } = useStats();

  const handleAnswer = useCallback((index: number) => {
    if (selected !== null) return;
    
    setSelected(index);
    setShowResult(true);
    setTotal(prev => prev + 1);
    
    if (index === question.correctIndex) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  }, [selected, question]);

  const nextQuestion = useCallback(() => {
    setSelected(null);
    setShowResult(false);
    setQuestion(generateQuestion());
  }, []);

  useEffect(() => {
    if (total > 0) {
      recordFlashcard(Math.round((score / total) * 100));
    }
  }, [total, score, recordFlashcard]);

  const accuracy = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button onClick={goBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
          <svg className="w-5 h-5 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold dark:text-white flex-1">声调小游戏</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {score}/{total} ({accuracy}%)
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Streak */}
        {streak >= 3 && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-4 text-white text-center">
            <span className="text-2xl">🔥</span>
            <span className="font-bold ml-2">连对 {streak} 题！</span>
          </div>
        )}

        {/* Question */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">这个字是第几声？</div>
          <div className="lao-text text-7xl font-bold text-gray-800 dark:text-white my-6">
            {question.word.lao}
          </div>
          <div className="text-gray-600 dark:text-gray-300 mb-4">意思：{question.word.meaning}</div>
          
          <button
            onClick={() => speakLao(question.word.lao)}
            disabled={isSpeaking}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold 
                       hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSpeaking ? '🔊 播放中...' : '🔊 再听一遍'}
          </button>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((tone, i) => {
            const isCorrect = i === question.correctIndex;
            const isSelected = i === selected;
            
            let bgColor = 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700';
            if (showResult) {
              if (isCorrect) bgColor = 'bg-green-50 dark:bg-green-900/30 border-green-500';
              else if (isSelected) bgColor = 'bg-red-50 dark:bg-red-900/30 border-red-500';
            }
            
            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selected !== null}
                className={`w-full p-4 rounded-2xl border-2 transition-all ${bgColor} 
                           ${selected === null ? 'hover:border-blue-300 active:scale-[0.98]' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${toneColors[tone]} rounded-xl flex items-center justify-center text-white font-bold text-xl`}>
                    {tone}
                  </div>
                  <div className="text-left flex-1">
                    <div className="font-semibold text-gray-800 dark:text-white">{toneLabels[tone]}</div>
                  </div>
                  {showResult && isCorrect && <span className="text-2xl">✅</span>}
                  {showResult && isSelected && !isCorrect && <span className="text-2xl">❌</span>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Result & Next */}
        {showResult && (
          <div className="space-y-3">
            <div className={`p-4 rounded-2xl text-center ${
              selected === question.correctIndex 
                ? 'bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800' 
                : 'bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800'
            }`}>
              {selected === question.correctIndex ? (
                <div>
                  <div className="text-2xl mb-1">🎉</div>
                  <div className="font-semibold text-green-700 dark:text-green-300">答对了！</div>
                </div>
              ) : (
                <div>
                  <div className="text-2xl mb-1">😅</div>
                  <div className="font-semibold text-red-700 dark:text-red-300">
                    答错了，正确答案是 {toneLabels[question.word.tone]}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={nextQuestion}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg 
                         hover:bg-blue-700 transition-colors"
            >
              下一题 →
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">📊 本次成绩</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{score}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">答对</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">{total}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">总题数</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{accuracy}%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">正确率</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
