import Helper from "./helper.js";

import { Game } from "./game.js";

export class Messenger {
    socket: any
    game: Game
    constructor(game: Game) {
        //this.socket = io();
        this.socket = null;
        this.game = game;
        //this.board = null;

        this.socket.on('opponentJoined', this.notifyJoin.bind(this));
        this.socket.on('opponentExited', this.notifyExit.bind(this));
        this.socket.on('drawOffered', this.notifyOffer.bind(this));
        this.socket.on('drawAccepted', this.notifyAcceptance.bind(this));
        this.socket.on('drawRefused', this.notifyRefusal.bind(this));
        this.socket.on('endedGame', this.notifyEnd.bind(this));
        this.socket.on('savedGame', this.notifySave.bind(this));
        this.socket.on('movedPiece', this.makeMove.bind(this));
        //this.socket.on('connect', this.setBoard.bind(this));
    }

    notifyJoin(username: string) {
        this.game.opponent = username;
        alert(`${username} has joined the game`);
        this.socket.emit('updateMyBoard', {name: this.game.name}, (error: string, layout: string[], playersTurn: string) => {
            this.game.board.updateBoard(error, layout, playersTurn)
        });
    }

    notifyExit(username: string) {
        alert(`${username} has exited the game`);
        localStorage.removeItem('currentGame');
        setTimeout(()=>{
            document.location.href = '/pages/dashboard';
        }, 5000);
    }

    notifyOffer(username: string) {
        const answer = confirm(`${username} wants to end this game in a draw`);
        if (answer) {
            this.socket.emit('acceptDraw', {clientId: this.game.id, name: this.game.name}, (error: string) => {
                if (error) {
                    alert(error);
                    location.reload();
                    return;
                }
                localStorage.removeItem('currentGame');
                alert('Game has ended in a draw');
            })
        } 
        else if (!answer) {
            this.socket.emit('refuseDraw', {name: this.game.name, username: this.game.username}, (error: string, layout: string[], playersTurn: string) => {
                this.game.board.updateBoard(error, layout, playersTurn)
            });
        }
    }

    notifyAcceptance() {
        localStorage.removeItem('currentGame');
        alert(`Game has ended in a draw`);
    }

    notifyRefusal(username: string) {
        alert(`${username} wants to continue`);
        this.socket.emit('updateMyBoard', {name: this.game.name}, (error: string, layout: string[], playersTurn: string) => {
            this.game.board.updateBoard(error, layout, playersTurn)
        });
    }

    notifyEnd(username: string) {
        localStorage.removeItem('currentGame');
        alert(`Game has ended! ${username} lost`);
    }

    notifySave(timeSaved: string) {
        alert(`Game saved at ${timeSaved}`);
        this.socket.emit('updateMyBoard', {name: this.game.name}, (error: string, layout: string[], playersTurn: string) => {
            this.game.board.updateBoard(error, layout, playersTurn)
        });
    }

    makeMove({layout, checkType}: {layout: string[], checkType: string}) {
        this.game.board.updateBoard('', layout, Helper.changeColor(this.game.board.playersTurn));
        if (checkType) alert(checkType);
    }

    setBoard() {
        console.log('setBoard');
        if (this.game && this.game.playersColor) {
            this.socket.emit('updateMyBoard', {name: this.game.name}, (error: string, layout: string[], playersTurn: string) => {
                this.game.board.updateBoard(error, layout, playersTurn)
            });
        }
    }
}