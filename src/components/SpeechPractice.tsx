import { useState, useEffect } from 'react';
import { useSpeech } from '../hooks/useSpeech';

interface Props {
  targetText: string;
  chineseText: string;
  pinyin?: string;
  onClose: () => void;
}

export default function SpeechPractice({ targetText, chineseText, pinyin, onClose }: Props) {
  const { 
    isListening, transcript, isSpeaking, ready,
    speakLao, speakSlow, speakChinese, speakThai,
    startListening, stopListening, compareText, stopSpeaking
  } = useSpeech();
  
  const [score, setScore] = useState<number | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [showDebug, setShowDebug] = useState(false);

  const log = (msg: string) => {
    setDebugLog(prev => [...prev.slice(-10), `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    log(`语音引擎${ready ? '就绪 ✅' : '加载中...'}`);
  }, [ready]);

  const handleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      setScore(null);
      setShowResult(false);
      const ok = startListening();
      log(ok ? '🎤 开始录音...' : '❌ 录音启动失败');
    }
  };

  useEffect(() => {
    if (!isListening && transcript) {
      const s = compareText(targetText, transcript);
      setScore(s);
      setShowResult(true);
      setAttempts(prev => [...prev, s]);
      log(`识别结果: "${transcript}" → ${s}分`);
    }
  }, [isListening, transcript, targetText, compareText]);

  const avgScore = attempts.length > 0 
    ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) 
    : 0;

  const getScoreEmoji = (s: number) => s >= 90 ? '🎉' : s >= 70 ? '👍' : s >= 50 ? '💪' : '😅';
  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-green-600 bg-green-50 border-green-200';
    if (s >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (s >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-t-3xl w-full max-w-[480px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-6 py-4 rounded-t-3xl">
          <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-center dark:text-white">🎤 语音跟读</h2>
        </div>

        <div className="px-6 py-4 space-y-4">
          {/* Target Text */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-5 text-center">
            <div className="text-xs text-blue-400 mb-2">跟读目标</div>
            <div className="lao-text text-4xl font-bold text-gray-800 dark:text-white mb-2">{targetText}</div>
            <div className="text-lg text-gray-600 dark:text-gray-300">{chineseText}</div>
            {pinyin && <div className="text-sm text-amber-600 dark:text-amber-400 mt-1 font-mono">{pinyin}</div>}
          </div>

          {/* Listen Buttons */}
          <div className="space-y-2">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">🔊 点击听发音：</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => { speakLao(targetText); log('🔊 老挝语发音'); }}
                disabled={isSpeaking}
                className="py-3 bg-blue-600 text-white rounded-xl font-semibold 
                           hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {isSpeaking ? '🔊 播放中' : '🇱🇦 老挝语'}
              </button>
              <button
                onClick={() => { speakSlow(targetText); log('🔊 慢速发音'); }}
                disabled={isSpeaking}
                className="py-3 bg-purple-600 text-white rounded-xl font-semibold 
                           hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {isSpeaking ? '🔊 播放中' : '🐢 慢速'}
              </button>
              <button
                onClick={() => { speakThai(targetText); log('🔊 泰语近似'); }}
                disabled={isSpeaking}
                className="py-3 bg-green-600 text-white rounded-xl font-semibold 
                           hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {isSpeaking ? '🔊 播放中' : '🇹🇭 泰语'}
              </button>
              <button
                onClick={() => { speakChinese(chineseText); log('🔊 中文意思'); }}
                disabled={isSpeaking}
                className="py-3 bg-amber-600 text-white rounded-xl font-semibold 
                           hover:bg-amber-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
              >
                {isSpeaking ? '🔊 播放中' : '🇨🇳 中文'}
              </button>
            </div>
          </div>

          {/* Record Button */}
          <button
            onClick={handleListen}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-200 ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200' 
                : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg'
            }`}
          >
            {isListening ? '⏹️ 停止录音' : '🎙️ 开始跟读'}
          </button>

          {/* Transcript */}
          {transcript && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="text-xs text-gray-400 mb-1">识别结果</div>
              <div className="lao-text text-xl text-gray-800 dark:text-white">{transcript}</div>
            </div>
          )}

          {/* Score */}
          {showResult && score !== null && (
            <div className={`rounded-2xl p-5 text-center border-2 ${getScoreColor(score)}`}>
              <div className="text-4xl mb-2">{getScoreEmoji(score)}</div>
              <div className="text-3xl font-bold mb-1">{score}分</div>
              <div className="text-sm opacity-75">
                {score >= 90 ? '太棒了！' : score >= 70 ? '不错！' : score >= 50 ? '加油！' : '再试一次！'}
              </div>
            </div>
          )}

          {/* Attempts */}
          {attempts.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">练习记录</span>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">平均 {avgScore} 分</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {attempts.map((a, i) => (
                  <span key={i} className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(a)}`}>{a}分</span>
                ))}
              </div>
            </div>
          )}

          {/* Debug Panel */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <button 
              onClick={() => setShowDebug(!showDebug)}
              className="w-full px-4 py-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 flex items-center justify-between"
            >
              <span>🔧 调试信息</span>
              <span>{showDebug ? '收起' : '展开'}</span>
            </button>
            {showDebug && (
              <div className="p-3 bg-gray-900 text-green-400 text-xs font-mono max-h-32 overflow-y-auto">
                {debugLog.length === 0 ? '暂无日志' : debugLog.map((l, i) => <div key={i}>{l}</div>)}
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              <span className="font-semibold">💡 使用说明：</span>
              <br/>• 老挝语/泰语按钮：听老挝语发音（浏览器会用泰语语音模拟）
              <br/>• 如果听不到声音：点击「🔧 调试信息」查看日志，截图给我排查
              <br/>• 推荐使用 <b>Chrome</b> 浏览器
            </p>
          </div>

          {/* Close */}
          <button
            onClick={() => { stopSpeaking(); onClose(); }}
            className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
}
