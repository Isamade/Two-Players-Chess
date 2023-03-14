import {Game} from './game.js';
import {Helper} from './helper.js';

if (localStorage.getItem('currentGame')) {
    window.location.href = '/games/load-game';
}

let games = JSON.parse(sessionStorage.getItem('currentGames')).concat(JSON.parse(sessionStorage.getItem('completedGames'))) || retrieveUserData('getGames');
Helper.showGames(games, 'review-mygame');

class ReviewGame extends Game {
    constructor(name) {
        super(name);
        this.playerOneColor = '';
        this.playerTwoColor = '';
        this.page = 'reviewGame';
        this.idx = 0;

        this.startReview();

        document.querySelector('.left').addEventListener('click', this.moveLeft.bind(this));
        document.querySelector('.right').addEventListener('click', this.moveRight.bind(this));
        document.querySelector('.exit-game').addEventListener('click', () => {
            window.location.href = '/pages/dashboard';
        });
    }

    startReview() {
        this.connectTools();
        this.messenger.socket.emit('reviewGame', {name: this.name}, this.cb.bind(this));
    }

    cb (error, playerOne, playerTwo, history) {
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
        this.board.updateBoard(null, this.history[this.idx], '');
        this.messenger.socket.on('connect', this.messenger.setBoard);
    }

    moveLeft() {
        if (this.idx > 0){
            this.idx = this.idx - 1;
            this.board.updateBoard(null, this.history[this.idx], '');
        }
    }

    moveRight() {
        if (this.idx < (this.history.length-1)){
            this.idx = this.idx + 1;
            this.board.updateBoard(null, this.history[this.idx], '');
        }
    }
}

document.querySelector('.review-game').addEventListener('click', (event) => {
    event.preventDefault();
    const name = document.querySelector('#title').value;
    new ReviewGame(name);
    document.querySelector('.game-form').classList.add('hidden');
    document.querySelector('.section-games').classList.add('hidden');
    document.querySelector('.footer').classList.remove('hidden');
    document.querySelector('.section-board').classList.remove('hidden');
});
document.querySelectorAll('.review-mygame').forEach((item) => {
    item.addEventListener('click', () => {
        const position = +item.dataset.position;
        new ReviewGame(games[position].name);
        document.querySelector('.game-form').classList.add('hidden');
        document.querySelector('.section-games').classList.add('hidden');
        document.querySelector('.footer').classList.remove('hidden');
        document.querySelector('.section-board').classList.remove('hidden');
    })
});
document.querySelector('.exit-game').addEventListener('click', ReviewGame.exitGame);