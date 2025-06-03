import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RssIcon as ChessIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const timeOptions = [
  { label: '1 minute', value: 60 },
  { label: '3 minutes', value: 180 },
  { label: '5 minutes', value: 300 },
  { label: '10 minutes', value: 600 },
  { label: '15 minutes', value: 900 },
  { label: '30 minutes', value: 1800 },
];

const Welcome = () => {
  const navigate = useNavigate();
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [player1Time, setPlayer1Time] = useState(300);
  const [player2Time, setPlayer2Time] = useState(300);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (player1.trim() && player2.trim()) {
      navigate('/game', { 
        state: { 
          player1, 
          player2, 
          player1Time,
          player2Time
        } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <ChessIcon className="mx-auto h-16 w-16 text-blue-400" />
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-4xl font-bold text-white"
          >
            Chess Game
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-2 text-blue-300"
          >
            Enter player names and select time controls
          </motion.p>
        </div>
        
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 space-y-6 bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow-xl border border-gray-700"
        >
          <div className="space-y-6">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <label htmlFor="player1" className="text-white block mb-2">White Player</label>
              <input
                id="player1"
                type="text"
                required
                value={player1}
                onChange={(e) => setPlayer1(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter player 1 name"
              />
              <select
                value={player1Time}
                onChange={(e) => setPlayer1Time(Number(e.target.value))}
                className="mt-2 block w-full rounded-md border border-gray-700 bg-gray-900/50 text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                {timeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </motion.div>
            
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <label htmlFor="player2" className="text-white block mb-2">Black Player</label>
              <input
                id="player2"
                type="text"
                required
                value={player2}
                onChange={(e) => setPlayer2(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-700 bg-gray-900/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter player 2 name"
              />
              <select
                value={player2Time}
                onChange={(e) => setPlayer2Time(Number(e.target.value))}
                className="mt-2 block w-full rounded-md border border-gray-700 bg-gray-900/50 text-white py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              >
                {timeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </motion.div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex justify-center py-3 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            Start Game
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Welcome;