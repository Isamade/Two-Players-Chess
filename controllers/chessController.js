import moment from 'moment';
import Redis from '../config/redis.js';
import { eventEmitter } from '../config/postgres.js';
import Game from '../models/Game.js';
import GameController from './gameController.js';
import UserController from './userController.js';
import TournamentController from './tournamentController.js';

const newGame = async({clientId, name, username, playersColor}) => {
    // Validate the data
    if (!username) {
        return {
            error: 'Please Sign In!'
        }
    }
    if (!name || (playersColor !== 'white' && playersColor !== 'black')) {
        return {
            error: 'Title and color are required!'
        }
    }
    if (!clientId) {
        return {
            error: 'An Id wasn\'t assigned to this socket session'
        }
    }

    // Store the game
    const game = {
        name,
        layout: [],
        history: [],
        playersTurn: 'white',
        playerOne: {
            clientId,
            username,
            playersColor,
            canKingCastleLeft: true,
            canKingCastleRight: true
        },
        playerTwo: {
            clientId: '',
            username: '',
            playersColor: '',
            canKingCastleLeft: true,
            canKingCastleRight: true
        }
    };

    const updateLayout = (layout) => {
        game.layout = layout;
    }

    if (await GameController.createNewGame(clientId, name, username, playersColor, updateLayout) && await UserController.addUserGame(clientId, name, username)) {
        Redis.setGame(name, JSON.stringify(game));
    
        return { name, clientId, layout: game.layout };
    }
    else {
        return {
            error: 'Couldn\'t create game'
        }
    }
}

const joinGame = async({clientId, name, username}) => {
    // Validate the data
    if (!username) {
        return {
            error: 'Please Sign In!'
        }
    }
    if (!name) {
        return {
            error: 'Enter title of game!'
        }
    }
    if (!clientId) {
        return {
            error: 'An Id wasn\'t assigned to this socket session'
        }
    }

    // Update and return the game
    let game;
    if (await GameController.joinCreatedGame(clientId, name, username) && await UserController.addUserGame(clientId, name, username)) {
        game = await Redis.getGame(name);
        game = game && JSON.parse(game);
        if (game.name === name) {
            game.playerTwo.clientId = clientId;
            game.playerTwo.username = username;
            game.playerTwo.playersColor = (game.playerOne.playersColor === 'white') ? 'black' : 'white';
            Redis.setGame(name, JSON.stringify(game));
        }
    }
    else {
        return { 
            error: 'Couldn\'t join game' 
        }
    }

    if (game && (game.name === name)) {
        return { game };
    }
    else {
        const savedGame = await Game.findOne({ name });
        game = {
            name: savedGame.name,
            layout: savedGame.layout,
            history: savedGame.history,
            playersTurn: savedGame.playersTurn,
            playerOne: savedGame.playerOne,
            playerTwo: savedGame.playerTwo
        }
        Redis.setGame(name, JSON.stringify(game));
        return { game }
    }
}

const watchGame = async({ name }) => {
    if (!name) {
        return {
            error: 'Enter a name for the game!'
        }
    }

    let game;
    game = await Redis.getGame(name);
    game = game && JSON.parse(game);

    if (!game || (game.name !== name)) {
        return {
            error: 'No game by this name being played'
        }
    }

    return { game };
}

const continueGame = async({clientId, name}) => {
    if (!name || !clientId) {
        return {
            error: 'Incorrect details provided'
        }
    }

    let game;
    game = await Redis.getGame(name);
    game = game && JSON.parse(game);

    if (!game || (game.name !== name)) {
        const savedGame = await Game.findOne({ name });
        if (savedGame && !savedGame.hasGameEnded) {
            game = {
                name: savedGame.name,
                layout: savedGame.layout,
                history: savedGame.history,
                playersTurn: savedGame.playersTurn,
                playerOne: savedGame.playerOne,
                playerTwo: savedGame.playerTwo,
                tournament: savedGame.tournament
            }
            Redis.setGame(name, JSON.stringify(game));
        }
    }

    if (game && game.name === name && game.playerOne.clientId === clientId) {
        return { 
            name,
            opponent: game.playerTwo.username,
            playersColor: game.playerOne.playersColor,
            layout: game.layout,
            playersTurn: game.playersTurn,
            canKingCastleLeft: game.playerOne.canKingCastleLeft,
            canKingCastleRight: game.playerOne.canKingCastleRight
        }
    }
    else if (game && game.name === name && game.playerTwo.clientId === clientId) {
        return { 
            name,
            opponent: game.playerOne.username,
            playersColor: game.playerTwo.playersColor,
            layout: game.layout,
            playersTurn: game.playersTurn,
            canKingCastleLeft: game.playerTwo.canKingCastleLeft,
            canKingCastleRight: game.playerTwo.canKingCastleRight
        }
    }
    else {
        return {
            error: 'Can\'t continue game'
        }
    }
}

const saveGame = async({clientId, name}) => {
    if (!name || !clientId) {
        return {
            error: 'Couldn\'t save game'
        }
    }

    let game;
    game = await Redis.getGame(name);
    game = game && JSON.parse(game);

    if (!game || (game.name !== name) || (game.playerOne.clientId !== clientId && game.playerTwo.clientId !== clientId)) {
        return {
            error: 'Couldn\'t save game'
        }
    }

    const message = moment().format('MMMM Do YYYY, h:mm:ss a');
    if (await GameController.updateGame(name, game)) {
        return { name, message }
    }
    else {
        return {
            error: 'Couldn\'t save game'
        }
    }
}

const exitGame = async({clientId, name, username}) => {
    if (!name || !clientId || !username) {
        return {
            error: 'Opponent wasn\'t notified'
        }
    }

    let game;
    game = await Redis.getGame(name);
    game = game && JSON.parse(game);

    if (game && (game.name === name) && (game.playerOne.clientId === clientId || game.playerTwo.clientId === clientId)) {
        Redis.setGame(name, '');
        return {
            name,
            username
        }
    }
    else {
        return {
            error: 'Opponent wasn\'t notified'
        }
    }
}

const endGame = async({clientId, name}) => {
    if (!name) {
        return {
            error: 'Couldn\'t end game'
        }
    }

    let game;
    game = await Redis.getGame(name);
    game = game && JSON.parse(game);

    if (!game || (game.name !== name) || (game.playerOne.clientId !== clientId && game.playerTwo.clientId !== clientId)) {
        return {
            error: 'Couldn\'t end game'
        }
    }

    const winner = game.playerOne.clientId === clientId ? game.playerTwo.username : game.playerOne.username;
    const loser = game.playerOne.clientId === clientId ? game.playerOne.username : game.playerTwo.username;

    if (game.playerTwo.clientId === '' && await GameController.deleteGame(name)) {
        Redis.setGame(name, '');
        return { name, username: loser }
    }
    else if (await GameController.updateGame(name, {...game, hasGameEnded: true, winner: winner}) && await UserController.userWon(name, winner) && await UserController.userLost(name, loser)) {
        eventEmitter.emit('userWon', winner);
        eventEmitter.emit('userLost', loser);
        Redis.setGame(name, '');
        game.tournament && TournamentController.updateTournament(game.tournament, winner);
        return { name, username: loser }
    }
    else {
        return {
            error: 'Couldn\'t end game'
        }
    }
}

const drawGame = async({name, clientId}) => {
    if (!name) {
        return {
            error: 'Please provide name of game'
        }
    }

    let game;
    game = await Redis.getGame(name);
    game = game && JSON.parse(game);

    if (!game || (game.name !== name) || (game.playerOne.clientId !== clientId && game.playerTwo.clientId !== clientId)) {
        return {
            error: 'Couldn\'t accept draw'
        }
    }

    if (await GameController.updateGame(name, {...game, hasGameEnded: true, winner: ''}) && await UserController.userDrew(name, game.playerOne.username) && await UserController.userDrew(name, game.playerTwo.username)) {
        eventEmitter.emit('userDrew', game.playerOne.username);
        eventEmitter.emit('userDrew', game.playerTwo.username);
        Redis.setGame(name, '');
        const roundWinner = (Math.floor(Math.random() * 2) === 0) ? game.playerOne.username : game.playerTwo.username;
        game.tournament && TournamentController.updateTournament(game.tournament, roundWinner);
        return { name }
    }
    else {
        return {
            error: 'Couldn\'t accept draw'
        }
    }
}

const reviewGame = async({name}) => {
    if (!name) {
        return {
            error: 'Please provide name of game'
        }
    }

    let game;
    game = await Redis.getGame(name);
    game = game && JSON.parse(game);

    if (!game || (game.name !== name)) {
        game = await Game.findOne({ name });
    }

    if (game && (game.name === name)) {
        return { game }
    }
    else {
        return { error: 'Couldn\'t retrieve game'}
    }
}

const updateMyBoard = async({ name }) => {
    if (!name) {
        return {
            error: 'Your game was not updated!'
        }
    }

    let game;
    game = await Redis.getGame(name);
    game = game && JSON.parse(game);

    if (!game || (game.name !== name)) {
        return {
            error: 'No game by this name being played'
        }
    }

    return { layout: game.layout, playersTurn: game.playersTurn };
}


const movePiece = async({clientId, name, username, layout, playersTurn, canKingCastleLeft, canKingCastleRight, checkType}) => {
    if (!name || !username || !clientId || !layout || !playersTurn) {
        return {
            error: 'Missing detail for move'
        }
    }

    let game;
    game = await Redis.getGame(name);
    game = game && JSON.parse(game);
    if (game.name === name && (game.playerOne.clientId === clientId || game.playerTwo.clientId === clientId)) {
        game.layout = layout;
        game.history.push(layout);
        game.playersTurn = playersTurn;
        if (game.playerOne.clientId === clientId) {
            game.playerOne.canKingCastleLeft = canKingCastleLeft;
            game.playerOne.canKingCastleRight = canKingCastleRight;
        }
        else if (game.playerTwo.clientId === clientId) {
            game.playerTwo.canKingCastleLeft = canKingCastleLeft;
            game.playerTwo.canKingCastleRight = canKingCastleRight;
        }
        Redis.setGame(name, JSON.stringify(game));
    }

    if (!game || (game.name !== name) || (game.playerOne.clientId !== clientId && game.playerTwo.clientId !== clientId)) {
        return {
            error: 'Couldn\'t perform move'
        }
    }

    if (checkType === 'Checkmate') {
        const loserUsername = (username === game.playerOne.username) ? game.playerTwo.username : game.playerOne.username;
        GameController.updateGame(name,  {...game, hasGameEnded: true, winner: username});
        UserController.userWon(name, username);
        UserController.userLost(name, loserUsername);
        eventEmitter.emit('userWon', username);
        eventEmitter.emit('userLost', loserUsername);
        Redis.setGame(name, '');
        game.tournament && TournamentController.updateTournament(game.tournament, username);
    }
    else if (checkType === 'Stalemate') {
        GameController.updateGame(name, {...game, hasGameEnded: true, winner: ''});
        UserController.userDrew(name, game.playerOne.username);
        UserController.userDrew(name, game.playerTwo.username);
        eventEmitter.emit('userDrew', game.playerOne.username);
        eventEmitter.emit('userDrew', game.playerTwo.username);
        Redis.setGame(name, '');
        const roundWinner = (Math.floor(Math.random() * 2) === 0) ? game.playerOne.username : game.playerTwo.username;
        game.tournament && TournamentController.updateTournament(game.tournament, roundWinner);
    }

    return { game, checkType }
}

export {
    newGame,
    joinGame,
    watchGame,
    continueGame,
    saveGame,
    exitGame,
    endGame,
    drawGame,
    reviewGame,
    updateMyBoard,
    movePiece
}