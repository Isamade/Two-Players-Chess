import {Checker} from "./checker.js";
import {Pawn, Rook, Knight, Bishop, Queen, King} from "./chessPieces.js";
import Helper from "./helper.js";

import Board from "./board.js";

export default class Mover {
    static worker = new Worker('../js/worker.js');
    //static worker = {}

    static movePiece(board: Board, button: Element | null) {
        let canPieceMakeMove;
        let wasMyKingAttacked;
        canPieceMakeMove = (() => {
            switch(board.selectedPiece.name?.charAt(0)) {
                case 'P':
                    return Pawn.move(board.selectedPiece, board.targetSquare, board.probe, button);
                case 'R':
                    return Rook.move(board.selectedPiece, board.targetSquare, board.probe);
                case 'N':
                    return Knight.move(board.selectedPiece, board.targetSquare, board.probe);
                case 'B':
                    return Bishop.move(board.selectedPiece, board.targetSquare, board.probe);
                case 'Q':
                    return Queen.move(board.selectedPiece, board.targetSquare, board.probe);
                case 'K':
                    return King.move(board.selectedPiece, board.targetSquare, board.probe);
            }
        })();

        if (!canPieceMakeMove) {
            return false;
        }

        wasMyKingAttacked = new Checker(board.game.playersColor, board.probe.layout).wasKingChecked();

        if (wasMyKingAttacked) {
            return false;
        }

        if (board.probe.swap) {
            switch(board.selectedPiece.color) {
                case 'white':
                    (document.querySelector('.modal-white') as HTMLDivElement).classList.add('show');
                    break;
                case 'black':
                    (document.querySelector('.modal-black') as HTMLDivElement).classList.add('show');
                    break;
                default:
                    break;
            }
    
            return false;
        }
    
        board.probe.checkType = new Checker(Helper.changeColor(board.game.playersColor), board.probe.layout).findCheckType() || '';
    
        return true;
    }

    static showPossibleMoves(board: Board) {
        this.worker.addEventListener('message', function (reply) {
            const moves = JSON.parse(reply.data);
            moves.forEach((position: number) => {
                if (String(position) && board.squares) board.squares[position].classList.add('outline-cell');
            });
        });
        const message = JSON.stringify({selectedPiece: board.selectedPiece, 
                                        layout: board.layout, 
                                        canKingCastleLeft: board.canKingCastleLeft,
                                        canKingCastleRight: board.canKingCastleRight});
        this.worker.postMessage(message);
    }
}