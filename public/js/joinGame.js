import {PlayersGame} from "./game.js";

if (window.localStorage.getItem('currentGame')) {
    window.location.href = '/games/load-game';
}

export default class JoinGame extends PlayersGame {
    constructor(name) {
        super(name);
        this.page = 'joinGame';

        //this.playGame();
    }

    playGame() {
        this.connectTools();
        this.messenger.socket.emit('joinGame', {name: this.name, username: this.username}, this.cb.bind(this));
    }

    cb (error, id, opponent, playersColor, layout, playersTurn) {
        if (error) {
            window.alert(error);
            window.location.reload();
            return;
        };

        this.id = id;
        this.opponent = opponent;
        this.playersColor = playersColor;
        this.board.updateBoard(null, layout, playersTurn);
        window.localStorage.setItem('currentGame', JSON.stringify({name:this.name, clientId: this.id}));
        this.messenger.socket.on('connect', this.messenger.setBoard);
    }
}

document.querySelector('.join-game').addEventListener('click', (event) => {
    event.preventDefault();
    const name = document.querySelector('#title').value;
    (new JoinGame(name)).playGame();
    document.querySelector('.game-form').classList.add('hidden');
    document.querySelector('.footer').classList.remove('hidden');
    document.querySelector('.section-board').classList.remove('hidden');
});
document.querySelector('.exit-game').addEventListener('click', JoinGame.exitGame);