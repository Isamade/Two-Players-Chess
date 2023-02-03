const uuid = require('uuid');
const Game = require('../models/Game');
const { addUserGame } = require('./userController');

exports.createTournamentGame = async(match, tournament) => {
    //const board = [];
    let name;
    provideGameName();
    async function provideGameName (idx=1) {
        name = match.playerOne + ' vs ' + match.playerTwo + ' ' + idx.toString();
        let previousGame = await Game.findOne({name});
        if (previousGame) {
            return provideGameName(idx+1);
        }
        const playerOne = {
            clientId: uuid.v4(),
            username: match.playerOne,
            playersColor: 'white',
            hasKingCastled: false
        }
        const playerTwo = {
            clientId: uuid.v4(),
            username: match.playerTwo,
            playersColor: 'black',
            hasKingCastled: false
        }
        let game = new Game({name, playerOne, playerTwo, tournament});
        game.save();
        // update users' currentGames
        addUserGame(playerOne.clientId, name, playerOne.username);
        addUserGame(playerTwo.clientId, name, playerTwo.username);
    }
    return {
        name,
        playerOne: match.playerOne,
        playerTwo: match.playerTwo
    }
}

exports.createNewGame = async (clientId, name, username, playersColor, updateBoard) => {
    try {
        const playerOne = { clientId, username, playersColor, hasKingCastled: false }
        let newGame = await Game.findOne({ name });
        if (newGame) {
            return false;
        }
        newGame = new Game({ name, playerOne });
        updateBoard(newGame.board);
        await newGame.save();
        return true;
    }
    catch {
        return false;
    }
}

exports.joinCreatedGame = async (clientId, name, username) => {
    try {
        const joinGame = await Game.findOne({ name });
        if (!joinGame) {
            return false;
        }
        if (joinGame.playerTwo.username) {
            return false;
        }
        joinGame.playerTwo.clientId = clientId;
        joinGame.playerTwo.username = username;
        joinGame.playerTwo.playersColor = (joinGame.playerOne.playersColor === 'white') ? 'black' : 'white';
        await Game.findOneAndUpdate({ name }, joinGame)
        return true;
    }
    catch {
        return false;
    }
}

exports.updateGame = async(name, game) => {
    try {
        await Game.findOneAndUpdate({ name }, game);
        /*let updateGame = await Game.findOne({ name });
        if (updateGame) {
            return false;
        }
        updateGame.board = game.board;
        updateGame.history = game.history;
        updateGame.playersTurn = game.playersTurn;
        updateGame.playerOne = game.playerOne;
        updateGame.playerTwo = game.playerTwo;*/
        return true;
    }
    catch {
        return false;
    }
}

exports.deleteGame = async(name) => {
    try {
        await Game.deleteOne({name});
        return true;
    }
    catch {
        return false;
    }
}

