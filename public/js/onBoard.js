import { changeColor, updateBoard } from "./utility.js";
import { movePiece } from "./movePiece.js";

export const onBoard = (squares, square, me, socket, button='') => {

    return {
        click: function(){

            const selectPiece = () => {
                me.selectedPiece.name = square.firstElementChild.classList[0];
                me.selectedPiece.color = square.firstElementChild.classList[1];
                me.selectedPiece.xValue = +square.dataset.vert;
                me.selectedPiece.yValue = +square.dataset.hori;
                me.selectedPiece.position = +square.dataset.pos;
                me.playersColor !== '' && square.classList.add('highlighter');
            }

            const unselectPiece = () => {
                squares && squares[me.selectedPiece.position].classList.remove('highlighter');
                me.selectedPiece.name = '';
                me.selectedPiece.color = '';
                me.selectedPiece.xValue = '';
                me.selectedPiece.yValue = '';
                me.selectedPiece.position = '';
            }

            me.pieceDataStore = {
                checkType: '',
                swap: me.pieceDataStore.swap || false,
                hasKingCastled: me.hasKingCastled,
                probeBoard: me.board.slice()
            };
            let movedPiece;

            switch(me.selectedPiece.color) {
                case '':
                    if (square.firstElementChild && (square.firstElementChild.classList[1] === me.playersTurn)) {
                        selectPiece();
                    }
                    break;
                case 'white':
                case 'black':
                    if (square.firstElementChild && (square.firstElementChild.classList[1] === me.selectedPiece.color)) {
                        unselectPiece();
                        break;
                    }
                    if (me.playersTurn !== me.playersColor) {
                        unselectPiece();
                        break;
                    }
                    if (!me.pieceDataStore.swap) {
                        me.targetSquare = {
                            name: ((square.firstElementChild && square.firstElementChild.classList[0]) || ''),
                            color: ((square.firstElementChild && square.firstElementChild.classList[1]) || ''),
                            xValue: +square.dataset.vert,
                            yValue: +square.dataset.hori,
                            position: +square.dataset.pos
                        }
                    }
                    movedPiece = movePiece(me.selectedPiece, me.targetSquare, me.pieceDataStore, button);
                    if (movedPiece) {
                        me.playersTurn = changeColor(me.playersTurn);
                        try {
                            socket.emit('movePiece', 
                            {
                                name: me.name,
                                username: me.username,
                                clientId: me.id,
                                board: me.pieceDataStore.probeBoard,
                                playersTurn: me.playersTurn,
                                hasKingCastled: me.pieceDataStore.hasKingCastled,
                                checkType: me.pieceDataStore.checkType
                            }, 
                            (error, board, hasKingCastled, checkType) => {
                                if (error) {
                                    alert(error);
                                }
                                else {
                                    //me.hasKingCastled = me.pieceDataStore.hasKingCastled;
                                    //me.board = me.pieceDataStore.probeBoard;
                                    //transferPiece(squares, me.selectedPiece.position, me.targetSquare.position);
                                    me.hasKingCastled = hasKingCastled;
                                    me.board = board;
                                    updateBoard(board, squares, me, socket);
                                    unselectPiece();
                                    (checkType === "Checkmate") && alert('Game Over, you win!')
                                }
                            });
                        } catch {
                            me.playersTurn = changeColor(me.playersTurn);
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }
}