import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, RefreshCw } from 'lucide-react';

interface GameEndModalProps {
  winner: string;
  gameState: 'checkmate' | 'stalemate' | 'draw' | 'timeout';
  darkMode: boolean;
  onRestart: () => void;
}

const GameEndModal: React.FC<GameEndModalProps> = ({ winner, gameState, darkMode, onRestart }) => {
  const navigate = useNavigate();

  const getMessage = () => {
    switch (gameState) {
      case 'checkmate':
        return `Checkmate! ${winner} wins by checkmate!`;
      case 'stalemate':
        return 'Game drawn by stalemate!';
      case 'draw':
        return 'Game drawn by insufficient material!';
      case 'timeout':
        return `${winner} wins on time!`;
      default:
        return '';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-8 max-w-md w-full mx-4 shadow-xl`}
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1.1, 1.1, 1]
            }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
            className="inline-block"
          >
            <Trophy className={`w-16 h-16 mx-auto ${gameState === 'checkmate' || gameState === 'timeout' ? 'text-yellow-500' : 'text-blue-500'}`} />
          </motion.div>
          
          <h2 className={`text-2xl font-bold mt-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Game Over!
          </h2>
          
          <p className={`mt-2 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {getMessage()}
          </p>
        </motion.div>

        <div className="mt-8 space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw size={20} />
            Play Again
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className={`w-full py-3 px-4 rounded-md border ${
              darkMode 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
            } transition-colors`}
          >
            Return to Home
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameEndModal;