import { Piece, Position, PlayerColor, Move, GameState } from '../types';

// Create the initial board state
export const createInitialBoardState = (): (Piece | null)[][] => {
  const board: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Set up pawns
  for (let col = 0; col < 8; col++) {
    board[1][col] = { type: 'pawn', color: 'black' };
    board[6][col] = { type: 'pawn', color: 'white' };
  }
  
  // Set up other pieces
  const setupBackRow = (row: number, color: PlayerColor) => {
    board[row][0] = { type: 'rook', color };
    board[row][1] = { type: 'knight', color };
    board[row][2] = { type: 'bishop', color };
    board[row][3] = { type: 'queen', color };
    board[row][4] = { type: 'king', color };
    board[row][5] = { type: 'bishop', color };
    board[row][6] = { type: 'knight', color };
    board[row][7] = { type: 'rook', color };
  };
  
  setupBackRow(0, 'black');
  setupBackRow(7, 'white');
  
  return board;
};

// Get all possible moves for a piece
export const getPossibleMoves = (
  board: (Piece | null)[][],
  position: Position,
  moveHistory: Move[]
): Position[] => {
  const piece = board[position.row][position.col];
  if (!piece) return [];
  
  let moves: Position[] = [];
  
  switch (piece.type) {
    case 'pawn':
      moves = getPawnMoves(board, position, moveHistory);
      break;
    case 'rook':
      moves = getRookMoves(board, position);
      break;
    case 'knight':
      moves = getKnightMoves(board, position);
      break;
    case 'bishop':
      moves = getBishopMoves(board, position);
      break;
    case 'queen':
      moves = getQueenMoves(board, position);
      break;
    case 'king':
      moves = getKingMoves(board, position, moveHistory);
      break;
  }
  
  // Filter out moves that would put or leave the king in check
  return moves.filter(move => {
    const newBoard = simulateMove(board, position, move);
    return !isKingInCheck(newBoard, piece.color);
  });
};

// Helper to simulate a move without modifying the original board
const simulateMove = (
  board: (Piece | null)[][],
  from: Position,
  to: Position
): (Piece | null)[][] => {
  const newBoard = board.map(row => [...row]);
  newBoard[to.row][to.col] = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = null;
  return newBoard;
};

// Get all possible moves for a pawn
const getPawnMoves = (
  board: (Piece | null)[][],
  position: Position,
  moveHistory: Move[]
): Position[] => {
  const { row, col } = position;
  const piece = board[row][col];
  if (!piece || piece.type !== 'pawn') return [];
  
  const moves: Position[] = [];
  const direction = piece.color === 'white' ? -1 : 1;
  const startingRow = piece.color === 'white' ? 6 : 1;
  
  // Move forward one square
  if (row + direction >= 0 && row + direction < 8 && !board[row + direction][col]) {
    moves.push({ row: row + direction, col });
    
    // Move forward two squares from starting position
    if (row === startingRow && !board[row + 2 * direction][col]) {
      moves.push({ row: row + 2 * direction, col });
    }
  }
  
  // Capture diagonally
  for (const offset of [-1, 1]) {
    if (col + offset >= 0 && col + offset < 8) {
      const targetPiece = board[row + direction][col + offset];
      if (targetPiece && targetPiece.color !== piece.color) {
        moves.push({ row: row + direction, col: col + offset });
      }
      
      // En passant
      if (canEnPassant(board, position, { row: row + direction, col: col + offset }, moveHistory)) {
        moves.push({ row: row + direction, col: col + offset });
      }
    }
  }
  
  return moves;
};

// Check if an en passant move is possible
const canEnPassant = (
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  moveHistory: Move[]
): boolean => {
  if (moveHistory.length === 0) return false;
  
  const lastMove = moveHistory[moveHistory.length - 1];
  const piece = board[from.row][from.col];
  
  if (!piece || piece.type !== 'pawn') return false;
  
  // Check if the last move was a pawn moving two squares forward
  if (
    lastMove.piece.type === 'pawn' &&
    Math.abs(lastMove.from.row - lastMove.to.row) === 2 &&
    lastMove.to.col === to.col &&
    lastMove.to.row === from.row &&
    Math.abs(from.col - to.col) === 1
  ) {
    return true;
  }
  
  return false;
};

// Get all possible moves for a rook
const getRookMoves = (
  board: (Piece | null)[][],
  position: Position
): Position[] => {
  const { row, col } = position;
  const piece = board[row][col];
  if (!piece) return [];
  
  const moves: Position[] = [];
  const directions = [
    { row: -1, col: 0 }, // up
    { row: 1, col: 0 },  // down
    { row: 0, col: -1 }, // left
    { row: 0, col: 1 }   // right
  ];
  
  for (const direction of directions) {
    let newRow = row + direction.row;
    let newCol = col + direction.col;
    
    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const targetPiece = board[newRow][newCol];
      
      if (!targetPiece) {
        // Empty square
        moves.push({ row: newRow, col: newCol });
      } else if (targetPiece.color !== piece.color) {
        // Capture opponent's piece
        moves.push({ row: newRow, col: newCol });
        break;
      } else {
        // Own piece
        break;
      }
      
      newRow += direction.row;
      newCol += direction.col;
    }
  }
  
  return moves;
};

// Get all possible moves for a knight
const getKnightMoves = (
  board: (Piece | null)[][],
  position: Position
): Position[] => {
  const { row, col } = position;
  const piece = board[row][col];
  if (!piece) return [];
  
  const moves: Position[] = [];
  const offsets = [
    { row: -2, col: -1 },
    { row: -2, col: 1 },
    { row: -1, col: -2 },
    { row: -1, col: 2 },
    { row: 1, col: -2 },
    { row: 1, col: 2 },
    { row: 2, col: -1 },
    { row: 2, col: 1 }
  ];
  
  for (const offset of offsets) {
    const newRow = row + offset.row;
    const newCol = col + offset.col;
    
    if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const targetPiece = board[newRow][newCol];
      
      if (!targetPiece || targetPiece.color !== piece.color) {
        moves.push({ row: newRow, col: newCol });
      }
    }
  }
  
  return moves;
};

// Get all possible moves for a bishop
const getBishopMoves = (
  board: (Piece | null)[][],
  position: Position
): Position[] => {
  const { row, col } = position;
  const piece = board[row][col];
  if (!piece) return [];
  
  const moves: Position[] = [];
  const directions = [
    { row: -1, col: -1 }, // up-left
    { row: -1, col: 1 },  // up-right
    { row: 1, col: -1 },  // down-left
    { row: 1, col: 1 }    // down-right
  ];
  
  for (const direction of directions) {
    let newRow = row + direction.row;
    let newCol = col + direction.col;
    
    while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
      const targetPiece = board[newRow][newCol];
      
      if (!targetPiece) {
        // Empty square
        moves.push({ row: newRow, col: newCol });
      } else if (targetPiece.color !== piece.color) {
        // Capture opponent's piece
        moves.push({ row: newRow, col: newCol });
        break;
      } else {
        // Own piece
        break;
      }
      
      newRow += direction.row;
      newCol += direction.col;
    }
  }
  
  return moves;
};

// Get all possible moves for a queen
const getQueenMoves = (
  board: (Piece | null)[][],
  position: Position
): Position[] => {
  // Queen moves like a rook and bishop combined
  return [
    ...getRookMoves(board, position),
    ...getBishopMoves(board, position)
  ];
};

// Get all possible moves for a king
const getKingMoves = (
  board: (Piece | null)[][],
  position: Position,
  moveHistory: Move[]
): Position[] => {
  const { row, col } = position;
  const piece = board[row][col];
  if (!piece || piece.type !== 'king') return [];
  
  const moves: Position[] = [];
  
  // Regular king moves in all 8 directions
  for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
    for (let colOffset = -1; colOffset <= 1; colOffset++) {
      if (rowOffset === 0 && colOffset === 0) continue;
      
      const newRow = row + rowOffset;
      const newCol = col + colOffset;
      
      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const targetPiece = board[newRow][newCol];
        
        if (!targetPiece || targetPiece.color !== piece.color) {
          moves.push({ row: newRow, col: newCol });
        }
      }
    }
  }
  
  // Castling
  if (!piece.hasMoved) {
    // Check kingside castling
    if (canCastle(board, position, 'kingside', moveHistory)) {
      moves.push({ row, col: col + 2 });
    }
    
    // Check queenside castling
    if (canCastle(board, position, 'queenside', moveHistory)) {
      moves.push({ row, col: col - 2 });
    }
  }
  
  return moves;
};

// Check if castling is allowed
const canCastle = (
  board: (Piece | null)[][],
  kingPosition: Position,
  side: 'kingside' | 'queenside',
  moveHistory: Move[]
): boolean => {
  const { row, col } = kingPosition;
  const king = board[row][col];
  
  if (!king || king.type !== 'king' || king.hasMoved) return false;
  
  // Check if king is in check
  if (isSquareAttacked(board, kingPosition, king.color === 'white' ? 'black' : 'white')) {
    return false;
  }
  
  const rookCol = side === 'kingside' ? 7 : 0;
  const rookPosition = { row, col: rookCol };
  const rook = board[row][rookCol];
  
  // Check if rook exists and hasn't moved
  if (!rook || rook.type !== 'rook' || rook.color !== king.color || rook.hasMoved) {
    return false;
  }
  
  // Check if squares between king and rook are empty
  const direction = side === 'kingside' ? 1 : -1;
  const distance = side === 'kingside' ? 2 : 3;
  
  for (let i = 1; i <= distance; i++) {
    const checkCol = col + i * direction;
    if (checkCol === rookCol) continue;
    
    if (board[row][checkCol] !== null) {
      return false;
    }
    
    // Check if squares the king passes through are attacked
    if (i <= 2 && isSquareAttacked(board, { row, col: checkCol }, king.color === 'white' ? 'black' : 'white')) {
      return false;
    }
  }
  
  return true;
};

// Check if a square is attacked by the opponent
export const isSquareAttacked = (
  board: (Piece | null)[][],
  position: Position,
  attackerColor: PlayerColor
): boolean => {
  const { row, col } = position;
  
  // Check pawn attacks
  const pawnDirection = attackerColor === 'white' ? -1 : 1;
  for (const offset of [-1, 1]) {
    const attackRow = row + pawnDirection;
    const attackCol = col + offset;
    
    if (attackRow >= 0 && attackRow < 8 && attackCol >= 0 && attackCol < 8) {
      const piece = board[attackRow][attackCol];
      if (piece && piece.type === 'pawn' && piece.color === attackerColor) {
        return true;
      }
    }
  }
  
  // Check knight attacks
  const knightOffsets = [
    { row: -2, col: -1 },
    { row: -2, col: 1 },
    { row: -1, col: -2 },
    { row: -1, col: 2 },
    { row: 1, col: -2 },
    { row: 1, col: 2 },
    { row: 2, col: -1 },
    { row: 2, col: 1 }
  ];
  
  for (const offset of knightOffsets) {
    const attackRow = row + offset.row;
    const attackCol = col + offset.col;
    
    if (attackRow >= 0 && attackRow < 8 && attackCol >= 0 && attackCol < 8) {
      const piece = board[attackRow][attackCol];
      if (piece && piece.type === 'knight' && piece.color === attackerColor) {
        return true;
      }
    }
  }
  
  // Check attacks from sliding pieces (queen, rook, bishop) and king
  const directions = [
    { row: -1, col: 0, pieces: ['rook', 'queen'] },        // up
    { row: 1, col: 0, pieces: ['rook', 'queen'] },         // down
    { row: 0, col: -1, pieces: ['rook', 'queen'] },        // left
    { row: 0, col: 1, pieces: ['rook', 'queen'] },         // right
    { row: -1, col: -1, pieces: ['bishop', 'queen'] },     // up-left
    { row: -1, col: 1, pieces: ['bishop', 'queen'] },      // up-right
    { row: 1, col: -1, pieces: ['bishop', 'queen'] },      // down-left
    { row: 1, col: 1, pieces: ['bishop', 'queen'] }        // down-right
  ];
  
  for (const direction of directions) {
    let distance = 1;
    let attackRow = row + direction.row;
    let attackCol = col + direction.col;
    
    while (attackRow >= 0 && attackRow < 8 && attackCol >= 0 && attackCol < 8) {
      const piece = board[attackRow][attackCol];
      
      if (piece) {
        if (piece.color === attackerColor) {
          if (distance === 1 && piece.type === 'king') {
            return true;
          }
          if (direction.pieces.includes(piece.type)) {
            return true;
          }
        }
        break; // Stop checking in this direction if we hit any piece
      }
      
      attackRow += direction.row;
      attackCol += direction.col;
      distance++;
    }
  }
  
  return false;
};

// Check if the king is in check
export const isKingInCheck = (
  board: (Piece | null)[][],
  color: PlayerColor
): boolean => {
  // Find the king's position
  let kingPosition: Position | null = null;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.type === 'king' && piece.color === color) {
        kingPosition = { row, col };
        break;
      }
    }
    if (kingPosition) break;
  }
  
  if (!kingPosition) return false; // Should never happen in a valid game
  
  // Check if the king is attacked
  return isSquareAttacked(board, kingPosition, color === 'white' ? 'black' : 'white');
};

// Execute a move and return the new board state
export const movePiece = (
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  moveHistory: Move[]
): { 
  newBoard: (Piece | null)[][], 
  capturedPiece: Piece | null,
  moveType: 'normal' | 'capture' | 'castling' | 'en_passant' | 'promotion'
} => {
  const piece = board[from.row][from.col];
  if (!piece) return { newBoard: board, capturedPiece: null, moveType: 'normal' };
  
  // Create a copy of the board
  const newBoard = board.map(row => [...row]);
  let capturedPiece = newBoard[to.row][to.col];
  let moveType: 'normal' | 'capture' | 'castling' | 'en_passant' | 'promotion' = 'normal';
  
  // Handle en passant
  if (
    piece.type === 'pawn' &&
    from.col !== to.col &&
    !capturedPiece
  ) {
    // This must be an en passant capture
    const captureRow = from.row;
    const captureCol = to.col;
    capturedPiece = newBoard[captureRow][captureCol];
    newBoard[captureRow][captureCol] = null;
    moveType = 'en_passant';
  }
  // Handle castling
  else if (piece.type === 'king' && Math.abs(from.col - to.col) === 2) {
    const rookCol = to.col > from.col ? 7 : 0;
    const newRookCol = to.col > from.col ? to.col - 1 : to.col + 1;
    
    // Move the rook
    newBoard[from.row][newRookCol] = newBoard[from.row][rookCol];
    if (newBoard[from.row][newRookCol]) {
      newBoard[from.row][newRookCol].hasMoved = true;
    }
    newBoard[from.row][rookCol] = null;
    moveType = 'castling';
  }
  // Handle normal captures
  else if (capturedPiece) {
    moveType = 'capture';
  }
  
  // Move the piece
  newBoard[to.row][to.col] = { 
    ...piece, 
    hasMoved: true 
  };
  newBoard[from.row][from.col] = null;
  
  return { 
    newBoard, 
    capturedPiece, 
    moveType 
  };
};

// Check if the game has ended and return the result
export const checkGameEndConditions = (
  board: (Piece | null)[][],
  currentPlayer: PlayerColor
): GameState => {
  // Check if the current player has any legal moves
  let hasLegalMoves = false;
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        const moves = getPossibleMoves(board, { row, col }, []);
        if (moves.length > 0) {
          hasLegalMoves = true;
          break;
        }
      }
    }
    if (hasLegalMoves) break;
  }
  
  if (!hasLegalMoves) {
    // If in check, it's checkmate
    if (isKingInCheck(board, currentPlayer)) {
      return 'checkmate';
    }
    // If not in check, it's stalemate
    return 'stalemate';
  }
  
  // Check for insufficient material (simplified version)
  const pieces: { type: string, color: string }[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece) {
        pieces.push({ type: piece.type, color: piece.color });
      }
    }
  }
  
  // King vs King
  if (pieces.length === 2) {
    return 'draw';
  }
  
  // King and bishop vs King or King and knight vs King
  if (pieces.length === 3 && 
      pieces.some(p => p.type === 'bishop' || p.type === 'knight')) {
    return 'draw';
  }
  
  // King and bishop vs King and bishop (same color bishops)
  if (pieces.length === 4 && 
      pieces.filter(p => p.type === 'bishop').length === 2) {
    const bishops = pieces.filter(p => p.type === 'bishop');
    if (bishops[0].color !== bishops[1].color) {
      // This is a simplification - in reality we'd need to check if bishops
      // are on same colored squares
      return 'draw';
    }
  }
  
  return 'playing';
};

// Determine which color should move based on move history length
export const getColorToMove = (moveCount: number): PlayerColor => {
  return moveCount % 2 === 0 ? 'white' : 'black';
};

// Check if a move is valid
export const isMoveValid = (
  board: (Piece | null)[][],
  from: Position,
  to: Position,
  moveHistory: Move[]
): boolean => {
  const piece = board[from.row][from.col];
  if (!piece) return false;
  
  const possibleMoves = getPossibleMoves(board, from, moveHistory);
  return possibleMoves.some(move => move.row === to.row && move.col === to.col);
};