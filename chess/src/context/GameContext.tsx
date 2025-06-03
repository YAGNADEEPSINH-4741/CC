import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createInitialBoardState,
  isMoveValid,
  movePiece,
  isKingInCheck,
  getPossibleMoves,
  checkGameEndConditions,
  getColorToMove
} from '../utils/gameLogic';
import { Piece, Position, Move, GameState, PieceType, PlayerColor } from '../types';

interface GameContextType {
  boardState: Piece[][];
  selectedPiece: Position | null;
  possibleMoves: Position[];
  currentPlayer: PlayerColor;
  gameState: GameState;
  check: boolean;
  moveHistory: Move[];
  promotionPending: { from: Position; to: Position } | null;
  selectPiece: (position: Position) => void;
  makeMove: (to: Position) => void;
  promotePawn: (pieceType: PieceType) => void;
  resetGame: () => void;
  undoMove: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [boardState, setBoardState] = useState<Piece[][]>(createInitialBoardState());
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<PlayerColor>('white');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [check, setCheck] = useState(false);
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [promotionPending, setPromotionPending] = useState<{ from: Position; to: Position } | null>(null);
  const [boardStateHistory, setBoardStateHistory] = useState<Piece[][][]>([createInitialBoardState()]);

  useEffect(() => {
    // Check for check, checkmate, stalemate
    const inCheck = isKingInCheck(boardState, currentPlayer);
    setCheck(inCheck);
    
    if (gameState === 'playing') {
      const endCondition = checkGameEndConditions(boardState, currentPlayer);
      if (endCondition !== 'playing') {
        setGameState(endCondition);
      }
    }
  }, [boardState, currentPlayer, gameState]);

  const selectPiece = (position: Position) => {
    if (gameState !== 'playing' || promotionPending) return;
    
    const piece = boardState[position.row][position.col];
    
    // If no piece is selected or selecting a different piece
    if (!selectedPiece || selectedPiece.row !== position.row || selectedPiece.col !== position.col) {
      // Can only select your own pieces
      if (piece && piece.color === currentPlayer) {
        setSelectedPiece(position);
        setPossibleMoves(getPossibleMoves(boardState, position, moveHistory));
      } else {
        setSelectedPiece(null);
        setPossibleMoves([]);
      }
    } else {
      // Deselect if clicking the same piece
      setSelectedPiece(null);
      setPossibleMoves([]);
    }
  };

  const makeMove = (to: Position) => {
    if (!selectedPiece || gameState !== 'playing' || promotionPending) return;

    const from = selectedPiece;
    const piece = boardState[from.row][from.col];
    
    if (!piece) return;
    
    // Check if the move is in possible moves
    const isValid = possibleMoves.some(move => move.row === to.row && move.col === to.col);
    
    if (isValid) {
      // Check for pawn promotion
      if (piece.type === 'pawn' && (to.row === 0 || to.row === 7)) {
        setPromotionPending({ from, to });
        return;
      }
      
      const { newBoard, capturedPiece, moveType } = movePiece(boardState, from, to, moveHistory);
      
      // Update state
      setBoardState(newBoard);
      setBoardStateHistory([...boardStateHistory, newBoard]);
      
      const move: Move = {
        piece,
        from,
        to,
        capturedPiece,
        moveType,
      };
      
      setMoveHistory([...moveHistory, move]);
      setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
      setSelectedPiece(null);
      setPossibleMoves([]);
    }
  };

  const promotePawn = (pieceType: PieceType) => {
    if (!promotionPending) return;
    
    const { from, to } = promotionPending;
    const piece = boardState[from.row][from.col];
    
    if (!piece || piece.type !== 'pawn') return;
    
    const newBoard = [...boardState.map(row => [...row])];
    
    // Remove the pawn
    newBoard[from.row][from.col] = null;
    
    // Add the promoted piece
    newBoard[to.row][to.col] = {
      type: pieceType,
      color: piece.color,
      hasMoved: true
    };
    
    // Update state
    setBoardState(newBoard);
    setBoardStateHistory([...boardStateHistory, newBoard]);
    
    const move: Move = {
      piece,
      from,
      to,
      capturedPiece: boardState[to.row][to.col],
      moveType: 'promotion',
      promotedTo: pieceType
    };
    
    setMoveHistory([...moveHistory, move]);
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    setPromotionPending(null);
  };

  const resetGame = () => {
    const initialBoard = createInitialBoardState();
    setBoardState(initialBoard);
    setBoardStateHistory([initialBoard]);
    setSelectedPiece(null);
    setPossibleMoves([]);
    setCurrentPlayer('white');
    setGameState('playing');
    setCheck(false);
    setMoveHistory([]);
    setPromotionPending(null);
  };

  const undoMove = () => {
    if (moveHistory.length === 0 || gameState !== 'playing') return;
    
    // Remove the last state
    const newHistory = [...boardStateHistory];
    newHistory.pop();
    
    // Go back to previous state
    const previousState = newHistory[newHistory.length - 1];
    setBoardState(previousState);
    setBoardStateHistory(newHistory);
    
    // Remove last move
    const newMoveHistory = [...moveHistory];
    newMoveHistory.pop();
    setMoveHistory(newMoveHistory);
    
    // Update current player
    setCurrentPlayer(getColorToMove(newMoveHistory.length));
    
    // Reset game state to playing when undoing
    setGameState('playing');
    setSelectedPiece(null);
    setPossibleMoves([]);
  };

  const value = {
    boardState,
    selectedPiece,
    possibleMoves,
    currentPlayer,
    gameState,
    check,
    moveHistory,
    promotionPending,
    selectPiece,
    makeMove,
    promotePawn,
    resetGame,
    undoMove
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};