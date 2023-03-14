import * as http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { newGame, joinGame, watchGame, continueGame, saveGame, exitGame, endGame, drawGame, reviewGame, updateMyBoard, movePiece } from './controllers/chessController.js';

const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

io.sockets.on('connection', (client) => {

    client.on('newGame', async(options, callback) => {
        const { error, name, clientId, layout } = await newGame({ clientId: client.id, ...options });

        if (error) {
            return callback(error)
        }

        client.join(name);

        callback(error, clientId, layout);
    });

    client.on('joinGame', async(options, callback) => {
        const { error, game } = await joinGame({ clientId: client.id, ...options });
        
        if (error) {
            return callback(error)
        }

        client.join(game.name);
        client.broadcast.to(game.name).emit('opponentJoined', `${game.playerTwo.username}`);

        callback(error, game.playerTwo.clientId, game.playerOne.username, game.playerTwo.playersColor, game.layout, game.playersTurn);
    });

    client.on('watchGame', async(options, callback) => {
        const { error, game } = await watchGame(options);

        if (error) {
            return callback(error)
        }

        client.join(game.name);

        callback(error, game.playerOne, game.playerTwo, game.layout, game.playersTurn);
    });

    client.on('continueGame', async(options, callback) => {
        const { error, name, opponent, playersColor, layout, playersTurn, canKingCastleLeft, canKingCastleRight } = await continueGame(options);
        
        if (error) {
            return callback(error)
        }

        client.join(name);

        callback(error, opponent, playersColor, layout, playersTurn, canKingCastleLeft, canKingCastleRight);
    });

    client.on('saveGame', async(options, callback) => {
        const { error, name, message } = await saveGame(options);
        
        if (error) {
            return callback(error)
        }

        client.broadcast.to(name).emit('savedGame', message);

        callback(error, message);
    });

    client.on('exitGame', async(options) => {
        const { error, name, username } = await exitGame(options);
        
        if (error) {
            return true;
        }

        client.broadcast.to(name).emit('opponentExited', username);
    });

    client.on('endGame', async(options, callback) => {
        const { error, name, username } = await endGame(options);
        
        if (error) {
            return callback(error)
        }

        client.broadcast.to(name).emit('endedGame', username);

        callback();
    });

    client.on('offerDraw', (options, callback) => {
        const { name, username } = options;
        let error;
        
        if (!username || !name) {
            error = 'Please provide username and name';
            return callback(error)
        }

        client.broadcast.to(name).emit('drawOffered', username);

        callback(error);
    });

    client.on('acceptDraw', async(options, callback) => {
        const { error, name } = await drawGame(options);
        
        if (error) {
            return callback(error)
        }

        client.broadcast.to(name).emit('drawAccepted');

        callback();
    });

    client.on('refuseDraw', async(options, callback) => {
        const { name, username } = options;
        let { error, layout, playersTurn } = await updateMyBoard(options);
        
        if (!username || !name) {
            error = 'Please provide username and name';
            return callback(error)
        }

        client.broadcast.to(name).emit('drawRefused', username);

        callback(error, layout, playersTurn);
    });

    client.on('reviewGame', async(options, callback) => {
        const { error, game } = await reviewGame(options);
        
        if (error) {
            return callback(error)
        }

        callback(error, game.playerOne, game.playerTwo, game.history);
    });

    client.on('updateMyBoard', async(options, callback) => {
        const { error, layout, playersTurn } = await updateMyBoard(options);

        if (error) {
            return callback(error)
        }

        callback(error, layout, playersTurn);
    })

    client.on('movePiece', async(options, callback) => {
        const { error, game, checkType } = await movePiece(options);

        if (error) {
            return callback(error)
        }

        client.broadcast.to(game.name).emit('movedPiece', { layout: game.layout, checkType });

        callback(error, game.layout, options.canKingCastleLeft, options.canKingCastleRight, game.playersTurn, checkType);
    });

});


server.listen(port, () => { console.log(`Server is up on port ${port}!`) });