import React from 'react';
import { Move } from '../types';
import { getChessNotation } from '../utils/notation';

interface MoveHistoryProps {
  moveHistory: Move[];
  darkMode: boolean;
}

const MoveHistory: React.FC<MoveHistoryProps> = ({ moveHistory, darkMode }) => {
  if (moveHistory.length === 0) {
    return (
      <div className={`italic text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        No moves yet
      </div>
    );
  }

  // Group moves into pairs (white and black)
  const groupedMoves = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    groupedMoves.push({
      number: Math.floor(i / 2) + 1,
      white: moveHistory[i],
      black: moveHistory[i + 1] || null
    });
  }

  return (
    <div className={`border rounded-md overflow-hidden ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}>
      <div className={`grid grid-cols-3 text-sm font-medium ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'}`}>
        <div className="p-2 text-center">#</div>
        <div className="p-2 text-center">White</div>
        <div className="p-2 text-center">Black</div>
      </div>
      
      <div className={`overflow-y-auto max-h-48 ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        {groupedMoves.map(({ number, white, black }) => (
          <div 
            key={number} 
            className={`grid grid-cols-3 text-sm border-b ${
              darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-200'
            }`}
          >
            <div className={`p-2 text-center font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {number}
            </div>
            <div className="p-2 text-center">
              {getChessNotation(white)}
            </div>
            <div className="p-2 text-center">
              {black ? getChessNotation(black) : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoveHistory;