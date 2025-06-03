export type PlayerColor = 'white' | 'black';

export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king';

export type GameState = 'playing' | 'checkmate' | 'stalemate' | 'draw';

export type MoveType = 
  | 'normal' 
  | 'capture' 
  | 'castling' 
  | 'en_passant' 
  | 'promotion';

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