import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RssIcon as ChessIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import CardSelection from './CardSelection';
import { Card } from '../types';

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
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');
  const [player1Time, setPlayer1Time] = useState(300);
  const [player2Time, setPlayer2Time] = useState(300);
  const [showCardSelection, setShowCardSelection] = useState(false);
  const [currentPlayerSelection, setCurrentPlayerSelection] = useState<1 | 2>(1);
  const [player1Cards, setPlayer1Cards] = useState<Card[]>([]);
  const [player2Cards, setPlayer2Cards] = useState<Card[]>([]);
  const [showPlayerForm, setShowPlayerForm] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (player1Name.trim() && player2Name.trim()) {
      setShowPlayerForm(false);
      setShowCardSelection(true);
    }
  };

  const handleCardSelection = (cards: Card[]) => {
    if (currentPlayerSelection === 1) {
      setPlayer1Cards(cards);
      setCurrentPlayerSelection(2);
    } else {
      setPlayer2Cards(cards);
      // Only navigate after both players have selected their cards
      const isPlayer1White = Math.random() < 0.5;
      
      navigate('/game', { 
        state: { 
          player1: isPlayer1White ? player1Name : player2Name,
          player2: isPlayer1White ? player2Name : player1Name,
          player1Time: isPlayer1White ? player1Time : player2Time,
          player2Time: isPlayer1White ? player2Time : player1Time,
          player1Cards: isPlayer1White ? player1Cards : player2Cards,
          player2Cards: isPlayer1White ? player2Cards : player1Cards
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
        {showPlayerForm && (
          <>
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
                Chaotic Chess
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-2 text-blue-300"
              >
                Enter player names and select time controls
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-2 text-sm text-blue-400"
              >
                Colors will be randomly assigned when the game starts
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
                  <label htmlFor="player1" className="text-white block mb-2">Player 1</label>
                  <input
                    id="player1"
                    type="text"
                    required
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
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
                  <label htmlFor="player2" className="text-white block mb-2">Player 2</label>
                  <input
                    id="player2"
                    type="text"
                    required
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
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
                Continue to Card Selection
              </motion.button>
            </motion.form>
          </>
        )}

        {showCardSelection && (
          <CardSelection
            playerName={currentPlayerSelection === 1 ? player1Name : player2Name}
            onSelect={handleCardSelection}
          />
        )}
      </motion.div>
    </div>
  );
};

export default Welcome;