import { useEffect, useRef } from 'react';
import { useNavigation } from './hooks/useNavigation';
import HomePage from './pages/HomePage';
import AlphabetPage from './pages/AlphabetPage';
import VocabularyPage from './pages/VocabularyPage';
import DialoguePage from './pages/DialoguePage';
import FlashcardPage from './pages/FlashcardPage';
import TonePage from './pages/TonePage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import StatsPage from './pages/StatsPage';
import NumberCalculatorPage from './pages/NumberCalculatorPage';
import ScenarioPage from './pages/ScenarioPage';
import ToneGamePage from './pages/ToneGamePage';

interface AppProps {
  onReady?: () => void;
}

function App({ onReady }: AppProps) {
  const { page, navigate, goBack } = useNavigation();
  const readyCalled = useRef(false);

  // React 首次渲染完成后通知父组件
  useEffect(() => {
    if (!readyCalled.current) {
      readyCalled.current = true;
      // 延迟一帧确保所有 DOM 元素已绘制
      requestAnimationFrame(() => {
        onReady?.();
      });
    }
  }, [onReady]);

  switch (page) {
    case 'alphabet':
      return <AlphabetPage goBack={goBack} />;
    case 'vocabulary':
      return <VocabularyPage goBack={goBack} />;
    case 'dialogue':
      return <DialoguePage goBack={goBack} />;
    case 'flashcard':
      return <FlashcardPage goBack={goBack} />;
    case 'tone':
      return <TonePage goBack={goBack} />;
    case 'search':
      return <SearchPage goBack={goBack} />;
    case 'favorites':
      return <FavoritesPage goBack={goBack} />;
    case 'stats':
      return <StatsPage goBack={goBack} />;
    case 'calculator':
      return <NumberCalculatorPage goBack={goBack} />;
    case 'scenario':
      return <ScenarioPage goBack={goBack} />;
    case 'tone-game':
      return <ToneGamePage goBack={goBack} />;
    default:
      return <HomePage navigate={navigate} />;
  }
}

export default App;
