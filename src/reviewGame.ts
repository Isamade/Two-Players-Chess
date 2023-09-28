import {Game} from './game.js';
import Helper from './helper.js';

if (localStorage.getItem('currentGame')) {
    window.location.href = '/games/load-game';
}

let games = JSON.parse(sessionStorage.getItem('currentGames') || 'null').concat(JSON.parse(sessionStorage.getItem('completedGames') || 'null')) || Helper.retrieveUserData('getGames');
Helper.showGames(games, 'review-mygame');

class ReviewGame extends Game {
    idx: number
    constructor(name: string) {
        super(name);
        this.page = 'reviewGame';
        this.idx = 0;

        this.startReview();

        (document.querySelector('.left') as HTMLButtonElement).addEventListener('click', this.moveLeft.bind(this));
        (document.querySelector('.right') as HTMLButtonElement).addEventListener('click', this.moveRight.bind(this));
        (document.querySelector('.exit-game') as HTMLDivElement).addEventListener('click', () => {
            window.location.href = '/pages/dashboard';
        });
    }

    startReview() {
        this.connectTools();
        this.messenger.socket.emit('reviewGame', {name: this.name}, this.cb.bind(this));
    }

    cb (error: string, playerOne: {username: string, playersColor: string}, playerTwo: {username: string, playersColor: string}, history: []) {
        if (error) {
            alert(error);
            location.reload();
            return;
        };

        this.username = playerOne.username;
        this.opponent = playerTwo.username;
        this.playerOneColor = playerOne.playersColor;
        this.playerTwoColor = playerTwo.playersColor;
        this.history = history;
        this.board.updateBoard('', this.history[this.idx], '');
        this.messenger.socket.on('connect', this.messenger.setBoard);
    }

    moveLeft() {
        if (this.idx > 0){
            this.idx = this.idx - 1;
            this.board.updateBoard('', this.history[this.idx], '');
        }
    }

    moveRight() {
        if (this.idx < (this.history.length-1)){
            this.idx = this.idx + 1;
            this.board.updateBoard('', this.history[this.idx], '');
        }
    }
}

(document.querySelector('.review-game') as HTMLButtonElement).addEventListener('click', (event) => {
    event.preventDefault();
    const name = (document.querySelector('#title') as HTMLInputElement).value;
    new ReviewGame(name);
    (document.querySelector('.game-form') as HTMLDivElement).classList.add('hidden');
    (document.querySelector('.section-games') as HTMLDivElement).classList.add('hidden');
    (document.querySelector('.footer') as HTMLDivElement).classList.remove('hidden');
    (document.querySelector('.section-board') as HTMLDivElement).classList.remove('hidden');
});
document.querySelectorAll('.review-mygame').forEach((item) => {
    item.addEventListener('click', () => {
        const position = (item as HTMLElement).dataset && (item as HTMLElement).dataset.position;
        position && new ReviewGame(games[+position].name);
        (document.querySelector('.game-form') as HTMLDivElement).classList.add('hidden');
        (document.querySelector('.section-games') as HTMLDivElement).classList.add('hidden');
        (document.querySelector('.footer') as HTMLDivElement).classList.remove('hidden');
        (document.querySelector('.section-board') as HTMLDivElement).classList.remove('hidden');
    })
});
//document.querySelector('.exit-game').addEventListener('click', ReviewGame.exitGame);