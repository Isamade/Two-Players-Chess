import {Messenger} from "./messenger.js";
import Board from "./board.js";

export class Game {
    constructor(name) {
        this.messenger = null;
        this.board = null;
        this.name = name;
        this.username = '';
        this.opponent = '';
    }

    connectTools() {
        this.messenger = new Messenger(this);
        this.board = new Board(this);
        this.messenger.board = this.board;
        this.board.messenger = this.messenger;
    }

    static exitGame() {
        setTimeout(() => {
            console.log('exit1');
            window.location.href = '/pages/dashboard';
        }, 1000);
    }
}

export class PlayersGame extends Game {
    constructor(name) {
        super(name);
        this.id = '';
        this.username = window.sessionStorage.getItem('username');
        this.playersColor = '';

        document.querySelector('.save-game').addEventListener('click', this.saveGame.bind(this));
        document.querySelector('.exit-game').addEventListener('click', this.exitGame.bind(this));
        document.querySelector('.end-game').addEventListener('click', this.endGame.bind(this));
        document.querySelector('.offer-draw').addEventListener('click', this.offerDraw.bind(this));
    }

    saveGame() {
        this.messenger.socket.emit('saveGame', {clientId: this.id, name: this.name}, (error, message) => {
            if (error) {
                alert(error);
                location.reload();
                return;
            }
            alert(`Game saved at ${message}`);
            this.messenger.socket.emit('updateMyBoard', {name: this.name}, (error, layout, playersTurn) => {
                this.board.updateBoard(error, layout, playersTurn)
            });
        });
    }

    exitGame() {
        this.messenger.socket.emit('exitGame', {clientId: this.id, name: this.name, username: this.username});
        localStorage.removeItem('currentGame');
        console.log('exit2');
    }

    endGame() {
        this.messenger.socket.emit('endGame', {clientId: this.id, name: this.name}, (error) => {
            if (error) {
                alert(error);
                location.reload();
                return;
            }
            localStorage.removeItem('currentGame');
            alert('Game has ended! You lost');
        })
    }

    offerDraw() {
        this.messenger.socket.emit('offerDraw',  {name: this.name, username: this.username }, (error) => {
            if (error) {
                alert(error);
                location.reload();
                return;
            }
        })
    }
}