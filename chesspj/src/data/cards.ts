import { Card } from '../types';

export const cards: Card[] = [
  {
    id: 'double-move',
    name: 'Double Time',
    icon: '⚡',
    type: 'advantage',
    description: 'Make two moves in one turn',
    effect: (gameState) => {
      // Implementation will be added
    }
  },
  {
    id: 'piece-revival',
    name: 'Revival',
    icon: '✨',
    type: 'advantage',
    description: 'Bring back one captured piece',
    effect: (gameState) => {
      // Implementation will be added
    }
  },
  {
    id: 'pawn-promotion',
    name: 'Royal Promotion',
    icon: '👑',
    type: 'advantage',
    description: 'Promote any pawn instantly',
    effect: (gameState) => {
      // Implementation will be added
    }
  },
  {
    id: 'piece-swap',
    name: 'Strategic Swap',
    icon: '🔄',
    type: 'advantage',
    description: 'Swap positions of two of your pieces',
    effect: (gameState) => {
      // Implementation will be added
    }
  },
  {
    id: 'shield',
    name: 'Divine Shield',
    icon: '🛡️',
    type: 'advantage',
    description: 'Protect one piece from capture for one turn',
    effect: (gameState) => {
      // Implementation will be added
    }
  },
  {
    id: 'frozen-piece',
    name: 'Frozen Piece',
    icon: '❄️',
    type: 'disadvantage',
    description: 'One random piece cannot move next turn',
    effect: (gameState) => {
      // Implementation will be added
    }
  },
  {
    id: 'blind-move',
    name: 'Blind Move',
    icon: '👁️',
    type: 'disadvantage',
    description: 'Make your next move without seeing the board',
    effect: (gameState) => {
      // Implementation will be added
    }
  },
  {
    id: 'time-pressure',
    name: 'Time Pressure',
    icon: '⏰',
    type: 'disadvantage',
    description: 'Reduce your time by 30 seconds',
    effect: (gameState) => {
      // Implementation will be added
    }
  },
  {
    id: 'pawn-reversal',
    name: 'Pawn Reversal',
    icon: '↩️',
    type: 'disadvantage',
    description: 'Your pawns must move backward for one turn',
    effect: (gameState) => {
      // Implementation will be added
    }
  },
  {
    id: 'piece-curse',
    name: 'Cursed Piece',
    icon: '💀',
    type: 'disadvantage',
    description: 'One of your pieces will be captured if moved',
    effect: (gameState) => {
      // Implementation will be added
    }
  },
  {
    id: 'board-rotation',
    name: 'Chaos Spin',
    icon: '🌀',
    type: 'chaotic',
    description: 'Rotate the board 90 degrees',
    effect: (gameState) => {
      // Implementation will be added
    }
  },
  {
    id: 'piece-shuffle',
    name: 'Random Shuffle',
    icon: '🎲',
    type: 'chaotic',
    description: 'Randomly shuffle all pieces on the back rank',
    effect: (gameState) => {
      // Implementation will be added
    }
  },
  {
    id: 'mirror-match',
    name: 'Mirror Dimension',
    icon: '🪞',
    type: 'chaotic',
    description: 'Mirror the entire board horizontally',
    effect: (gameState) => {
      // Implementation will be added
    }
  },
  {
    id: 'time-warp',
    name: 'Time Warp',
    icon: '⌛',
    type: 'chaotic',
    description: 'Undo the last three moves',
    effect: (gameState) => {
      // Implementation will be added
    }
  },
  {
    id: 'quantum-leap',
    name: 'Quantum Leap',
    icon: '🌌',
    type: 'chaotic',
    description: 'Teleport all pieces to random valid positions',
    effect: (gameState) => {
      // Implementation will be added
    }
  }
];