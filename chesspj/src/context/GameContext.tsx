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
import { Piece, Position, Move, GameState, PieceType, PlayerColor, Card, PlayerCards } from '../types';

interface GameContextType {
  boardState: Piece[][];
  selectedPiece: Position | null;
  possibleMoves: Position[];
  currentPlayer: PlayerColor;
  gameState: GameState;
  check: boolean;
  moveHistory: Move[];
  promotionPending: { from: Position; to: Position } | null;
  whitePlayerCards: PlayerCards;
  blackPlayerCards: PlayerCards;
  selectPiece: (position: Position) => void;
  makeMove: (to: Position) => void;
  promotePawn: (pieceType: PieceType) => void;
  resetGame: () => void;
  undoMove: () => void;
  setPlayerCards: (color: PlayerColor, cards: Card[]) => void;
  useCard: (color: PlayerColor, card: Card) => void;
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
  const [whitePlayerCards, setWhitePlayerCards] = useState<PlayerCards>({ selected: [], used: new Set() });
  const [blackPlayerCards, setBlackPlayerCards] = useState<PlayerCards>({ selected: [], used: new Set() });

  useEffect(() => {
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
    
    if (!selectedPiece || selectedPiece.row !== position.row || selectedPiece.col !== position.col) {
      if (piece && piece.color === currentPlayer) {
        setSelectedPiece(position);
        setPossibleMoves(getPossibleMoves(boardState, position, moveHistory));
      } else {
        setSelectedPiece(null);
        setPossibleMoves([]);
      }
    } else {
      setSelectedPiece(null);
      setPossibleMoves([]);
    }
  };

  const makeMove = (to: Position) => {
    if (!selectedPiece || gameState !== 'playing' || promotionPending) return;

    const from = selectedPiece;
    const piece = boardState[from.row][from.col];
    
    if (!piece) return;
    
    const isValid = possibleMoves.some(move => move.row === to.row && move.col === to.col);
    
    if (isValid) {
      if (piece.type === 'pawn' && (to.row === 0 || to.row === 7)) {
        setPromotionPending({ from, to });
        return;
      }
      
      const { newBoard, capturedPiece, moveType } = movePiece(boardState, from, to, moveHistory);
      
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
    
    newBoard[from.row][from.col] = null;
    newBoard[to.row][to.col] = {
      type: pieceType,
      color: piece.color,
      hasMoved: true
    };
    
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
    setWhitePlayerCards({ selected: [], used: new Set() });
    setBlackPlayerCards({ selected: [], used: new Set() });
  };

  const undoMove = () => {
    if (moveHistory.length === 0 || gameState !== 'playing') return;
    
    const newHistory = [...boardStateHistory];
    newHistory.pop();
    
    const previousState = newHistory[newHistory.length - 1];
    setBoardState(previousState);
    setBoardStateHistory(newHistory);
    
    const newMoveHistory = [...moveHistory];
    newMoveHistory.pop();
    setMoveHistory(newMoveHistory);
    
    setCurrentPlayer(getColorToMove(newMoveHistory.length));
    
    setGameState('playing');
    setSelectedPiece(null);
    setPossibleMoves([]);
  };

  const setPlayerCards = (color: PlayerColor, cards: Card[]) => {
    if (color === 'white') {
      setWhitePlayerCards({ selected: cards, used: new Set() });
    } else {
      setBlackPlayerCards({ selected: cards, used: new Set() });
    }
  };

  const useCard = (color: PlayerColor, card: Card) => {
    if (color !== currentPlayer || gameState !== 'playing') return;

    const playerCards = color === 'white' ? whitePlayerCards : blackPlayerCards;
    if (playerCards.used.has(card.id)) return;

    // Execute card effect
    card.effect({ boardState, currentPlayer, moveHistory });

    // Mark card as used
    if (color === 'white') {
      setWhitePlayerCards({
        ...whitePlayerCards,
        used: new Set([...whitePlayerCards.used, card.id])
      });
    } else {
      setBlackPlayerCards({
        ...blackPlayerCards,
        used: new Set([...blackPlayerCards.used, card.id])
      });
    }
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
    whitePlayerCards,
    blackPlayerCards,
    selectPiece,
    makeMove,
    promotePawn,
    resetGame,
    undoMove,
    setPlayerCards,
    useCard
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