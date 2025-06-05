import React from 'react';
import { Piece } from '../types';

interface ChessPieceProps {
  piece: Piece;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece }) => {
  const { type, color } = piece;
  
  // Custom piece images based on type and color
  const getPieceImage = () => {
    const baseUrl = 'https://images2.imgbox.com/8b/3a/';
    const pieces = {
      white: {
        king: 'wk_o8PFHr.png',
        queen: 'wq_HKGxTp.png',
        rook: 'wr_QWvNYm.png',
        bishop: 'wb_JcPKLn.png',
        knight: 'wn_MnBvRt.png',
        pawn: 'wp_KtHgFs.png'
      },
      black: {
        king: 'bk_PqNmWx.png',
        queen: 'bq_LsRtYv.png',
        rook: 'br_HjKlMn.png',
        bishop: 'bb_XcVbNm.png',
        knight: 'bn_QwErTy.png',
        pawn: 'bp_ZxCvBn.png'
      }
    };

    return `${baseUrl}${pieces[color][type]}`;
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