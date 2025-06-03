import { Move } from '../types';

// Convert file index to letter (0 = a, 1 = b, etc.)
const fileToLetter = (col: number): string => {
  return String.fromCharCode(97 + col);
};

// Convert row index to rank number (0 = 8, 1 = 7, etc.)
const rowToRank = (row: number): number => {
  return 8 - row;
};

// Get the position in algebraic notation (e.g., "e4")
const positionToAlgebraic = (row: number, col: number): string => {
  return `${fileToLetter(col)}${rowToRank(row)}`;
};

// Get the piece letter for notation
const getPieceLetter = (pieceType: string): string => {
  switch (pieceType) {
    case 'king': return 'K';
    case 'queen': return 'Q';
    case 'rook': return 'R';
    case 'bishop': return 'B';
    case 'knight': return 'N';
    case 'pawn': return '';
    default: return '';
  }
};

// Convert a move to chess notation (simplified)
export const getChessNotation = (move: Move): string => {
  if (!move) return '';
  
  const { piece, from, to, moveType, promotedTo } = move;
  
  // Handle castling
  if (moveType === 'castling') {
    return to.col > from.col ? 'O-O' : 'O-O-O';
  }
  
  // Basic move notation
  let notation = '';
  
  // Add piece letter (except for pawns)
  notation += getPieceLetter(piece.type);
  
  // Add 'x' for captures
  if (moveType === 'capture' || moveType === 'en_passant') {
    // For pawns, add the file they moved from
    if (piece.type === 'pawn') {
      notation += fileToLetter(from.col);
    }
    notation += 'x';
  }
  
  // Add destination square
  notation += positionToAlgebraic(to.row, to.col);
  
  // Add promotion piece
  if (promotedTo) {
    notation += `=${getPieceLetter(promotedTo)}`;
  }
  
  return notation;
};