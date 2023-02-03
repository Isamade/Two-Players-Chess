import { findKings, changeColor } from "./utility.js";
import { kingCheckType } from "./kingCheckType.js";
import { pawn, rook, knight, bishop, queen, king } from "./chessPieces.js";

export const movePiece = (selectedPiece, targetSquare, pieceDataStore, button) => {
    let canPieceMakeMove, isMyKingChecked;
    const myKingPosition = findKings(pieceDataStore.probeBoard)[selectedPiece.color];
    const yourKingColor = changeColor(selectedPiece.color);
    const yourKingPosition = findKings(pieceDataStore.probeBoard)[yourKingColor];

    canPieceMakeMove = (() => {
        if (selectedPiece.name.charAt(0) === 'P') {
            return pawn(selectedPiece, targetSquare, pieceDataStore, button)
        }

        else if (selectedPiece.name.charAt(0) === 'R') {
            return rook(selectedPiece, targetSquare, pieceDataStore)
        }

        else if (selectedPiece.name.charAt(0) === 'N') {
            return knight(selectedPiece, targetSquare, pieceDataStore)
        }

        else if (selectedPiece.name.charAt(0) === 'B') {
            return bishop(selectedPiece, targetSquare, pieceDataStore)
        }

        else if (selectedPiece.name.charAt(0) === 'Q') {
            return queen(selectedPiece, targetSquare, pieceDataStore)
        }

        else if (selectedPiece.name.charAt(0) === 'K') {
            return king(selectedPiece, targetSquare, pieceDataStore)
        }
    })();

    if (!canPieceMakeMove) {
        return canPieceMakeMove;
    }

    isMyKingChecked = kingCheckType(myKingPosition, selectedPiece.color, pieceDataStore.probeBoard).isCheck();

    if (isMyKingChecked) {
        return !isMyKingChecked;
    }

    if (pieceDataStore.swap) {
        switch(selectedPiece.color) {
            case 'white':
                document.querySelector('.modal-white').classList.add('show');
                break;
            case 'black':
                document.querySelector('.modal-black').classList.add('show');
                break;
            default:
                break;
        }

        return false;
    }

    pieceDataStore.checkType = kingCheckType(yourKingPosition, yourKingColor, pieceDataStore.probeBoard).value();

    return true;

}