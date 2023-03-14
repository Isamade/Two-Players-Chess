import {PlayersGame} from "./game.js";

if (window.localStorage.getItem('currentGame')) {
    window.location.href = '/games/load-game';
}
console.log('print this', global.fineGirl);
console.log('print this 2', fineGirl);

export default class NewGame extends PlayersGame {
    constructor(name, color) {
        super(name);
        this.playersColor = color;
        this.page = 'newGame';

        //this.startGame();
    }

    startGame() {
        this.connectTools();
        this.messenger.socket.emit('newGame', {name: this.name, username: this.username, playersColor: this.playersColor}, this.cb.bind(this));
    }

    cb (error, id, layout) {
        if (error) {
            window.alert(error);
            window.location.reload();
            return;
        }
        this.id = id;
        this.board.updateBoard(null, layout, 'white');
        window.localStorage.setItem('currentGame', JSON.stringify({name:this.name, clientId: this.id}));
        this.messenger.socket.on('connect', this.messenger.setBoard);
    }
}

document.querySelector('.new-game').addEventListener('click', (event) => {
    event.preventDefault();
    const name = document.querySelector('#title').value;
    const color = document.querySelector('#white').checked ? document.querySelector('#white').value : document.querySelector('#black').value;
    //new NewGame(name, color);
    (new NewGame(name, color)).startGame();
    document.querySelector('.game-form').classList.add('hidden');
    document.querySelector('.footer').classList.remove('hidden');
    document.querySelector('.section-board').classList.remove('hidden');
});
document.querySelector('.exit-game').addEventListener('click', NewGame.exitGame);