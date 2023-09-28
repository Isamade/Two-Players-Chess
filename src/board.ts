import Mover from './mover.js';
import Helper from "./helper.js";

import { Game } from "./game.js";

type DropEventTarget = EventTarget & {id: string, appendChild: (child: HTMLElement | null) => void}

interface PieceInterface {
    name: string | null
    color: string | null
    position: number | null
    xValue: number | null
    yValue: number | null
}

interface ProbeInterface {
    checkType: string
    swap: boolean
    canKingCastleLeft: boolean
    canKingCastleRight: boolean
    layout: string[]
}

export default class Board {
    game: Game
    layout: string[]
    playersTurn: string
    canKingCastleLeft: boolean
    canKingCastleRight: boolean
    selectedPiece: PieceInterface
    targetSquare: PieceInterface
    probe: ProbeInterface
    squares: NodeListOf<HTMLDivElement> | null
    square: HTMLDivElement | null
    constructor(game: Game) {
        this.game = game;
        //this.messenger = null;
        this.layout = [];
        this.playersTurn = '';
        this.canKingCastleLeft = true;
        this.canKingCastleRight = true;
        this.selectedPiece = {
            name: '',
            color: '',
            position: null,
            xValue: null,
            yValue: null
        };
        this.targetSquare = {
            name: '',
            color: '',
            position: null,
            xValue: null,
            yValue: null
        };
        this.probe = {
            checkType: '',
            swap: false,
            canKingCastleLeft: true,
            canKingCastleRight: true,
            layout: []
        };
        this.squares = null;
        this.square = null;
    }

    updateBoard(error: string, layout: string[], playersTurn: string) {
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
                square.firstChild?.firstChild && square.firstChild.firstChild.addEventListener('dragstart', this.interact(square, index, null).drag);
                square.firstChild?.addEventListener('dragover', this.allowDrop);
                square.firstChild?.addEventListener('drop', this.interact(square, index, null).drop);
            });
            document.querySelectorAll('.swap-btn').forEach((button) => {
                button.addEventListener('click', this.interact(null, null, button).click)
            });
        }
    }

    interact(square: HTMLDivElement | null, index: number | null, button: Element | null) {
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
                const color = index && Helper.findColor(this.layout[index]);
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
                                name: (index && this.layout[index]) || null,
                                color: color || null,
                                position: (square?.dataset && square.dataset.pos && +square.dataset.pos) || null,
                                xValue: (square?.dataset && square.dataset.hori && +square.dataset.hori) || null,
                                yValue: (square?.dataset && square.dataset.vert && +square.dataset.vert) || null
                            }
                        }
                        Mover.movePiece(this, button) && this.notifyOpponent();
                        break;
                    default: 
                        break;
                }
            },
            drag: (event: Event) => {
                const color = index && Helper.findColor(this.layout[index]);
                if ((color === this.playersTurn) && (color === this.game.playersColor)) {
                    (event as DragEvent).dataTransfer?.setData("piece", (event.target as DropEventTarget)?.id);
                    this.unselectPiece();
                    this.selectPiece(square);
                    this.square = square;
                    Mover.showPossibleMoves(this);
                }
            },
            drop: (event: Event) => {
                event.preventDefault();
                this.probe = {
                    checkType: '',
                    swap: this.probe.swap || false,
                    canKingCastleLeft: this.canKingCastleLeft,
                    canKingCastleRight: this.canKingCastleRight,
                    layout: this.layout.slice()
                }
                const color = index && Helper.findColor(this.layout[index]);
                this.targetSquare = {
                    name: (index && this.layout[index]) || null,
                    color: color || null,
                    position: (square?.dataset && square.dataset.pos && +square.dataset.pos) || null,
                    xValue: (square?.dataset && square.dataset.hori && +square.dataset.hori) || null,
                    yValue: (square?.dataset && square.dataset.vert && +square.dataset.vert) || null
                }
                if (color === this.selectedPiece.color) {
                    this.unselectPiece();
                }
                else if (this.playersTurn !== this.game.playersColor) {
                    this.unselectPiece();
                }
                else if (Mover.movePiece(this, button)) {
                    const piece = (event as DragEvent).dataTransfer?.getData("piece") || '';
                    (event.target as DropEventTarget)?.appendChild(document.getElementById(piece));
                    this.notifyOpponent();
                }
            }
        }
    }

    notifyOpponent() {
        this.game.messenger.socket.emit('movePiece', 
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
        (error: string, layout: string[], canKingCastleLeft: boolean, canKingCastleRight: boolean, playersTurn: string, checkType: string) => {
            if (error) {
                alert(error);
                return;
            }
            this.canKingCastleLeft = canKingCastleLeft;
            this.canKingCastleRight = canKingCastleRight;
            this.updateBoard('', layout, playersTurn);
            this.unselectPiece();
            (checkType === "Checkmate") && alert('Game Over, you win!');
            (checkType === "Stalemate") && alert('Game Over, Stalemate');
        });
    }

    selectPiece(square: HTMLDivElement | null) {
        this.selectedPiece.name = square?.firstElementChild?.classList[0] || null;
        this.selectedPiece.color = square?.firstElementChild?.classList[1] || null;
        this.selectedPiece.xValue = (square?.dataset && square.dataset.hori && +square.dataset.hori) || null;
        this.selectedPiece.yValue = (square?.dataset && square.dataset.vert && +square.dataset.vert) || null;
        this.selectedPiece.position = (square?.dataset && square.dataset.pos && +square.dataset.pos) || null;
        square && square.classList.add('highlighter');
    }

    unselectPiece() {
        this.square && this.square.classList.remove('highlighter');
        this.squares && this.squares.forEach((square) => {
            square.classList.remove('outline-cell');
        });
        this.selectedPiece.name = '';
        this.selectedPiece.color = '';
        this.selectedPiece.xValue = null;
        this.selectedPiece.yValue = null;
        this.selectedPiece.position = null;
    }

    allowDrop(event: Event) {
        event.preventDefault();
    }
}