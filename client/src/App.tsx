import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SetupPage from './pages/SetupPage/SetupPage';
import MainPage from './pages/MainPage/MainPage';
import { useGameStore } from './stores/gameStore';

function App() {
  const { gameState } = useGameStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SetupPage />} />
        <Route 
          path="/game" 
          element={gameState ? <MainPage /> : <Navigate to="/" replace />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
