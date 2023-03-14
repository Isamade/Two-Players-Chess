export class Helper {
    static buildSquares(layout, board) {
        const table = document.querySelector('#grid');
        table.innerHTML = '';
        (board.game.playersColor === 'white')  && table.classList.add('rotate');
        for (let y = 1; y < 9; y++){
            const row = document.createElement('tr');
            for (let x = 1; x < 9; x++){
                const cell = document.createElement('td');
                const position = (y - 1) * 8 + (x - 1);
                cell.dataset.vert = `${y}`;
                cell.dataset.hori = `${x}`;
                cell.dataset.pos = `${position}`;
                cell.classList.add('selectall');
    
                let cellContent;
                const chessPiece = layout[position];
                if (chessPiece){
                    const pieceColor = this.findColor(chessPiece);
                    cellContent = document.createElement('div');
                    cellContent.innerHTML = `<img src=../images/${chessPiece.charAt(0) + pieceColor}.png draggable="true" id=drag${position}>`
                    cellContent.classList.add(chessPiece);
                    cellContent.classList.add(pieceColor);
                    cellContent.classList.add('cell-size');
                    cell.appendChild(cellContent);
                } 
                else {
                    cellContent = document.createElement('div');
                    cellContent.classList.add('cell-size');
                    cell.appendChild(cellContent);
                }
                (board.game.playersColor === 'white')  && cellContent.classList.add('rotate');
    
                row.appendChild(cell);
            }
            table.appendChild(row);
        }
    }
    
    static findKings (layout) {
        const kingsPositions = {
            white: null,
            black: null
        }
        layout.forEach((value, index) => {
            if (value === 'KW') {
                kingsPositions.white = index;
            }
            if (value === 'KB') {
                kingsPositions.black = index;
            }
        });
        return kingsPositions;
    }
    
    static changeColor(color) {
        return (color === 'white') ? 'black' : 'white';
    }
    
    static findColor(chessPiece) {
        return chessPiece.charAt(1) === 'W' ? 'white' : chessPiece.charAt(1) === 'B' ? 'black' : '';
    }
    
    static updatePosition(probeLayout, currentPosition, targetPosition) {
        const newLayout = probeLayout.slice();
        newLayout[targetPosition] = newLayout[currentPosition];
        newLayout[currentPosition] = '';
        return newLayout;
    }
    
    static diagonalMove(probeLayout, currentSquare, targetSquare) {
        let movePossible = false;
        if (Math.abs(currentSquare.xValue - targetSquare.xValue) === Math.abs(currentSquare.yValue - targetSquare.yValue)) {
            movePossible = true;
            if ((targetSquare.xValue < currentSquare.xValue) && (targetSquare.yValue < currentSquare.yValue)) {
                for (let pos = currentSquare.position - 9; pos > targetSquare.position; pos = pos - 9) {
                    movePossible = (probeLayout[pos] !== '') ? false : true;
                    if (!movePossible) { return false };
                }
            }
            else if ((targetSquare.xValue > currentSquare.xValue) && (targetSquare.yValue < currentSquare.yValue)) {
                for (let pos = currentSquare.position - 7; pos > targetSquare.position; pos = pos - 7) {
                    movePossible = (probeLayout[pos] !== '') ? false : true;
                    if (!movePossible) { return false }
                }
            }
            else if ((targetSquare.xValue < currentSquare.xValue) && (targetSquare.yValue > currentSquare.yValue)) {
                for (let pos = currentSquare.position + 7; pos < targetSquare.position; pos = pos + 7) {
                    movePossible = (probeLayout[pos] !== '') ? false : true;
                    if (!movePossible) { return false }
                }
            }
            else if ((targetSquare.xValue > currentSquare.xValue) && (targetSquare.yValue > currentSquare.yValue)) {
                for (let pos = currentSquare.position + 9; pos < targetSquare.position; pos = pos + 9) {
                    movePossible = (probeLayout[pos] !== '') ? false : true;
                    if (!movePossible) { return false }
                }
            }
        }
        return movePossible;
    }
    
    static linearMove(probeLayout, currentSquare, targetSquare) {
        let movePossible = false;
        if (currentSquare.xValue === targetSquare.xValue || currentSquare.yValue === targetSquare.yValue) {
            movePossible = true;
            if ((targetSquare.xValue === currentSquare.xValue) && (targetSquare.yValue < currentSquare.yValue)) {
                for (let pos = currentSquare.position - 8; pos > targetSquare.position; pos = pos - 8) {
                    movePossible = (probeLayout[pos] !== '') ? false : true;
                    if (!movePossible) { return false }
                }
            }
            else if ((targetSquare.xValue < currentSquare.xValue) && (targetSquare.yValue === currentSquare.yValue)) {
                for (let pos = currentSquare.position - 1; pos > targetSquare.position; pos = pos - 1) {
                    movePossible = (probeLayout[pos] !== '') ? false : true;
                    if (!movePossible) { return false }
                }
            }
            else if ((targetSquare.xValue > currentSquare.xValue) && (targetSquare.yValue === currentSquare.yValue)) {
                for (let pos = currentSquare.position + 1; pos < targetSquare.position; pos = pos + 1) {
                    movePossible = (probeLayout[pos] !== '') ? false : true;
                    if (!movePossible) { return false }
                }
            }
            else if ((targetSquare.xValue === currentSquare.xValue) && (targetSquare.yValue > currentSquare.yValue)) {
                for (let pos = currentSquare.position + 8; pos < targetSquare.position; pos = pos + 8) {
                    movePossible = (probeLayout[pos] !== '') ? false : true;
                    if (!movePossible) { return false }
                }
            }
        }
        return movePossible;
    }
    
    static showGames(games, task) {
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
    
    static updatePageData(game, playersTurn) {
        switch(game.page){
            case 'newGame':
            case 'joinGame':
            case 'continueGame':
                document.querySelector('.game-heading').textContent = game.name;
                document.querySelector('#opponent').textContent = game.opponent;
                document.querySelector('#playersColor').textContent = game.playersColor;
                document.querySelector('#playersTurn').textContent = playersTurn;
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

    static retrieveUserData = async(task) => {
        const res = await fetch('/auth');    
        const data = await res.json();    
        sessionStorage.setItem('username', data.user.username);
        sessionStorage.setItem('currentGames', JSON.stringify(data.user.currentGames));
        sessionStorage.setItem('completedGames', JSON.stringify(data.user.completedGames));
        switch(task){
            case 'getUsername':
                return data.user.username;
            case 'getCurrentGames':
                return data.user.currentGames;
            case 'getGames':
                return (data.user.currentGames + data.user.completedGames);
        }
    }

    static showDeadPieces = (layout) => {
        const pieceCount = {
            PW: 8,
            RW: 2,
            NW: 2,
            BW: 2,
            QW: 1,
            PB: 8,
            RB: 2,
            NB: 2,
            BB: 2,
            QB: 1
        }

        for (let idx = 0; idx < 64; idx++) {
            if (layout[idx]) pieceCount[layout[idx]]--;
        }

        const store = document.querySelectorAll('.piece-store');
        store[0].innerHTML = '';
        store[1].innerHTML = '';
        const appendDeadPieces = (piece) => {
            if (!pieceCount[piece]) {
                return;
            }
            else if (piece.charAt(1) === 'W' && piece.charAt(0) !== 'K') {
                const pieceImage = document.createElement('img');
                pieceImage.src =  `../images/${piece.charAt(0)}white.png`;
                pieceImage.classList.add('cell-size');
                store[0].appendChild(pieceImage);
            }
            else if (piece.charAt(1) === 'B' && piece.charAt(0) !== 'K') {
                const pieceImage = document.createElement('img');
                pieceImage.src =  `../images/${piece.charAt(0)}black.png`;
                pieceImage.classList.add('cell-size');
                store[1].appendChild(pieceImage);
            }
            pieceCount[piece]--;
            return appendDeadPieces(piece);
        }
        appendDeadPieces('PW');
        appendDeadPieces('RW');
        appendDeadPieces('NW');
        appendDeadPieces('BW');
        appendDeadPieces('QW');
        appendDeadPieces('PB');
        appendDeadPieces('RB');
        appendDeadPieces('NB');
        appendDeadPieces('BB');
        appendDeadPieces('QB');
    }
}

