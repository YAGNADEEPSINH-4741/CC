import React from 'react';
import { useGame } from '../context/GameContext';
import { PieceType } from '../types';

interface PromotionModalProps {
  darkMode: boolean;
}

const PromotionModal: React.FC<PromotionModalProps> = ({ darkMode }) => {
  const { promotionPending, promotePawn, currentPlayer } = useGame();
  
  if (!promotionPending) return null;
  
  const pieces: PieceType[] = ['queen', 'rook', 'bishop', 'knight'];
  
  const getPieceUnicode = (piece: PieceType) => {
    if (currentPlayer === 'white') {
      switch (piece) {
        case 'queen': return '♕';
        case 'rook': return '♖';
        case 'bishop': return '♗';
        case 'knight': return '♘';
        default: return '';
      }
    } else {
      switch (piece) {
        case 'queen': return '♛';
        case 'rook': return '♜';
        case 'bishop': return '♝';
        case 'knight': return '♞';
        default: return '';
      }
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
      <div className={`p-4 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-center text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Promote Pawn
        </h3>
        
        <div className="flex justify-center space-x-2">
          {pieces.map(piece => (
            <button
              key={piece}
              onClick={() => promotePawn(piece)}
              className={`w-16 h-16 flex items-center justify-center text-4xl rounded-md transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 bg-gray-900 text-white' 
                  : 'hover:bg-gray-200 bg-gray-100 text-black'
              }`}
              title={`Promote to ${piece}`}
            >
              {getPieceUnicode(piece)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionModal;