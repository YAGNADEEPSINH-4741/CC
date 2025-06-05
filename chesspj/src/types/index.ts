export type PlayerColor = 'white' | 'black';

export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';

export type GameState = 'playing' | 'checkmate' | 'stalemate' | 'draw';

export type MoveType = 
  | 'normal' 
  | 'capture' 
  | 'castling' 
  | 'en_passant' 
  | 'promotion';

export type CardType = 'advantage' | 'disadvantage' | 'chaotic';

export interface Card {
  id: string;
  name: string;
  icon: string;
  type: CardType;
  description: string;
  effect: (gameState: any) => void; // Will be properly typed when implementing effects
}

export interface PlayerCards {
  selected: Card[];
  used: Set<string>;
}

export interface Piece {
  type: PieceType;
  color: PlayerColor;
  hasMoved?: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  piece: Piece;
  from: Position;
  to: Position;
  capturedPiece: Piece | null;
  moveType: MoveType;
  promotedTo?: PieceType;
}