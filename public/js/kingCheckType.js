import { findColor, findKings } from "./utility.js";
import { pawn, rook, knight, bishop, queen, king } from "./chessPieces.js";

export const kingCheckType = (kingPosition, kingColor, board) => {

    const checkDataStore = {
        probeBoard: board.slice(),
        swap: false,
        hasKingCastled: true
    };

    const isCheck = () => {
        let kingChecked = false;
        let selectedPiece;
        const pos = findKings(checkDataStore.probeBoard)[kingColor];
        const targetSquare = {
            name: checkDataStore.probeBoard[pos],
            color: kingColor,
            xValue: (pos % 8) + 1,
            yValue: Math.floor(pos/8) + 1,
            position: pos
        };
        const pieceDataStore = {
            probeBoard: [],
            swap: false,
            hasKingCastled: true
        };
        for (let idx = 0; idx < 64; idx++) {

            if (checkDataStore.probeBoard[idx] !== '' && kingColor !== findColor(checkDataStore.probeBoard[idx])) {
                pieceDataStore.probeBoard = checkDataStore.probeBoard.slice();
                selectedPiece = {
                    name: checkDataStore.probeBoard[idx],
                    color: findColor(checkDataStore.probeBoard[idx]),
                    xValue: (idx % 8) + 1,
                    yValue: Math.floor(idx/8) + 1,
                    position: idx
                };

                switch (checkDataStore.probeBoard[idx]) {
                    case 'PW':
                    case 'PB':
                        kingChecked = pawn(selectedPiece, targetSquare, pieceDataStore, '');
                        if (kingChecked) { return kingChecked };
                        break;
                    case 'RW':
                    case 'RB':
                        kingChecked = rook(selectedPiece, targetSquare, pieceDataStore);
                        if (kingChecked) { return kingChecked };
                        break;
                    case 'NW':
                    case 'NB':
                        kingChecked = knight(selectedPiece, targetSquare, pieceDataStore);
                        if (kingChecked) { return kingChecked };
                        break;
                    case 'BW':
                    case 'BB':
                        kingChecked = bishop(selectedPiece, targetSquare, pieceDataStore);
                        if (kingChecked) { return kingChecked };
                        break;
                    case 'QW':
                    case 'QB':
                        kingChecked = queen(selectedPiece, targetSquare, pieceDataStore);
                        if (kingChecked) { return kingChecked };
                        break;
                    case 'KW':
                    case 'KB':
                        kingChecked = king(selectedPiece, targetSquare, pieceDataStore);
                        if (kingChecked) { return kingChecked };
                        break;
                    default:
                        break;
                }
            }
        }
        return kingChecked;
    }

    const checkmate = () => {
        let selectedPiece, targetSquare, moved;

        for (let idx = 0; idx < 64; idx++) {

            if (board[idx] !== '' && kingColor === findColor(board[idx])) {
                selectedPiece = {
                    name: board[idx],
                    color: findColor(board[idx]),
                    xValue: (idx % 8) + 1,
                    yValue: Math.floor(idx/8) + 1,
                    position: idx
                };

                for (let idx = 0; idx < 64; idx++) {
                    targetSquare = {
                        name: board[idx],
                        color: findColor(board[idx]),
                        xValue: (idx % 8) + 1,
                        yValue: Math.floor(idx/8) + 1,
                        position: idx
                    }

                    switch (selectedPiece.name) {
                        case 'PW':
                        case 'PB':
                            moved = pawn(selectedPiece, targetSquare, checkDataStore, '');
                            if (moved && !isCheck()) { return '' };
                            break;
                        case 'RW':
                        case 'RB':
                            moved = rook(selectedPiece, targetSquare, checkDataStore);
                            if (moved && !isCheck()) { return '' };
                            break;
                        case 'NW':
                        case 'NB':
                            moved = knight(selectedPiece, targetSquare, checkDataStore);
                            if (moved && !isCheck()) { return '' };
                            break;
                        case 'BW':
                        case 'BB':
                            moved = bishop(selectedPiece, targetSquare, checkDataStore);
                            if (moved && !isCheck()) { return '' };
                            break;
                        case 'QW':
                        case 'QB':
                            moved = queen(selectedPiece, targetSquare, checkDataStore);
                            if (moved && !isCheck()) { return '' };
                            break;
                        case 'KW':
                        case 'KB':
                            moved = king(selectedPiece, targetSquare, checkDataStore);
                            if (moved && !isCheck()) { return '' };
                            break;
                        default:
                            break;
                    }

                    checkDataStore.probeBoard = board.slice();

                }
            }
        }

        return 'Checkmate'
    }

    return {
        isCheck,
        value: (() => {
            switch (isCheck()) {
                case false:
                    return '';
                case true:
                    return (checkmate() || 'Check')
            }
        })
    }
}