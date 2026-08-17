import { useState, useCallback, useRef, useEffect } from 'react';
import audioMap from '../audio-map.json';

// Pre-generated audio paths for Lao text
const laoAudioMap: Record<string, { normal: string; slow: string }> = audioMap as any;

// GitHub Pages 子路径：运行时拼接 base
const base = import.meta.env.BASE_URL || '/';

export function useSpeech() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ready, setReady] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 初始化
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    synthRef.current = window.speechSynthesis;
    audioRef.current = new Audio();
    
    const loadVoices = () => {
      const v = synthRef.current?.getVoices() || [];
      voicesRef.current = v;
      if (v.length > 0) setReady(true);
    };
    
    // Chrome 需要等 voiceschanged 事件
    loadVoices();
    synthRef.current?.addEventListener('voiceschanged', loadVoices);
    
    // 强制触发加载
    if (synthRef.current) {
      const u = new SpeechSynthesisUtterance('');
      synthRef.current.speak(u);
      synthRef.current.cancel();
    }
    
    // Audio 事件
    const audio = audioRef.current;
    audio.onended = () => setIsSpeaking(false);
    audio.onerror = () => setIsSpeaking(false);
    
    return () => {
      synthRef.current?.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  // 找最佳语音（非老挝语时使用）
  const findBestVoice = useCallback((targetLang: string): SpeechSynthesisVoice | null => {
    const voices = voicesRef.current;
    if (voices.length === 0) return null;
    
    const langPrefix = targetLang.split('-')[0];
    
    let v = voices.find(x => x.lang === targetLang);
    if (v) return v;
    
    v = voices.find(x => x.lang.startsWith(langPrefix));
    if (v) return v;
    
    if (langPrefix === 'lo') {
      v = voices.find(x => x.lang.startsWith('th'));
      if (v) return v;
    }
    
    v = voices.find(x => x.lang.startsWith('zh'));
    if (v) return v;
    
    v = voices.find(x => x.lang.startsWith('en'));
    return v || voices[0] || null;
  }, []);

  // 播放预生成的音频文件
  const playAudioFile = useCallback((src: string, rate: number = 1) => {
    const audio = audioRef.current;
    if (!audio) return false;
    
    // 停止之前的播放
    audio.pause();
    audio.currentTime = 0;
    synthRef.current?.cancel();
    
    // 拼接 Vite base 路径（兼容 GitHub Pages 子路径部署）
    const fullSrc = base + src.replace(/^\//, '');
    audio.src = fullSrc;
    audio.playbackRate = rate;
    audio.play().then(() => {
      setIsSpeaking(true);
    }).catch((e) => {
      console.error('音频播放失败:', fullSrc, e);
      setIsSpeaking(false);
    });
    return true;
  }, []);

  // 顺序播放多个音频片段
  const playAudioSequence = useCallback((srcs: string[], rate: number = 1) => {
    const audio = audioRef.current;
    if (!audio || srcs.length === 0) return false;

    audio.pause();
    audio.currentTime = 0;
    synthRef.current?.cancel();

    let index = 0;
    const playNext = () => {
      if (index >= srcs.length) {
        setIsSpeaking(false);
        return;
      }
      const fullSrc = base + srcs[index].replace(/^\//, '');
      audio.src = fullSrc;
      audio.playbackRate = rate;
      audio.play().catch(() => {
        // 跳过失败的片段，继续下一个
        index++;
        playNext();
      });
    };

    audio.onended = () => {
      index++;
      playNext();
    };

    setIsSpeaking(true);
    playNext();
    return true;
  }, []);

  // 停止播放
  const stopAll = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      audio.onended = () => setIsSpeaking(false); // 重置 onended
    }
    synthRef.current?.cancel();
    setIsSpeaking(false);
  }, []);

  // 非老挝语的 Web Speech API 朗读
  const speakText = useCallback((text: string, lang: string) => {
    const synth = synthRef.current;
    if (!synth) {
      alert('浏览器不支持语音合成');
      return;
    }
    
    synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (lang === 'th') {
      utterance.lang = 'th-TH';
    } else if (lang === 'zh') {
      utterance.lang = 'zh-CN';
    } else {
      utterance.lang = lang;
    }
    
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    const voice = findBestVoice(utterance.lang);
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('朗读错误:', e.error);
      setIsSpeaking(false);
    };
    
    synth.speak(utterance);
  }, [findBestVoice]);

  // 老挝语（使用预生成音频）
  const speakLao = useCallback((text: string, rate: number = 1) => {
    const entry = laoAudioMap[text];
    if (entry?.normal) {
      playAudioFile(entry.normal, rate);
    } else {
      // 尝试按空格拆分为多个词顺序播放
      const words = text.split(/\s+/).filter(Boolean);
      const srcs = words.map(w => laoAudioMap[w]?.normal).filter(Boolean) as string[];
      if (srcs.length === words.length && srcs.length > 0) {
        playAudioSequence(srcs, rate);
      } else {
        // Fallback: 无预生成音频时尝试 Web Speech API
        console.warn('无预生成音频，回退到 Web Speech API:', text);
        speakText(text, 'lo');
      }
    }
  }, [playAudioFile, playAudioSequence, speakText]);

  // 泰语（Web Speech API）
  const speakThai = useCallback((text: string) => {
    speakText(text, 'th');
  }, [speakText]);

  // 中文（Web Speech API）
  const speakChinese = useCallback((text: string) => {
    speakText(text, 'zh');
  }, [speakText]);

  // 慢速老挝语（使用预生成音频）
  const speakSlow = useCallback((text: string, rate: number = 1) => {
    const entry = laoAudioMap[text];
    if (entry?.slow) {
      playAudioFile(entry.slow, rate);
    } else {
      const words = text.split(/\s+/).filter(Boolean);
      const srcs = words.map(w => laoAudioMap[w]?.slow).filter(Boolean) as string[];
      if (srcs.length === words.length && srcs.length > 0) {
        playAudioSequence(srcs, rate);
      } else {
        speakText(text, 'lo');
      }
    }
  }, [playAudioFile, playAudioSequence, speakText]);

  // 通用
  const speak = useCallback((text: string, lang: string) => {
    if (lang === 'lo') {
      speakLao(text);
    } else {
      speakText(text, lang);
    }
  }, [speakLao, speakText]);

  // 停止
  const stopSpeaking = useCallback(() => {
    stopAll();
  }, [stopAll]);

  // 语音识别
  const startListening = useCallback(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      alert('浏览器不支持语音识别，请使用 Chrome');
      return false;
    }

    try {
      const recognition = new SR();
      recognition.lang = 'lo-LA';
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('');
      };

      recognition.onresult = (event: any) => {
        let finalT = '', interimT = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalT += event.results[i][0].transcript;
          } else {
            interimT += event.results[i][0].transcript;
          }
        }
        setTranscript(finalT || interimT);
      };

      recognition.onerror = (event: any) => {
        console.error('识别错误:', event.error);
        if (event.error === 'not-allowed') alert('请允许麦克风权限');
        setIsListening(false);
      };

      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
      return true;
    } catch (e) {
      console.error('启动失败:', e);
      return false;
    }
  }, []);

  const stopListening = useCallback(() => {
    try { recognitionRef.current?.stop(); } catch {}
  }, []);

  const compareText = useCallback((target: string, spoken: string): number => {
    const n = (s: string) => s.toLowerCase().replace(/[.,!?;:\s]/g, '').trim();
    const t = n(target), s = n(spoken);
    if (t === s) return 100;
    if (!s) return 0;
    if (t.includes(s) || s.includes(t)) return 80;
    let m = 0;
    for (let i = 0; i < Math.min(t.length, s.length); i++) {
      if (t[i] === s[i]) m++;
    }
    return Math.round((m / Math.max(t.length, s.length)) * 100);
  }, []);

  return {
    isListening, transcript, isSpeaking, ready,
    speakLao, speakChinese, speakThai, speakSlow, speak,
    stopSpeaking, startListening, stopListening, compareText,
  };
}
