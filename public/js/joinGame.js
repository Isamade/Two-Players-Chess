import { changeColor, updateBoard } from "./utility.js";
import { onBoard } from "./onBoard.js";

const socket = io();
let game, squares;

if (localStorage.getItem('previousGame')) {
    window.location.href = '/games/load-game';
}

document.querySelector('.footer').classList.add('hidden');
document.querySelector('.section-board').classList.add('hidden');

class joinGame {
    constructor(name) {
        this.id = '';
        this.name = name;
        this.username = sessionStorage.getItem('username');
        this.opponent = '';
        this.selectedPiece = {
            name: '',
            color: '',
            xValue: '',
            yValue: '',
            position: ''
        };
        this.targetSquare = {};
        this.pieceDataStore = {};
        this.playersTurn = '';
        this.playersColor = '';
        this.board = [];
        this.hasKingCastled = false;
        this.page = 'joinGame';
    }

    playGame(socket, squares){
        const me = this;

        socket.emit('joinGame', {name: this.name, username: this.username}, (error, id, opponent, playersColor, board, playersTurn) => {  
            if (error) {
                alert(error);
                location.reload();
            };

            this.id = id;
            this.opponent = opponent;
            this.playersColor = playersColor;
            this.board = board;
            this.playersTurn = playersTurn;

            localStorage.setItem('previousGame', JSON.stringify({name:this.name, clientId: this.id}));

            updateBoard(board, squares, this, socket);

            document.querySelectorAll('.swap-btn').forEach((button) => {
                button.addEventListener('click', onBoard(squares, this.targetSquare, me, socket, button).click)
            });
        });

    }
}


document.querySelector('.join-game').addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('.footer').classList.remove('hidden');
    document.querySelector('.section-board').classList.remove('hidden');
    const name = document.querySelector('#title').value;
    game = new joinGame(name);
    game.playGame(socket, squares);
    document.querySelector('.game-form').classList.add('hidden');
});

document.querySelector('.save-game').addEventListener('click', () => {
    socket.emit('saveGame', { clientId: game.id, name: game.name}, (error, message) => {
        if (error) {
            console.log(error)
        }
        alert(`Game saved at ${message}`);
        socket.emit('updateMyBoard', { name: game.name }, (error, board, playersTurn) => {
            if (error) {
                return alert(error);
            }
            game.board = board;
            game.playersTurn = playersTurn;
            updateBoard(board, squares, game, socket);
        });
    })
});

document.querySelector('.exit-game').addEventListener('click', () => {
    if (game) {
        socket.emit('exitGame', { clientId: game.id, name: game.name, username: game.username });
        localStorage.removeItem('previousGame');
    }
    window.location.href = '/pages/dashboard';
});

document.querySelector('.end-game').addEventListener('click', () => {
    socket.emit('endGame', { clientId: game.id, name: game.name }, (error) => {
        if (error) {
            alert(error);
            location.reload();
        }
        alert('Game has ended! You lost')
    })
});

document.querySelector('.offer-draw').addEventListener('click', () => {
    socket.emit('offerDraw', { name: game.name, username: game.username }, (error) => {
        if (error) {
            alert(error);
            location.reload();
        }
    })
});

socket.on('savedGame', (message) => {
    alert(`Game saved at ${message}`);
    socket.emit('updateMyBoard', { name: game.name }, (error, board, playersTurn) => {
        if (error) {
            return alert(error);
        }
        game.board = board;
        game.playersTurn = playersTurn;
        updateBoard(board, squares, game, socket);
    });
});

socket.on('exitedGame', (username) => {
    alert(`${username} has exited the game`);
    localStorage.removeItem('previousGame');
    setTimeout(()=>{
        document.location.href = '/pages/dashboard';
    }, 5000);
});

socket.on('endedGame', (username) => {
    alert(`Game has ended! ${username} lost`);
});

socket.on('offeredDraw', (username) => {
    const answer = confirm(`${username} wants to end the game in draw`);
    if (answer) {
        socket.emit('acceptDraw', { clientId: game.id, name: game.name }, (error) => {
            if (error) {
                alert(error);
                location.reload();
            }
            alert('Game has ended in a draw');
        })
    }
    else if (!answer) {
        socket.emit('refuseDraw', { name: game.name, username: game.username }, (error, board, playersTurn) => {
            if (error) {
                alert(error);
                location.reload();
            }
            game.board = board;
            game.playersTurn = playersTurn;
            updateBoard(board, squares, game, socket);
        })
    }
});

socket.on('acceptedDraw', () => {
    alert('Game has ended in a draw');
});

socket.on('refusedDraw', (username) => {
    alert(`${username} wants to continue game`);
    socket.emit('updateMyBoard', { name: game.name }, (error, board, playersTurn) => {
        if (error) {
            return alert(error);
        }
        game.board = board;
        game.playersTurn = playersTurn;
        updateBoard(board, squares, game, socket);
    });
})

socket.on('movedPiece', ({board, checkType}) => {
    game.board = board;
    game.playersTurn = changeColor(game.playersTurn);
    updateBoard(board, squares, game, socket);
    if (checkType) {
        alert(checkType);
    }
});

socket.on('connect', () => {
    if (game && game.playersColor) {
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