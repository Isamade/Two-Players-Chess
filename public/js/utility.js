import { onBoard } from "./onBoard.js";

export const updateBoard = (board, squares, me, socket) => {
    updatePageData(me);
    const table = document.querySelector('#grid');
    table.innerHTML = '';
    for (let y = 1; y < 9; y++){
        const row = document.createElement('tr');
        for (let x = 1; x < 9; x++){
            const cell = document.createElement('td');
            const position = (y - 1) * 8 + (x - 1);
            cell.dataset.hori = `${y}`;
            cell.dataset.vert = `${x}`;
            cell.dataset.pos = `${position}`;
            cell.classList.add('selectall');

            let chessPiece;
            if (board[position]){
                const pieceColor = findColor(board[position])
                chessPiece = document.createElement('div');
                //chessPiece.textContent = board[position].charAt(0);
                chessPiece.innerHTML = `<img src=../images/${board[position].charAt(0) + pieceColor}.png>`
                chessPiece.classList.add(board[position]);
                chessPiece.classList.add(pieceColor);
                cell.appendChild(chessPiece);
            }

            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    if(me.id){
        squares = document.querySelectorAll('.selectall');
        squares.forEach((square) => { 
            square.addEventListener('click', onBoard(squares, square, me, socket).click)
        });
    }
}

export const cloneBoard = (squares) => {
    const arr = [];
    squares.forEach(square => {
        arr.push(
            ((square.firstElementChild && square.firstElementChild.classList[0]) || '')
        )
    });
    return arr;
}

export const transferPiece = (squares, currentSquare, targetSquare) => {
    squares[targetSquare].firstElementChild && squares[targetSquare].removeChild(squares[targetSquare].firstElementChild);
    squares[targetSquare].appendChild(squares[currentSquare].firstElementChild);
    //squares[currentSquare].removeChild(squares[currentSquare]);
}

export const findKings = (board) => {
    const kingsPositions = {
        white: null,
        black: null
    }
    board.forEach((value, index) => {
        if (value === 'KW') {
            kingsPositions.white = index;
        }
        if (value === 'KB') {
            kingsPositions.black = index;
        }
    });
    return kingsPositions;
}

export const changeColor = (color) => {
    return (color === 'white') ? 'black' : 'white';
}

export const findColor = (chessPiece) => {
    return chessPiece.charAt(1) === 'W' ? 'white' : chessPiece.charAt(1) === 'B' ? 'black' : '';
}

export const updatePosition = (probeBoard, currentPosition, targetPosition) => {
    probeBoard[targetPosition] = probeBoard[currentPosition];
    probeBoard[currentPosition] = '';
}

export const diagonalMove = (probeBoard, currentSquare, targetSquare) => {
    let movePossible = false;
    if (Math.abs(currentSquare.xValue - targetSquare.xValue) === Math.abs(currentSquare.yValue - targetSquare.yValue)) {
        movePossible = true;
        if ((targetSquare.xValue < currentSquare.xValue) && (targetSquare.yValue < currentSquare.yValue)) {
            for (let pos = currentSquare.position - 9; pos > targetSquare.position; pos = pos - 9) {
                movePossible = (probeBoard[pos] !== '') ? false : true;
                if (!movePossible) { return false };
            }
        }
        else if ((targetSquare.xValue > currentSquare.xValue) && (targetSquare.yValue < currentSquare.yValue)) {
            for (let pos = currentSquare.position - 7; pos > targetSquare.position; pos = pos - 7) {
                movePossible = (probeBoard[pos] !== '') ? false : true;
                if (!movePossible) { return false }
            }
        }
        else if ((targetSquare.xValue < currentSquare.xValue) && (targetSquare.yValue > currentSquare.yValue)) {
            for (let pos = currentSquare.position + 7; pos < targetSquare.position; pos = pos + 7) {
                movePossible = (probeBoard[pos] !== '') ? false : true;
                if (!movePossible) { return false }
            }
        }
        else if ((targetSquare.xValue > currentSquare.xValue) && (targetSquare.yValue > currentSquare.yValue)) {
            for (let pos = currentSquare.position + 9; pos < targetSquare.position; pos = pos + 9) {
                movePossible = (probeBoard[pos] !== '') ? false : true;
                if (!movePossible) { return false }
            }
        }
    }
    return movePossible;
}

export const linearMove = (probeBoard, currentSquare, targetSquare) => {
    let movePossible = false;
    if (currentSquare.xValue === targetSquare.xValue || currentSquare.yValue === targetSquare.yValue) {
        movePossible = true;
        if ((targetSquare.xValue === currentSquare.xValue) && (targetSquare.yValue < currentSquare.yValue)) {
            for (let pos = currentSquare.position - 8; pos > targetSquare.position; pos = pos - 8) {
                movePossible = (probeBoard[pos] !== '') ? false : true;
                if (!movePossible) { return false }
            }
        }
        else if ((targetSquare.xValue < currentSquare.xValue) && (targetSquare.yValue === currentSquare.yValue)) {
            for (let pos = currentSquare.position - 1; pos > targetSquare.position; pos = pos - 1) {
                movePossible = (probeBoard[pos] !== '') ? false : true;
                if (!movePossible) { return false }
            }
        }
        else if ((targetSquare.xValue > currentSquare.xValue) && (targetSquare.yValue === currentSquare.yValue)) {
            for (let pos = currentSquare.position + 1; pos < targetSquare.position; pos = pos + 1) {
                movePossible = (probeBoard[pos] !== '') ? false : true;
                if (!movePossible) { return false }
            }
        }
        else if ((targetSquare.xValue === currentSquare.xValue) && (targetSquare.yValue > currentSquare.yValue)) {
            for (let pos = currentSquare.position + 8; pos < targetSquare.position; pos = pos + 8) {
                movePossible = (probeBoard[pos] !== '') ? false : true;
                if (!movePossible) { return false }
            }
        }
    }
    return movePossible;
}

export const showGames = (games, task) => {
    document.querySelector('.footer').classList.add('hidden');
    document.querySelector('.section-board').classList.add('hidden');
    const gamesContainer = document.querySelector('.section-games');  
    games.forEach((game, idx) => {
      const gameItem = document.createElement('div');
      gameItem.classList.add('row');
      gameItem.classList.add(task);
      gameItem.dataset.position = idx.toString();
      gameItem.innerHTML = `
        <div class="story">
            <div class="story__text">
                <h3 class="heading-tertiary2 u-margin-bottom-small">${game.name}</h3>
            </div>
            <div class="form__group">
                <button class="btn btn--green">Continue &rarr;</button>
                <i class="feature-box__icon icon-basic-bookmark float-right"></i>
            </div>
        </div>
      `;
  
      gamesContainer.appendChild(gameItem);
    });
}

export const showMenu = () => {
    document.querySelector('.footer').classList.add('hidden');
    document.querySelector('.section-board').classList.add('hidden');
}

export const retrieveUserData = async(task) => {
    const res = await fetch('/auth');    
    const data = await res.json();    
    sessionStorage.setItem('username', data.user.username);
    sessionStorage.setItem('currentGames', JSON.stringify(data.user.currentGames));
    sessionStorage.setItem('completedGames', JSON.stringify(data.user.completedGames));
    if (task === 'getUsername'){
        return data.user.username;
    }
    else if (task === 'getCurrentGames'){
        return data.user.currentGames;
    }
    else if (task === 'getGames'){
        return (data.user.currentGames + data.user.completedGames);
    }
}

export const updatePageData = (game) => {
    switch(game.page){
        case 'newGame':
        case 'joinGame':
        case 'continueGame':
            document.querySelector('.game-heading').textContent = game.name;
            document.querySelector('#opponent').textContent = game.opponent;
            document.querySelector('#playersColor').textContent = game.playersColor;
            document.querySelector('#playersTurn').textContent = game.playersTurn;
            break;
        case 'watchGame':
        case 'reviewGame':
            document.querySelector('.game-heading').textContent = game.name;
            document.querySelector('#playerOne').textContent = game.username;
            document.querySelector('#playerOneColor').textContent = game.playerOneColor;
            document.querySelector('#playerTwo').textContent = game.opponent;
            document.querySelector('#playerTwoColor').textContent = game.playerTwoColor;
            break;
    }
}