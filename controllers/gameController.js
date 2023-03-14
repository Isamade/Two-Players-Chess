import { v4 } from 'uuid';
import Game from '../models/Game.js';
import UserController from './userController.js';


export default class GameController {
    static createTournamentGame = async (match, tournament) => {
        //const layout = [];
        let name;
        provideGameName();
        async function provideGameName (idx=1) {
            name = match.playerOne + ' vs ' + match.playerTwo + ' ' + idx.toString();
            let previousGame = await Game.findOne({name});
            if (previousGame) {
                return provideGameName(idx+1);
            }
            const playerOne = {
                clientId: v4(),
                username: match.playerOne,
                playersColor: 'white',
                canKingCastleLeft: true,
                canKingCastleRight: true
            }
            const playerTwo = {
                clientId: v4(),
                username: match.playerTwo,
                playersColor: 'black',
                canKingCastleLeft: true,
                canKingCastleRight: true
            }
            let game = new Game({name, playerOne, playerTwo, tournament});
            game.save();
            // update users' currentGames
            UserController.addUserGame(playerOne.clientId, name, playerOne.username);
            UserController.addUserGame(playerTwo.clientId, name, playerTwo.username);
        }
        return {
            name,
            playerOne: match.playerOne,
            playerTwo: match.playerTwo
        }
    }

    static createNewGame = async (clientId, name, username, playersColor, updateLayout) => {
        try {
            const playerOne = { clientId, username, playersColor, canKingCastleLeft: true, canKingCastleRight: true }
            let newGame = await Game.findOne({ name });
            if (newGame) {
                return false;
            }
            newGame = new Game({ name, playerOne });
            updateLayout(newGame.layout);
            await newGame.save();
            return true;
        }
        catch {
            return false;
        }
    }

    static joinCreatedGame = async (clientId, name, username) => {
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

    static updateGame = async (name, game) => {
        try {
            await Game.findOneAndUpdate({ name }, game);
            return true;
        }
        catch {
            return false;
        }
    }

    static deleteGame = async (name) => {
        try {
            await Game.deleteOne({name});
            return true;
        }
        catch {
            return false;
        }
    }
}



/*export async function createTournamentGame(match, tournament) {
    //const layout = [];
    let name;
    provideGameName();
    async function provideGameName (idx=1) {
        name = match.playerOne + ' vs ' + match.playerTwo + ' ' + idx.toString();
        let previousGame = await Game.findOne({name});
        if (previousGame) {
            return provideGameName(idx+1);
        }
        const playerOne = {
            clientId: v4(),
            username: match.playerOne,
            playersColor: 'white',
            canKingCastleLeft: true,
            canKingCastleRight: true
        }
        const playerTwo = {
            clientId: v4(),
            username: match.playerTwo,
            playersColor: 'black',
            canKingCastleLeft: true,
            canKingCastleRight: true
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

export async function createNewGame(clientId, name, username, playersColor, updateBoard) {
    try {
        const playerOne = { clientId, username, playersColor, canKingCastleLeft: true, canKingCastleRight: true }
        let newGame = await Game.findOne({ name });
        if (newGame) {
            return false;
        }
        newGame = new Game({ name, playerOne });
        updateBoard(newGame.layout);
        await newGame.save();
        return true;
    }
    catch {
        return false;
    }
}

export async function joinCreatedGame(clientId, name, username) {
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

export async function updateGame(name, game) {
    try {
        await Game.findOneAndUpdate({ name }, game);
        return true;
    }
    catch {
        return false;
    }
}

export async function deleteGame(name) {
    try {
        await Game.deleteOne({name});
        return true;
    }
    catch {
        return false;
    }
}*/

