import {Game} from "./game.js";

if (localStorage.getItem('currentGame')) {
    window.location.href = '/games/load-game';
}

class WatchGame extends Game {
    constructor(name) {
        super(name);
        this.playerOneColor = '';
        this.playerTwoColor = '';
        this.page = 'watchGame';

        this.viewGame();

        document.querySelector('.exit-game').addEventListener('click', () => {
            window.location.href = '/pages/dashboard';
        });
    }

    viewGame() {
        this.connectTools();
        this.messenger.socket.emit('watchGame', {name: this.name}, this.cb.bind(this));
    }

    cb (error, playerOne, playerTwo, layout, playersTurn) {
        if (error) {
            alert(error);
            location.reload();
            return;
        };

        this.username = playerOne.username;
        this.opponent = playerTwo.username;
        this.playerOneColor = playerOne.playersColor;
        this.playerTwoColor = playerTwo.playersColor;
        this.board.updateBoard(null, layout, playersTurn);
        this.messenger.socket.on('connect', this.messenger.setBoard);
    }

}

document.querySelector('.watch-game').addEventListener('click', (event) => {
    event.preventDefault();
    const name = document.querySelector('#title').value;
    new WatchGame(name);
    document.querySelector('.game-form').classList.add('hidden');
    document.querySelector('.footer').classList.remove('hidden');
    document.querySelector('.section-board').classList.remove('hidden');
});
document.querySelector('.exit-game').addEventListener('click', WatchGame.exitGame);

