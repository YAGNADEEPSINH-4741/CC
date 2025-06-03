import React from 'react';
import { Piece, Position } from '../types';
import ChessPiece from './ChessPiece';

interface SquareProps {
  position: Position;
  piece: Piece | null;
  isLight: boolean;
  isSelected: boolean;
  isPossibleMove: boolean;
  onSelect: () => void;
  darkMode: boolean;
}

const Square: React.FC<SquareProps> = ({
  position,
  piece,
  isLight,
  isSelected,
  isPossibleMove,
  onSelect,
  darkMode
}) => {
  // Wooden theme colors
  const getSquareColor = () => {
    if (isSelected) {
      return 'bg-yellow-600/40';
    }
    
    if (isPossibleMove) {
      return isLight 
        ? 'bg-green-700/30' 
        : 'bg-green-900/30';
    }
    
    return isLight
      ? 'bg-[#d6b088]' // Light wood color
      : 'bg-[#8b4513]'; // Dark wood color
  };

  return (
    <div
      className={`relative transition-colors duration-150 flex items-center justify-center cursor-pointer hover:opacity-90 ${getSquareColor()}`}
      onClick={onSelect}
      style={{ aspectRatio: '1' }}
    >
      {isPossibleMove && !piece && (
        <div className="w-3 h-3 rounded-full bg-green-500/40"></div>
      )}
      
      {isPossibleMove && piece && (
        <div className="absolute inset-0 border-2 border-red-500/40 rounded-sm z-10"></div>
      )}
      
      {piece && <ChessPiece piece={piece} />}
      
      {/* Coordinates on the edge of the board */}
      {position.col === 0 && (
        <span className="absolute left-1 top-1 text-xs font-semibold text-neutral-200/70">
          {8 - position.row}
        </span>
      )}
      
      {position.row === 7 && (
        <span className="absolute right-1 bottom-1 text-xs font-semibold text-neutral-200/70">
          {String.fromCharCode(97 + position.col)}
        </span>
      )}
    </div>
  );
};

export default Square;