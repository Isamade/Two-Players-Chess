import Mover from './mover.js';
import {Helper} from "./helper.js";

export default class Board {
    constructor(game) {
        this.game = game;
        this.messenger = null;
        this.layout = [];
        this.playersTurn = '';
        this.canKingCastleLeft = true;
        this.canKingCastleRight = true;
        this.selectedPiece = {
            name: '',
            color: '',
            position: '',
            xValue: '',
            yValue: ''
        };
        this.targetSquare = {};
        this.probe = {};
        this.squares = null;
        this.square = null;
    }

    updateBoard(error, layout, playersTurn) {
        if (error) {
            alert(error);
            return;
        }
        this.layout = layout;
        this.playersTurn = playersTurn;
        Helper.updatePageData(this.game, playersTurn);
        Helper.buildSquares(layout, this);
        (this.game.page !== 'reviewGame') && Helper.showDeadPieces(layout);
        this.connectSquares();
    }

    connectSquares() {
        if (this.game.id) {
            this.squares = document.querySelectorAll('.selectall');
            this.squares.forEach((square, index) => { 
                square.addEventListener('click', this.interact(square, index, null).click);
                square.firstChild.firstChild && square.firstChild.firstChild.addEventListener('dragstart', this.interact(square, index, null).drag);
                square.firstChild.addEventListener('dragover', this.allowDrop);
                square.firstChild.addEventListener('drop', this.interact(square, index, null).drop);
            });
            document.querySelectorAll('.swap-btn').forEach((button) => {
                button.addEventListener('click', this.interact(null, null, button).click)
            });
        }
    }

    interact(square, index, button) {
        return {
            click: () => {
                this.probe = {
                    checkType: '',
                    swap: this.probe.swap || false,
                    canKingCastleLeft: this.canKingCastleLeft,
                    canKingCastleRight: this.canKingCastleRight,
                    layout: this.layout.slice()
                }
                if (button) {
                    Mover.movePiece(this, button) && this.notifyOpponent();
                    return;
                }
                const color = Helper.findColor(this.layout[index]);
                switch(this.selectedPiece.color) {
                    case '':
                        if (color === this.playersTurn) {
                            this.selectPiece(square);
                            this.square = square;
                            if (this.selectedPiece.color === this.game.playersColor) {
                                Mover.showPossibleMoves(this);
                            }
                        }
                        break;
                    case 'white':
                    case 'black':
                        if (color === this.selectedPiece.color) {
                            this.unselectPiece();
                            break;
                        }
                        else if (this.playersTurn !== this.game.playersColor) {
                            this.unselectPiece();
                            break;
                        }
                        else if (!this.probe.swap) {
                            this.targetSquare = {
                                name: this.layout[index],
                                color: color,
                                position: +square.dataset.pos,
                                xValue: +square.dataset.hori,
                                yValue: +square.dataset.vert
                            }
                        }
                        Mover.movePiece(this, button) && this.notifyOpponent();
                        break;
                    default: 
                        break;
                }
            },
            drag: (event) => {
                const color = Helper.findColor(this.layout[index]);
                if ((color === this.playersTurn) && (color === this.game.playersColor)) {
                    event.dataTransfer.setData("piece", event.target.id);
                    this.unselectPiece();
                    this.selectPiece(square);
                    this.square = square;
                    Mover.showPossibleMoves(this);
                }
            },
            drop: (event) => {
                event.preventDefault();
                this.probe = {
                    checkType: '',
                    swap: this.probe.swap || false,
                    canKingCastleLeft: this.canKingCastleLeft,
                    canKingCastleRight: this.canKingCastleRight,
                    layout: this.layout.slice()
                }
                const color = Helper.findColor(this.layout[index]);
                this.targetSquare = {
                    name: this.layout[index],
                    color: color,
                    position: +square.dataset.pos,
                    xValue: +square.dataset.hori,
                    yValue: +square.dataset.vert
                }
                if (color === this.selectedPiece.color) {
                    this.unselectPiece();
                }
                else if (this.playersTurn !== this.game.playersColor) {
                    this.unselectPiece();
                }
                else if (Mover.movePiece(this, button)) {
                    const piece = event.dataTransfer.getData("piece");
                    event.target.appendChild(document.getElementById(piece));
                    this.notifyOpponent();
                }
            }
        }
    }

    notifyOpponent() {
        this.messenger.socket.emit('movePiece', 
        {
            name: this.game.name,
            username: this.game.username,
            clientId: this.game.id,
            layout: this.probe.layout,
            playersTurn: Helper.changeColor(this.playersTurn),
            canKingCastleLeft: this.probe.canKingCastleLeft,
            canKingCastleRight: this.probe.canKingCastleRight,
            checkType: this.probe.checkType
        }, 
        (error, layout, canKingCastleLeft, canKingCastleRight, playersTurn, checkType) => {
            if (error) {
                alert(error);
                return;
            }
            this.canKingCastleLeft = canKingCastleLeft;
            this.canKingCastleRight = canKingCastleRight;
            this.updateBoard(null, layout, playersTurn);
            this.unselectPiece();
            (checkType === "Checkmate") && alert('Game Over, you win!');
            (checkType === "Stalemate") && alert('Game Over, Stalemate');
        });
    }

    selectPiece(square) {
        this.selectedPiece.name = square.firstElementChild.classList[0];
        this.selectedPiece.color = square.firstElementChild.classList[1];
        this.selectedPiece.xValue = +square.dataset.hori;
        this.selectedPiece.yValue = +square.dataset.vert;
        this.selectedPiece.position = +square.dataset.pos;
        square.classList.add('highlighter');
    }

    unselectPiece() {
        this.square && this.square.classList.remove('highlighter');
        this.squares.forEach((square) => {
            square.classList.remove('outline-cell');
        });
        this.selectedPiece.name = '';
        this.selectedPiece.color = '';
        this.selectedPiece.xValue = '';
        this.selectedPiece.yValue = '';
        this.selectedPiece.position = '';
    }

    allowDrop(event) {
        event.preventDefault();
    }
}