import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { motion } from 'framer-motion';

interface TimerProps {
  playerName: string;
  initialTime: number;
  isBlack: boolean;
  darkMode: boolean;
  onTimeout: () => void;
}

const Timer: React.FC<TimerProps> = ({ playerName, initialTime, isBlack, darkMode, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const { currentPlayer, gameState } = useGame();
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (gameState === 'playing' && 
        ((isBlack && currentPlayer === 'black') || (!isBlack && currentPlayer === 'white'))) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 0) {
            onTimeout();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [currentPlayer, gameState, isBlack, onTimeout]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isActive = gameState === 'playing' && 
    ((isBlack && currentPlayer === 'black') || (!isBlack && currentPlayer === 'white'));

  return (
    <motion.div 
      initial={{ opacity: 0, y: isBlack ? -20 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md w-full ${
        isActive ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <motion.div 
            animate={isActive ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 1, repeat: Infinity }}
            className={`w-3 h-3 rounded-full ${isBlack ? 'bg-black' : 'bg-white border border-gray-300'}`}
          />
          <span className="font-medium">{playerName}</span>
        </div>
        <motion.span 
          animate={timeLeft <= 30 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: timeLeft <= 30 ? Infinity : 0 }}
          className={`text-xl font-bold ${timeLeft <= 30 ? 'text-red-500' : ''}`}
        >
          {formatTime(timeLeft)}
        </motion.span>
      </div>
    </motion.div>
  );
};

export default Timer;