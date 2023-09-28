import {Messenger} from "./messenger.js";
import Board from "./board.js";

interface MessengerInterface {
    socket: Object
    setBoard: (a:void) => void
}

interface BoardInterface {
    playersTurn: string
    updateBoard: Function
    canKingCastleLeft: boolean
    canKingCastleRight: boolean
}

export class Game {
    messenger: Messenger | MessengerInterface
    board: Board | BoardInterface
    name: string
    username: string
    opponent: string
    id: string
    playersColor: string
    page: string
    playerOneColor: string
    playerTwoColor: string
    history: []
    constructor(name: string) {
        this.messenger = {
            socket: {},
            setBoard: () => {}
        };
        this.board = {
            playersTurn: '',
            canKingCastleLeft: true,
            canKingCastleRight: true,
            updateBoard: () => {}
        };
        this.name = name;
        this.username = '';
        this.opponent = '';
        this.id = '';
        this.playersColor = '';
        this.page = '';
        this.playerOneColor = '';
        this.playerTwoColor = '';
        this.history = [];
    }

    connectTools() {
        this.messenger = new Messenger(this);
        this.board = new Board(this);
        //this.messenger.board = this.board;
        //this.board.messenger = this.messenger;
    }

    static exitGame() {
        setTimeout(() => {
            console.log('exit1');
            window.location.href = '/pages/dashboard';
        }, 1000);
    }
}

export class PlayersGame extends Game {
    //id: String
    //playersColor: String
    constructor(name: string) {
        super(name);
        //this.id = '';
        this.username = window.sessionStorage.getItem('username') || '';
        //this.playersColor = '';

        (document.querySelector('.save-game') as HTMLButtonElement).addEventListener('click', this.saveGame.bind(this));
        (document.querySelector('.exit-game') as HTMLDivElement).addEventListener('click', this.exitGame.bind(this));
        (document.querySelector('.end-game') as HTMLButtonElement).addEventListener('click', this.endGame.bind(this));
        (document.querySelector('.offer-draw') as HTMLButtonElement).addEventListener('click', this.offerDraw.bind(this));
    }

    saveGame() {
        this.messenger.socket.emit('saveGame', {clientId: this.id, name: this.name}, (error: string, message: string) => {
            if (error) {
                alert(error);
                location.reload();
                return;
            }
            alert(`Game saved at ${message}`);
            this.messenger.socket.emit('updateMyBoard', {name: this.name}, (error: string, layout: string[], playersTurn: string) => {
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
        this.messenger.socket.emit('endGame', {clientId: this.id, name: this.name}, (error: string) => {
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
        this.messenger.socket.emit('offerDraw',  {name: this.name, username: this.username }, (error: string) => {
            if (error) {
                alert(error);
                location.reload();
                return;
            }
        })
    }
}