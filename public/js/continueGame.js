import {PlayersGame} from "./game.js";
import {Helper} from './helper.js';

if (localStorage.getItem('currentGame')) {
    window.location.href = '/games/load-game';
}

const games = JSON.parse(sessionStorage.getItem('currentGames')) || retrieveUserData('getCurrentGames');
Helper.showGames(games, 'continue-game');

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
            location.reload();
            return;
        };

        this.opponent = opponent;
        this.playersColor = playersColor;
        this.board.canKingCastleLeft = canKingCastleLeft;
        this.board.canKingCastleRight = canKingCastleRight;
        this.board.updateBoard(null, layout, playersTurn);
        localStorage.setItem('currentGame', JSON.stringify({name:this.name, clientId: this.id}));
        this.messenger.socket.on('connect', this.messenger.setBoard);
    }
}

document.querySelectorAll('.continue-game').forEach((item) => {
    item.addEventListener('click', () => {
        const position = +item.dataset.position;
        new ContinueGame(games[position].name, games[position].clientId);
        document.querySelector('.section-games').classList.add('hidden');
        document.querySelector('.footer').classList.remove('hidden');
        document.querySelector('.section-board').classList.remove('hidden');
    })
});
document.querySelector('.exit-game').addEventListener('click', ContinueGame.exitGame);