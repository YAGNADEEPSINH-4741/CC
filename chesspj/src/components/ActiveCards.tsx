import React from 'react';
import { motion } from 'framer-motion';
import { Card, PlayerCards } from '../types';

interface ActiveCardsProps {
  cards: PlayerCards;
  isCurrentPlayer: boolean;
  onUseCard: (card: Card) => void;
  darkMode: boolean;
}

const ActiveCards: React.FC<ActiveCardsProps> = ({ 
  cards, 
  isCurrentPlayer, 
  onUseCard,
  darkMode
}) => {
  if (cards.selected.length === 0) return null;

  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
      <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
        Special Cards
      </h3>
      <div className="flex flex-col gap-2">
        {cards.selected.map(card => (
          <motion.button
            key={card.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onUseCard(card)}
            disabled={!isCurrentPlayer || cards.used.has(card.id)}
            className={`
              flex items-center gap-3 p-3 rounded-lg transition-all
              ${cards.used.has(card.id) ? 'opacity-50 cursor-not-allowed' : ''}
              ${!isCurrentPlayer ? 'cursor-not-allowed' : ''}
              ${
                card.type === 'advantage' ? 'bg-emerald-500 text-white' :
                card.type === 'disadvantage' ? 'bg-red-500 text-white' :
                'bg-purple-500 text-white'
              }
            `}
          >
            <span className="text-2xl">{card.icon}</span>
            <div className="flex-1">
              <h4 className="font-medium">{card.name}</h4>
              <p className="text-sm opacity-90">{card.description}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ActiveCards;