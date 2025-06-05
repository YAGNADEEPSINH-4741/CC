import React from 'react';
import { RotateCcw, RefreshCw } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface GameControlsProps {
  darkMode: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ darkMode }) => {
  const { resetGame, undoMove, moveHistory, gameState } = useGame();

  const buttonClass = darkMode
    ? 'bg-gray-700 hover:bg-gray-600 text-white'
    : 'bg-gray-200 hover:bg-gray-300 text-gray-800';

  return (
    <div className="flex flex-col space-y-3">
      <button
        onClick={resetGame}
        className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${buttonClass}`}
      >
        <RefreshCw size={18} />
        <span>New Game</span>
      </button>
      
      <button
        onClick={undoMove}
        disabled={moveHistory.length === 0 || gameState !== 'playing'}
        className={`flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
          moveHistory.length === 0 || gameState !== 'playing'
            ? 'opacity-50 cursor-not-allowed'
            : ''
        } ${buttonClass}`}
      >
        <RotateCcw size={18} />
        <span>Undo Move</span>
      </button>
    </div>
  );
};

export default GameControls;