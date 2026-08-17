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

function App() {
  const { page, navigate, goBack } = useNavigation();

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
