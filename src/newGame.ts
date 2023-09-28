import {PlayersGame} from "./game.js";

if (window.localStorage.getItem('currentGame')) {
    window.location.href = '/games/load-game';
}
//console.log('print this', global.fineGirl);
//console.log('print this 2', fineGirl);

export default class NewGame extends PlayersGame {
    constructor(name: string, color: string) {
        super(name);
        this.playersColor = color;
        this.page = 'newGame';

        //this.startGame();
    }

    startGame() {
        this.connectTools();
        this.messenger.socket.emit('newGame', {name: this.name, username: this.username, playersColor: this.playersColor}, this.cb.bind(this));
    }

    cb (error: string, id: string, layout: string[]) {
        if (error) {
            window.alert(error);
            window.location.reload();
            return;
        }
        this.id = id;
        this.board.updateBoard('', layout, 'white');
        window.localStorage.setItem('currentGame', JSON.stringify({name:this.name, clientId: this.id}));
        this.messenger.socket.on('connect', this.messenger.setBoard);
    }
}

(document.querySelector('.new-game') as HTMLButtonElement).addEventListener('click', (event) => {
    event.preventDefault();
    const name = (document.querySelector('#title') as HTMLInputElement).value;
    const color = (document.querySelector('#white') as HTMLInputElement).checked ? (document.querySelector('#white') as HTMLInputElement).value : (document.querySelector('#black') as HTMLInputElement).value;
    //new NewGame(name, color);
    (new NewGame(name, color)).startGame();
    (document.querySelector('.game-form') as HTMLDivElement).classList.add('hidden');
    (document.querySelector('.footer') as HTMLDivElement).classList.remove('hidden');
    (document.querySelector('.section-board') as HTMLDivElement).classList.remove('hidden');
});
(document.querySelector('.exit-game') as HTMLDivElement).addEventListener('click', NewGame.exitGame);