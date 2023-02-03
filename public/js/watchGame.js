import { changeColor, updateBoard } from "./utility.js";

const socket = io();
let game, squares;

if (localStorage.getItem('previousGame')) {
    window.location.href = '/games/load-game';
}

document.querySelector('.footer').classList.add('hidden');
document.querySelector('.section-board').classList.add('hidden');

class watchGame {
    constructor(name) {
        this.name = name;
        this.username = '';
        this.opponent = '';
        this.playersTurn = '';
        this.board = [];
        this.hasKingCastled = false;
        this.playerOneColor = '';
        this.playerTwoColor = '';
        this.page = 'watchGame';
    }

    viewGame(socket, squares){

        socket.emit('watchGame', {name: this.name}, (error, playerOne, playerTwo, board, playersTurn) => {  
            if (error) {
                alert(error);
                location.reload();
            };

            this.username = playerOne.username;
            this.opponent = playerTwo.username;
            this.playerOneColor = playerOne.playersColor;
            this.playerTwoColor = playerTwo.playersColor;
            this.board = board;
            this.playersTurn = playersTurn;

            updateBoard(board, squares, this, socket);
        });
    }
}


document.querySelector('.watch-game').addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('.footer').classList.remove('hidden');
    document.querySelector('.section-board').classList.remove('hidden');
    const name = document.querySelector('#title').value;
    game = new watchGame(name);
    game.viewGame(socket, squares);
    document.querySelector('.game-form').classList.add('hidden');
});

document.querySelector('.exit-game').addEventListener('click', () => {
    window.location.href = '/pages/dashboard';
});

socket.on('joinedGame', (username) => {
    game.opponent = username;
    alert(`${username} has joined game`);
});

socket.on('exitedGame', (username) => {
    alert(`${username} has exited the game`);
    setTimeout(()=>{
        document.location.href = '/pages/dashboard';
    }, 5000);
});

socket.on('endedGame', (username) => {
    alert(`Game has ended! ${username} lost`);
});

socket.on('acceptedDraw', () => {
    alert('Game has ended in a draw');
});

socket.on('movedPiece', ({board, checkType}) => {
    game.board = board;
    game.playersTurn = changeColor(game.playersTurn);
    updateBoard(board, squares, game, socket);
    if (checkType === 'Checkmate') {
        alert(checkType);
    }
});

socket.on('connect', () => {
    if (game && game.playerOneColor) {
        socket.emit('updateMyBoard', { name: game.name }, (error, board, playersTurn) => {
            if (error) {
                return alert(error);
            }
            game.board = board;
            game.playersTurn = playersTurn;
            updateBoard(board, squares, game, socket);
        });
    };
});