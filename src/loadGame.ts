import { PlayersGame } from "./game.js";

const currentGame = JSON.parse(localStorage.getItem('currentGame') || 'null');

class ContinueGame extends PlayersGame {
    constructor(name: string, id: string) {
        super(name);
        this.id = id;
        this.page = 'continueGame';

        this.resumeGame();
    }

    resumeGame() {
        this.connectTools();
        this.messenger.socket.emit('continueGame', {name: this.name, clientId: this.id}, this.cb.bind(this));
    }

    cb (error: string, opponent: string, playersColor: string, layout: string[], playersTurn: string, canKingCastleLeft: boolean, canKingCastleRight: boolean) {
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
        this.board.updateBoard('', layout, playersTurn);
        this.messenger.socket.on('connect', this.messenger.setBoard);
    }
}

if (!currentGame) {
    window.location.href = '/pages/dashboard';
} 
else {
    new ContinueGame(currentGame.name, currentGame.clientId);
}
(document.querySelector('.exit-game') as HTMLDivElement).addEventListener('click', ContinueGame.exitGame);