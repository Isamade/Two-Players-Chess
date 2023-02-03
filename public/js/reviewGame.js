import { updateBoard, showGames } from "./utility.js";

const socket = io();
let game, squares;

if (localStorage.getItem('previousGame')) {
    window.location.href = '/games/load-game';
}

//let games = JSON.parse(sessionStorage.getItem('currentGames')) + JSON.parse(sessionStorage.getItem('completedGames'));
let games = JSON.parse(sessionStorage.getItem('currentGames')).concat(JSON.parse(sessionStorage.getItem('completedGames')));
if (!games) {
    games = retrieveUserData('getGames');
}

showGames(games, 'review-mygame');

class reviewGame {
    constructor(name) {
        this.idx = 0;
        this.name = name;
        this.username = '';
        this.opponent = '';
        this.board = [];
        this.history = [];
        this.playerOneColor = '';
        this.playerTwoColor = '';
        this.page = 'reviewGame';
    }

    startReview(socket, squares){

        socket.emit('reviewGame', {name: this.name}, (error, playerOne, playerTwo, history) => {  
            if (error) {
                alert(error);
                location.reload();
            };

            this.username = playerOne.username;
            this.opponent = playerTwo.username;
            this.playerOneColor = playerOne.playersColor;
            this.playerTwoColor = playerTwo.playersColor;
            this.history = history;

            updateBoard(this.history[0], squares, this, socket);
            document.querySelector('.left').addEventListener('click', () => {
                if (this.idx > 0){
                    this.idx = this.idx - 1;
                    updateBoard(this.history[this.idx], squares, this, socket);
                }
            });
            document.querySelector('.right').addEventListener('click', () => {
                if (this.idx < (this.history.length-1)){
                    this.idx = this.idx + 1;
                    updateBoard(this.history[this.idx], squares, this, socket);
                }
            });
        });

    }
}


document.querySelector('.review-game').addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('.footer').classList.remove('hidden');
    document.querySelector('.section-board').classList.remove('hidden');
    const name = document.querySelector('#title').value;
    game = new reviewGame(name);
    game.startReview(socket, squares);
    document.querySelector('.game-form').classList.add('hidden');
    document.querySelector('.section-games').classList.add('hidden');
});

document.querySelectorAll('.review-mygame').forEach((item) => {
    item.addEventListener('click', () => {
        document.querySelector('.footer').classList.remove('hidden');
        document.querySelector('.section-board').classList.remove('hidden')
        const position = +item.dataset.position;
        game = new reviewGame(games[position].name);
        game.startReview(socket, squares);
        document.querySelector('.game-form').classList.add('hidden');
        document.querySelector('.section-games').classList.add('hidden');
    })
});

document.querySelector('.exit-game').addEventListener('click', () => {
    window.location.href = '/pages/dashboard';
});