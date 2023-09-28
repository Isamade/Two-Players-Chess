import {PlayersGame} from "./game.js";

if (window.localStorage.getItem('currentGame')) {
    window.location.href = '/games/load-game';
}

export default class JoinGame extends PlayersGame {
    constructor(name: string) {
        super(name);
        this.page = 'joinGame';

        //this.playGame();
    }

    playGame() {
        this.connectTools();
        this.messenger.socket.emit('joinGame', {name: this.name, username: this.username}, this.cb.bind(this));
    }

    cb (error: string, id: string, opponent: string, playersColor: string, layout: string[], playersTurn: string) {
        if (error) {
            window.alert(error);
            window.location.reload();
            return;
        };

        this.id = id;
        this.opponent = opponent;
        this.playersColor = playersColor;
        this.board.updateBoard('', layout, playersTurn);
        window.localStorage.setItem('currentGame', JSON.stringify({name:this.name, clientId: this.id}));
        this.messenger.socket.on('connect', this.messenger.setBoard);
    }
}

(document.querySelector('.join-game') as HTMLButtonElement).addEventListener('click', (event) => {
    event.preventDefault();
    const name = (document.querySelector('#title') as HTMLInputElement).value;
    (new JoinGame(name)).playGame();
    (document.querySelector('.game-form') as HTMLDivElement).classList.add('hidden');
    (document.querySelector('.footer') as HTMLDivElement).classList.remove('hidden');
    (document.querySelector('.section-board') as HTMLDivElement).classList.remove('hidden');
});
(document.querySelector('.exit-game') as HTMLDivElement).addEventListener('click', JoinGame.exitGame);