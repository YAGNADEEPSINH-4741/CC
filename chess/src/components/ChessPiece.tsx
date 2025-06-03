import React from 'react';
import { Piece } from '../types';

import wk from './wk.png';
import wq from './wq.png';
import wr from './wr.png';
import wb from './wb.png';
import wn from './wn.png';
import wp from './wp.png';
import bk from './bk.png';
import bq from './bq.png';
import br from './br.png';
import bb from './bb.png';
import bn from './bn.png';
import bp from './bp.png';

interface ChessPieceProps {
  piece: Piece;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece }) => {
  const { type, color } = piece;
  
  // Custom piece images based on type and color
  const getPieceImage = () => {
    const pieces = {
      white: {
        king: wk,
        queen: wq,
        rook: wr,
        bishop: wb,
        knight: wn,
        pawn: wp
      },
      black: {
        king: bk,
        queen: bq,
        rook: br,
        bishop: bb,
        knight: bn,
        pawn: bp
      }
    };

    return pieces[color][type];
  };

  return (
    <div className="w-full h-full flex items-center justify-center select-none">
      <img 
        src={getPieceImage()} 
        alt={`${color} ${type}`}
        className="w-4/5 h-4/5 transition-transform duration-150 hover:scale-110"
        draggable={false}
      />
    </div>
  );
};

export default ChessPiece;