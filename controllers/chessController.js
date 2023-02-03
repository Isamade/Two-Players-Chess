const moment = require('moment');
const redis = require('../config/redis');
const { eventEmitter } = require('../config/sdb');
const Game = require('../models/Game');
const { createNewGame, joinCreatedGame, updateGame, deleteGame } = require('./gameController');
const { addUserGame, userWon, userLost, userDrew } = require('./userController');
const { updateTournament } = require('./tournamentController');

const newGame = async({clientId, name, username, playersColor}) => {
    // Validate the data
    if (!username) {
        return {
            error: 'Please Sign In!'
        }
    }
    if (!name || !playersColor) {
        return {
            error: 'Title and color are required!'
        }
    }

    // Store the game
    const game = {
        name,
        board: [],
        history: [],
        playersTurn: 'white',
        playerOne: {
            clientId,
            username,
            playersColor,
            hasKingCastled: false
        },
        playerTwo: {
            clientId: '',
            username: '',
            playersColor: '',
            hasKingCastled: false
        }
    };

    const updateBoard = (board) => {
        game.board = board;
    }

    if (await createNewGame(clientId, name, username, playersColor, updateBoard) && await addUserGame(clientId, name, username)) {
        //redis.client.rpop('chessGames');
        redis.client.lpush('chessGames', JSON.stringify(game), function(err) {
            if (err) {
                console.error('redis', err);
            }
        });
    
        return { name, clientId, board: game.board };
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

    // Update and return the game
    let game;
    if (await joinCreatedGame(clientId, name, username) && await addUserGame(clientId, name, username)) {
        let games = await redis.currentGames();
        games.some((selectedGame, idx) => {
            game = JSON.parse(selectedGame);
            if (game.name === name) {
                game.playerTwo.clientId = clientId;
                game.playerTwo.username = username;
                game.playerTwo.playersColor = (game.playerOne.playersColor === 'white') ? 'black' : 'white';
                redis.updateGames(idx, JSON.stringify(game));
                return true;
            }
        });
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
            board: savedGame.board,
            history: savedGame.history,
            playersTurn: savedGame.playersTurn,
            playerOne: savedGame.playerOne,
            playerTwo: savedGame.playerTwo
        }
        redis.client.lpush('chessGames', JSON.stringify(game), function(err) {
            if (err) {
                console.error('redis', err);
            }
        });
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
    let games = await redis.currentGames();
    games.some((selectedGame) => {
        game = JSON.parse(selectedGame);
        if (game.name === name) {
            return true;
        }
    });

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
    let games = await redis.currentGames();
    games.some((selectedGame, idx) => {
        game = JSON.parse(selectedGame);
        if (game.name === name) {
            return true;
        }
    });

    if (!game || (game.name !== name)) {
        const savedGame = await Game.findOne({ name });
        if (savedGame && !savedGame.hasGameEnded) {
            game = {
                name: savedGame.name,
                board: savedGame.board,
                history: savedGame.history,
                playersTurn: savedGame.playersTurn,
                playerOne: savedGame.playerOne,
                playerTwo: savedGame.playerTwo,
                tournament: savedGame.tournament
            }
            redis.client.lpush('chessGames', JSON.stringify(game), function(err) {
                if (err) {
                    console.error('redis', err);
                }
            });
        }
    }

    if (game && game.name === name && game.playerOne.clientId === clientId) {
        return { 
            name,
            username: game.playerOne.username,
            opponent: game.playerTwo.username,
            playersColor: game.playerOne.playersColor,
            board: game.board,
            playersTurn: game.playersTurn,
            castled: game.playerOne.hasKingCastled
        }
    }
    else if (game && game.name === name && game.playerTwo.clientId === clientId) {
        return { 
            name,
            username: game.playerTwo.username, 
            opponent: game.playerOne.username,
            playersColor: game.playerTwo.playersColor,
            board: game.board,
            playersTurn: game.playersTurn,
            castled: game.playerTwo.hasKingCastled
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
    let games = await redis.currentGames();
    games.some((selectedGame, idx) => {
        game = JSON.parse(selectedGame);
        if (game.name === name) {
            return true;
        }
    });

    if (!game || (game.name !== name) || (game.playerOne.clientId !== clientId && game.playerTwo.clientId !== clientId)) {
        return {
            error: 'Couldn\'t save game'
        }
    }

    const message = moment().format('MMMM Do YYYY, h:mm:ss a');
    if (await updateGame(name, game)) {
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
    let index;
    let games = await redis.currentGames();
    games.some((selectedGame, idx) => {
        game = JSON.parse(selectedGame);
        index = idx;
        if (game.name === name) {
            return true;
        }
    });

    if (game && (game.name === name) && (game.playerOne.clientId === clientId || game.playerTwo.clientId === clientId)) {
        redis.updateGames(index, games[games.length - 1]);
        redis.popGame();
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
    let index;
    let games = await redis.currentGames();
    games.some((selectedGame, idx) => {
        game = JSON.parse(selectedGame);
        index = idx;
        if (game.name === name) {
            return true;
        }
    });

    if (!game || (game.name !== name) || (game.playerOne.clientId !== clientId && game.playerTwo.clientId !== clientId)) {
        return {
            error: 'Couldn\'t end game'
        }
    }

    const winner = game.playerOne.clientId === clientId ? game.playerTwo.username : game.playerOne.username;
    const loser = game.playerOne.clientId === clientId ? game.playerOne.username : game.playerTwo.username;

    if (game.playerTwo.clientId === '' && await deleteGame(name)) {
        redis.updateGames(index, games[games.length - 1]);
        redis.popGame();
        return { name, username: loser }
    }
    else if (await updateGame(name, {...game, hasGameEnded: true, winner: winner}) && await userWon(name, winner) && await userLost(name, loser)) {
        eventEmitter.emit('userWon', winner);
        eventEmitter.emit('userLost', loser);
        redis.updateGames(index, games[games.length - 1]);
        redis.popGame();
        game.tournament && updateTournament(game.tournament, winner);
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
    let index;
    let games = await redis.currentGames();
    games.some((selectedGame, idx) => {
        game = JSON.parse(selectedGame);
        index = idx;
        if (game.name === name) {
            return true;
        }
    });

    if (!game || (game.name !== name) || (game.playerOne.clientId !== clientId && game.playerTwo.clientId !== clientId)) {
        return {
            error: 'Couldn\'t accept draw'
        }
    }

    if (await updateGame(name, {...game, hasGameEnded: true, winner: ''}) && await userDrew(name, game.playerOne.username) && await userDrew(name, game.playerTwo.username)) {
        eventEmitter.emit('userDrew', game.playerOne.username);
        eventEmitter.emit('userDrew', game.playerTwo.username);
        redis.updateGames(index, games[games.length - 1]);
        redis.popGame();
        const roundWinner = (Math.floor(Math.random() * 2) === 0) ? game.playerOne.username : game.playerTwo.username;
        game.tournament && updateTournament(game.tournament, roundWinner);
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
    let games = await redis.currentGames();
    games.some((selectedGame, idx) => {
        game = JSON.parse(selectedGame);
        if (game.name === name){
            return true;
        }
    });

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
    let games = await redis.currentGames();
    games.some((selectedGame) => {
        game = JSON.parse(selectedGame);
        if (game.name === name) {
            return true;
        }
    });

    if (!game || (game.name !== name)) {
        return {
            error: 'No game by this name being played'
        }
    }

    return { board: game.board, playersTurn: game.playersTurn };
}


const movePiece = async({clientId, name, username, board, playersTurn, hasKingCastled, checkType}) => {
    if (!name || !username || !clientId || !board || !playersTurn) {
        return {
            error: 'Missing detail for move'
        }
    }

    let game;
    let index;
    let games = await redis.currentGames();
    games.some((selectedGame, idx) => {
        game = JSON.parse(selectedGame);
        index = idx;
        if (game.name === name && (game.playerOne.clientId === clientId || game.playerTwo.clientId === clientId)) {
            game.board = board;
            game.history.push(board);
            game.playersTurn = playersTurn;
            if (game.playerOne.clientId === clientId) {
                game.playerOne.hasKingCastled = hasKingCastled;
            }
            else if (game.playerTwo.clientId === clientId) {
                game.playerTwo.hasKingCastled = hasKingCastled;
            }
            redis.updateGames(idx, JSON.stringify(game));
            return true;
        }
    });

    if (!game || (game.name !== name) || (game.playerOne.clientId !== clientId && game.playerTwo.clientId !== clientId)) {
        return {
            error: 'Couldn\'t perform move'
        }
    }

    if (checkType === 'Checkmate') {
        const loserUsername = (username === game.playerOne.username) ? game.playerTwo.username : game.playerOne.username;
        updateGame(name,  {...game, hasGameEnded: true, winner: username})
        userWon(name, username);
        userLost(name, loserUsername);
        eventEmitter.emit('userWon', username);
        eventEmitter.emit('userLost', loserUsername);
        redis.updateGames(index, games[games.length - 1]);
        redis.popGame();
        game.tournament && updateTournament(game.tournament, username);
    }

    return { game, checkType }

    /*let game = games.find((game) => game.name === name);*/
}

module.exports = {
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