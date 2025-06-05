import React from 'react';
import { GameState, PlayerColor } from '../types';

interface GameStatusProps {
  currentPlayer: PlayerColor;
  gameState: GameState;
  check: boolean;
  darkMode: boolean;
}

const GameStatus: React.FC<GameStatusProps> = ({ 
  currentPlayer, 
  gameState, 
  check,
  darkMode 
}) => {
  const getStatusMessage = () => {
    if (gameState === 'checkmate') {
      const winner = currentPlayer === 'white' ? 'Black' : 'White';
      return `Checkmate! ${winner} wins`;
    } else if (gameState === 'stalemate') {
      return 'Stalemate! Game is drawn';
    } else if (gameState === 'draw') {
      return 'Draw by insufficient material';
    } else if (check) {
      return `${currentPlayer === 'white' ? 'White' : 'Black'} is in check!`;
    } else {
      return `${currentPlayer === 'white' ? 'White' : 'Black'} to move`;
    }
  };

  const getStatusColor = () => {
    if (gameState === 'checkmate') {
      return darkMode ? 'text-red-400' : 'text-red-600';
    } else if (gameState === 'stalemate' || gameState === 'draw') {
      return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    } else if (check) {
      return darkMode ? 'text-orange-400' : 'text-orange-600';
    }
    return darkMode ? 'text-neutral-200' : 'text-neutral-800';
  };

  return (
    <div className="text-center">
      <div className={`flex items-center justify-center space-x-3 mb-3 ${darkMode ? 'text-neutral-200' : 'text-neutral-800'}`}>
        <div 
          className={`w-5 h-5 rounded-full ${
            currentPlayer === 'white' ? 'bg-white border border-neutral-300' : 'bg-black'
          }`}
        ></div>
        <h2 className="text-2xl font-bold">
          {currentPlayer === 'white' ? 'White' : 'Black'}
        </h2>
      </div>
      
      <p className={`text-lg font-medium ${getStatusColor()}`}>
        {getStatusMessage()}
      </p>
    </div>
  );
};

export default GameStatus;