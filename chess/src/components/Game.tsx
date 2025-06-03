import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import Chessboard from './Chessboard';
import GameInfo from './GameInfo';
import { GameProvider } from '../context/GameContext';
import Timer from './Timer';
import GameEndModal from './GameEndModal';

function Game() {
  const [darkMode, setDarkMode] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [gameResult, setGameResult] = useState<{
    winner: string;
    gameState: 'checkmate' | 'stalemate' | 'draw' | 'timeout';
  } | null>(null);
  
  const location = useLocation();
  const { player1, player2, player1Time, player2Time } = location.state || {};

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleGameEnd = (winner: string, gameState: 'checkmate' | 'stalemate' | 'draw' | 'timeout') => {
    setGameResult({ winner, gameState });
    setShowEndModal(true);
  };

  const handleRestart = () => {
    setShowEndModal(false);
    setGameResult(null);
    // Additional reset logic will be handled by GameProvider
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Chess Game</h1>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>
        
        <GameProvider>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <Timer
                  playerName={player2}
                  initialTime={player2Time}
                  isBlack={true}
                  darkMode={darkMode}
                  onTimeout={() => handleGameEnd(player1, 'timeout')}
                />
              </div>
              <div className="flex justify-center">
                <Chessboard 
                  darkMode={darkMode}
                  onGameEnd={handleGameEnd}
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                <Timer
                  playerName={player1}
                  initialTime={player1Time}
                  isBlack={false}
                  darkMode={darkMode}
                  onTimeout={() => handleGameEnd(player2, 'timeout')}
                />
              </div>
            </div>
            <div className="lg:col-span-1">
              <GameInfo darkMode={darkMode} />
            </div>
          </div>
        </GameProvider>
      </div>

      {showEndModal && gameResult && (
        <GameEndModal
          winner={gameResult.winner}
          gameState={gameResult.gameState}
          darkMode={darkMode}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default Game;