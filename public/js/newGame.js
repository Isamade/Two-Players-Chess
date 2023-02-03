import { changeColor, updateBoard } from "./utility.js";
import { onBoard } from "./onBoard.js";

const socket = io();
let game, squares;

if (localStorage.getItem('previousGame')) {
    window.location.href = '/games/load-game';
}

document.querySelector('.footer').classList.add('hidden');
document.querySelector('.section-board').classList.add('hidden');

class newGame {
    constructor(name, color) {
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
        this.playersTurn = 'white';
        this.playersColor = color;
        this.board = [];
        this.hasKingCastled = false;
        this.page = 'newGame';
    }

    startGame(socket, squares) {
        //const table = document.querySelector('#grid');
        //table.innerHTML = '';
        const me = this;

        /*for (let y = 1; y < 9; y++){
            const row = document.createElement('tr');
            for (let x = 1; x < 9; x++){
                const cell = document.createElement('td');
                const position = (y - 1) * 8 + (x - 1);
                cell.dataset.hori = `${y}`;
                cell.dataset.vert = `${x}`;
                cell.dataset.pos = `${position}`;
                cell.classList.add('selectall');
                if((y === 1 || y === 8) && (x === 1 || x === 8)){
                    const rook = document.createElement('div');
                    //rook.textContent = 'R';
                    if(y === 1 && (x === 1 || x === 8)){
                        rook.innerHTML = '<img src=../images/Rwhite.png>'
                        rook.classList.add('RW');
                        rook.classList.add('white');
                        cell.appendChild(rook);
                    }
                    if(y === 8 && (x === 1 || x === 8)){
                        rook.innerHTML = '<img src=../images/Rblack.png>'
                        rook.classList.add('RB');
                        rook.classList.add('black');
                        cell.appendChild(rook);
                    }
                }
                if((y === 1 || y === 8) && (x === 2 || x === 7)){
                    const knight = document.createElement('div');
                    //knight.textContent = 'N';
                    if(y === 1 && (x === 2 || x === 7)){
                        knight.innerHTML = '<img src=../images/Nwhite.png>'
                        knight.classList.add('NW');
                        knight.classList.add('white');
                        cell.appendChild(knight);
                    }
                    if(y === 8 && (x === 2 || x === 7)){
                        knight.innerHTML = '<img src=../images/Nblack.png>'
                        knight.classList.add('NB');
                        knight.classList.add('black');
                        cell.appendChild(knight);
                    }
                }
                if((y === 1 || y === 8) && (x === 3 || x === 6)){
                    const bishop = document.createElement('div');
                    //bishop.textContent = 'B';
                    if(y === 1 && (x === 3 || x === 6)){
                        bishop.innerHTML = '<img src=../images/Bwhite.png>'
                        bishop.classList.add('BW');
                        bishop.classList.add('white');
                        cell.appendChild(bishop);
                    }
                    if(y === 8 && (x === 3 || x === 6)){
                        bishop.innerHTML = '<img src=../images/Bblack.png>'
                        bishop.classList.add('BB');
                        bishop.classList.add('black');
                        cell.appendChild(bishop);
                    }
                }
                if(y === 1 && x === 4){
                    const king = document.createElement('div');
                    king.classList.add('KW');
                    king.classList.add('white');
                    //king.textContent = 'K';
                    king.innerHTML = '<img src=../images/Kwhite.png>'
                    cell.appendChild(king);
                }
                if(y === 8 && x === 4){
                    const king = document.createElement('div');
                    king.classList.add('KB');
                    king.classList.add('black');
                    //king.textContent = 'K';
                    king.innerHTML = '<img src=../images/Kblack.png>'
                    cell.appendChild(king);
                }
                if(y === 1 && x === 5){
                    const queen = document.createElement('div');
                    queen.classList.add('QW');
                    queen.classList.add('white');
                    //queen.textContent = 'Q';
                    queen.innerHTML = '<img src=../images/Qwhite.png>'
                    cell.appendChild(queen);
                }
                if(y === 8 && x === 5){
                    const queen = document.createElement('div');
                    queen.classList.add('QB');
                    queen.classList.add('black');
                    //queen.textContent = 'Q';
                    queen.innerHTML = '<img src=../images/Qblack.png>'
                    cell.appendChild(queen);
                }
                if(y === 2 && (0 < x < 9)){
                    const pawn = document.createElement('div');
                    pawn.classList.add('PW');
                    pawn.classList.add('white');
                    //pawn.textContent = 'P';
                    pawn.innerHTML = '<img src=../images/Pwhite.png>'
                    cell.appendChild(pawn);
                }
                if(y === 7 && (0 < x < 9)){
                    const pawn = document.createElement('div');
                    pawn.classList.add('PB');
                    pawn.classList.add('black');
                    //pawn.textContent = 'P';
                    pawn.innerHTML = '<img src=../images/Pblack.png>'
                    cell.appendChild(pawn);
                }
                row.appendChild(cell);
            }
            table.appendChild(row);
        }*/

        //squares = document.querySelectorAll('.selectall');    
        //this.board = cloneBoard(squares);

        socket.emit('newGame', {name: this.name, username: this.username, playersColor: this.playersColor}, (error, id, board) => {    
            if (error) {
                alert(error);
                location.reload();
            }

            this.id = id;
            this.board = board;

            localStorage.setItem('previousGame', JSON.stringify({name:this.name, clientId: this.id}));

            updateBoard(board, squares, this, socket);

            //updatePageData(this);
            
            /*squares.forEach((square) => { 
                square.addEventListener('click', onBoard(squares, square, me, socket).click)
            });*/

            document.querySelectorAll('.swap-btn').forEach((button) => {
                button.addEventListener('click', onBoard(squares, this.targetSquare, me, socket, button).click)
            });
        });

    }
}


document.querySelector('.new-game').addEventListener('click', (event) => {
    event.preventDefault();
    document.querySelector('.footer').classList.remove('hidden');
    document.querySelector('.section-board').classList.remove('hidden');
    const name = document.querySelector('#title').value;
    const color = document.querySelector('#white').checked ? document.querySelector('#white').value : document.querySelector('#black').value;
    game = new newGame(name, color);
    game.startGame(socket, squares);
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
    window.location.href ='/pages/dashboard';
});

document.querySelector('.end-game').addEventListener('click', () => {
    socket.emit('endGame', { clientId: game.id, name: game.name }, (error) => {
        if (error) {
            alert(error);
            location.reload();
        }
        alert('Game has ended! You lost');
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


socket.on('joinedGame', (username) => {
    game.opponent = username;
    alert(`${username} has joined the game`);
    socket.emit('updateMyBoard', { name: game.name }, (error, board, playersTurn) => {
        if (error) {
            return alert(error);
        }
        game.board = board;
        game.playersTurn = playersTurn;
        updateBoard(board, squares, game, socket);
    });
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