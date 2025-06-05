import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Square from './Square';
import PromotionModal from './PromotionModal';
import { useGame } from '../context/GameContext';
import { Position } from '../types';

interface ChessboardProps {
  darkMode: boolean;
  onGameEnd: (winner: string, gameState: 'checkmate' | 'stalemate' | 'draw' | 'timeout') => void;
}

const Chessboard: React.FC<ChessboardProps> = ({ darkMode, onGameEnd }) => {
  const { 
    boardState, 
    selectedPiece, 
    possibleMoves, 
    selectPiece, 
    makeMove,
    promotionPending,
    currentPlayer,
    gameState
  } = useGame();

  const renderBoard = () => {
    const boardRows = [...Array(8).keys()];
    const boardCols = [...Array(8).keys()];
    
    const board = [];
    
    for (const row of boardRows) {
      for (const col of boardCols) {
        const position: Position = { row, col };
        const piece = boardState[row][col];
        
        const isSelected = selectedPiece && selectedPiece.row === row && selectedPiece.col === col;
        
        const isPossibleMove = possibleMoves.some(
          move => move.row === row && move.col === col
        );

        const canSelect = piece?.color === currentPlayer;
        
        board.push(
          <Square
            key={`${row}-${col}`}
            position={position}
            piece={piece}
            isLight={(row + col) % 2 === 0}
            isSelected={isSelected}
            isPossibleMove={isPossibleMove}
            onSelect={() => {
              if ((piece && canSelect) || isPossibleMove) {
                if (isPossibleMove) {
                  makeMove(position);
                } else {
                  selectPiece(position);
                }
              }
            }}
            darkMode={darkMode}
          />
        );
      }
    }
    
    return board;
  };

  // Call onGameEnd when game state changes
  React.useEffect(() => {
    if (gameState === 'checkmate') {
      const winner = currentPlayer === 'white' ? 'Black' : 'White';
      onGameEnd(winner, 'checkmate');
    } else if (gameState === 'stalemate') {
      onGameEnd('', 'stalemate');
    } else if (gameState === 'draw') {
      onGameEnd('', 'draw');
    }
  }, [gameState, currentPlayer, onGameEnd]);

  return (
    <div className="relative">
      <div 
        className="grid grid-cols-8 border-8 border-[#5c3a21] rounded-lg shadow-2xl overflow-hidden"
        style={{ width: 'min(90vw, 640px)', height: 'min(90vw, 640px)' }}
      >
        {renderBoard()}
      </div>
      
      <AnimatePresence>
        {promotionPending && <PromotionModal darkMode={darkMode} />}
        
        {gameState === 'checkmate' && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 5, 0]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className={`text-4xl font-bold ${
                darkMode ? 'text-white' : 'text-black'
              } bg-red-500/80 backdrop-blur-sm px-8 py-4 rounded-lg shadow-lg`}
            >
              Checkmate!
            </motion.div>
          </motion.div>
        )}

        {(gameState === 'stalemate' || gameState === 'draw') && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                opacity: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className={`text-4xl font-bold ${
                darkMode ? 'text-white' : 'text-black'
              } bg-blue-500/80 backdrop-blur-sm px-8 py-4 rounded-lg shadow-lg`}
            >
              {gameState === 'stalemate' ? 'Stalemate!' : 'Draw!'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chessboard;