import React from 'react';
import MoveHistory from './MoveHistory';
import GameControls from './GameControls';
import GameStatus from './GameStatus';
import { useGame } from '../context/GameContext';

interface GameInfoProps {
  darkMode: boolean;
}

const GameInfo: React.FC<GameInfoProps> = ({ darkMode }) => {
  const { currentPlayer, gameState, check, moveHistory } = useGame();

  return (
    <div className={`p-6 rounded-lg shadow-md ${darkMode ? 'bg-neutral-800' : 'bg-white'} transition-colors duration-300`}>
      <GameStatus 
        currentPlayer={currentPlayer} 
        gameState={gameState} 
        check={check} 
        darkMode={darkMode} 
      />
      
      <div className="mt-6">
        <GameControls darkMode={darkMode} />
      </div>
      
      <div className="mt-6">
        <h2 className={`text-xl font-bold mb-3 ${darkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>
          Move History
        </h2>
        <MoveHistory moveHistory={moveHistory} darkMode={darkMode} />
      </div>
    </div>
  );
};

export default GameInfo;