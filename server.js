const app = require('./app');
const { newGame, joinGame, watchGame, continueGame, saveGame, exitGame, endGame, drawGame, reviewGame, updateMyBoard, movePiece } = require('./controllers/chessController');

const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;

io.sockets.on('connection', (client) => {

    client.on('newGame', async(options, callback) => {
        const { error, name, clientId, board } = await newGame({ clientId: client.id, ...options });

        if (error) {
            return callback(error)
        }

        client.join(name);

        callback(error, clientId, board);
    });

    client.on('joinGame', async(options, callback) => {
        const { error, game } = await joinGame({ clientId: client.id, ...options });
        
        if (error) {
            return callback(error)
        }

        client.join(game.name);
        client.broadcast.to(game.name).emit('joinedGame', `${game.playerTwo.username}`);

        callback(error, game.playerTwo.clientId, game.playerOne.username, game.playerTwo.playersColor, game.board, game.playersTurn);
    });

    client.on('watchGame', async(options, callback) => {
        const { error, game } = await watchGame(options);

        if (error) {
            return callback(error)
        }

        client.join(game.name);

        callback(error, game.playerOne, game.playerTwo, game.board, game.playersTurn);
    });

    client.on('continueGame', async(options, callback) => {
        const { error, name, username, opponent, playersColor, board, playersTurn, castled } = await continueGame(options);
        
        if (error) {
            return callback(error)
        }

        client.join(name);

        callback(error, opponent, playersColor, board, playersTurn, castled);
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

        client.broadcast.to(name).emit('exitedGame', username);
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

        client.broadcast.to(name).emit('offeredDraw', username);

        callback();
    });

    client.on('acceptDraw', async(options, callback) => {
        const { error, name } = await drawGame(options);
        
        if (error) {
            return callback(error)
        }

        client.broadcast.to(name).emit('acceptedDraw');

        callback();
    });

    client.on('refuseDraw', async(options, callback) => {
        const { name, username } = options;
        let { error, board, playersTurn } = await updateMyBoard(options);
        
        if (!username || !name) {
            error = 'Please provide username and name';
            return callback(error)
        }

        client.broadcast.to(name).emit('refusedDraw', username);

        callback(error, board, playersTurn);
    });

    client.on('reviewGame', async(options, callback) => {
        const { error, game } = await reviewGame(options);
        
        if (error) {
            return callback(error)
        }

        callback(error, game.playerOne, game.playerTwo, game.history);
    });

    client.on('updateMyBoard', async(options, callback) => {
        const { error, board, playersTurn } = await updateMyBoard(options);

        if (error) {
            return callback(error)
        }

        callback(error, board, playersTurn);
    })

    client.on('movePiece', async(options, callback) => {
        const { error, game, checkType } = await movePiece(options);

        if (error) {
            return callback(error)
        }

        client.broadcast.to(game.name).emit('movedPiece', { board: game.board, checkType });

        callback(error, game.board, options.hasKingCastled, checkType);
    });

});


server.listen(port, () => { console.log(`Server is up on port ${port}!`) });