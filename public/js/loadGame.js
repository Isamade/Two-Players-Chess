import { PlayersGame } from "./game.js";

const currentGame = JSON.parse(localStorage.getItem('currentGame'));

class ContinueGame extends PlayersGame {
    constructor(name, id) {
        super(name);
        this.id = id;
        this.page = 'continueGame';

        this.resumeGame();
    }

    resumeGame() {
        this.connectTools();
        this.messenger.socket.emit('continueGame', {name: this.name, clientId: this.id}, this.cb.bind(this));
    }

    cb (error, opponent, playersColor, layout, playersTurn, canKingCastleLeft, canKingCastleRight) {
        if (error) {
            alert(error);
            localStorage.removeItem('currentGame');
            window.location.href = '/pages/dashboard';
            return;
        };
        this.opponent = opponent;
        this.playersColor = playersColor;
        this.board.canKingCastleLeft = canKingCastleLeft;
        this.board.canKingCastleRight = canKingCastleRight;
        this.board.updateBoard(null, layout, playersTurn);
        this.messenger.socket.on('connect', this.messenger.setBoard);
    }
}

if (!currentGame) {
    window.location.href = '/pages/dashboard';
} else {
    new ContinueGame(currentGame.name, currentGame.clientId);
}
document.querySelector('.exit-game').addEventListener('click', ContinueGame.exitGame);