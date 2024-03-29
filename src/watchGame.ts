import {Game} from "./game.js";

if (localStorage.getItem('currentGame')) {
    window.location.href = '/games/load-game';
}

class WatchGame extends Game {

    constructor(name: string) {
        super(name);
        this.playerOneColor = '';
        this.playerTwoColor = '';
        this.page = 'watchGame';

        this.viewGame();

        (document.querySelector('.exit-game') as HTMLDivElement).addEventListener('click', () => {
            window.location.href = '/pages/dashboard';
        });
    }

    viewGame() {
        this.connectTools();
        this.messenger.socket.emit('watchGame', {name: this.name}, this.cb.bind(this));
    }

    cb (error: string, playerOne: {username: string, playersColor: string}, playerTwo: {username: string, playersColor: string}, layout: string[], playersTurn: string) {
        if (error) {
            alert(error);
            location.reload();
            return;
        };

        this.username = playerOne.username;
        this.opponent = playerTwo.username;
        this.playerOneColor = playerOne.playersColor;
        this.playerTwoColor = playerTwo.playersColor;
        this.board.updateBoard('', layout, playersTurn);
        this.messenger.socket.on('connect', this.messenger.setBoard);
    }

}

(document.querySelector('.watch-game') as HTMLButtonElement).addEventListener('click', (event) => {
    event.preventDefault();
    const name = (document.querySelector('#title') as HTMLInputElement).value;
    new WatchGame(name);
    (document.querySelector('.game-form') as HTMLDivElement).classList.add('hidden');
    (document.querySelector('.footer') as HTMLDivElement).classList.remove('hidden');
    (document.querySelector('.section-board') as HTMLDivElement).classList.remove('hidden');
});
//(document.querySelector('.exit-game')).addEventListener('click', WatchGame.exitGame);

