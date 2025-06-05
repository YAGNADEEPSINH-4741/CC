import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardType } from '../types';
import { cards } from '../data/cards';

interface CardSelectionProps {
  onSelect: (cards: Card[]) => void;
  playerName: string;
}

const CardSelection: React.FC<CardSelectionProps> = ({ onSelect, playerName }) => {
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleCardClick = (card: Card) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter(c => c.id !== card.id));
      setError(null);
    } else if (selectedCards.length < 3) {
      setSelectedCards([...selectedCards, card]);
      setError(null);
    } else {
      setError('You can only select up to 3 cards');
    }
  };

  const handleContinue = () => {
    if (selectedCards.length === 3) {
      onSelect(selectedCards);
    } else {
      setError('Please select exactly 3 cards');
    }
  };

  const getCardColor = (type: CardType): string => {
    switch (type) {
      case 'advantage':
        return 'bg-emerald-500 hover:bg-emerald-600';
      case 'disadvantage':
        return 'bg-red-500 hover:bg-red-600';
      case 'chaotic':
        return 'bg-purple-500 hover:bg-purple-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-900 p-8 rounded-xl max-w-4xl w-full mx-4 shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-white mb-2">{playerName}'s Card Selection</h2>
        <p className="text-gray-300 mb-2">Select exactly 3 cards to use during the game</p>
        <p className="text-gray-400 text-sm mb-6">Selected: {selectedCards.length}/3</p>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {cards.map(card => (
            <motion.button
              key={card.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(card)}
              className={`${
                getCardColor(card.type)
              } ${
                selectedCards.includes(card) ? 'ring-4 ring-white' : ''
              } p-4 rounded-lg text-white transition-all`}
            >
              <div className="text-4xl mb-2">{card.icon}</div>
              <h3 className="text-lg font-bold mb-1">{card.name}</h3>
              <p className="text-sm opacity-90">{card.description}</p>
            </motion.button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <p className="text-gray-400">
            {selectedCards.length < 3 
              ? `Select ${3 - selectedCards.length} more card${selectedCards.length === 2 ? '' : 's'}`
              : 'Ready to continue!'
            }
          </p>
          <button
            onClick={handleContinue}
            disabled={selectedCards.length !== 3}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-2 rounded-lg text-white font-medium transition-colors"
          >
            Continue
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CardSelection;