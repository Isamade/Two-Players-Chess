import chai from "chai";
import sinon from "sinon";
import moment from "moment";
import chaiAsPromised from "chai-as-promised";
import sinonChai from "sinon-chai";
import { newGame, joinGame, watchGame, continueGame, saveGame, exitGame, endGame, drawGame, reviewGame, updateMyBoard, movePiece } from "../../controllers/chessController.js";
import GameController from "../../controllers/gameController.js";
import UserController from "../../controllers/userController.js";
import TournamentController from "../../controllers/tournamentController.js";
import Redis from "../../config/redis.js";
import { eventEmitter } from "../../config/sdb.js";
import Game from '../../models/Game.js';

const expect = chai.expect;
chai.should();
chai.use(sinonChai);
/*const { newGame, joinGame, watchGame, continueGame, saveGame, exitGame, endGame, drawGame, reviewGame, updateMyBoard, movePiece } = chessController;
const { createNewGame, joinCreatedGame, updateGame, deleteGame } = gameController;
const { addUserGame, userWon, userLost, userDrew } = userController;
const { updateTournament } = tournamentController;
const { setGame, getGame } = redis;
const { eventEmitter } = sdb;*/

/*describe("New Game", function() {
    it("Should return a name, clientId and layout", function() {
        const mock = sinon.mock(newGame);
        const expectation1 = mock.expects("createNewGame");
        const expectation2 = mock.expects("addUserGame");
        const expectation3 = mock.expects("setGame");
        const {name, clientId, layout} = newGame("B5LsluU7HEwWYyEEAAAL", "First Game", "Kenneth", "white");
        expect(name).to.be.equal('First Game');
        expect(clientId).to.be.equal('B5LsluU7HEwWYyEEAAAL');
        expect(typeof(layout)).to.be.equal('object');
    })
    it("Should have a name", function() {
        const mock = sinon.mock(NewGame);
        const expectation = mock.expects("startGame");
        expectation.exactly(1);
        new NewGame('First game', 'white');
        mock.verify();
        //const stub = sinon.stub(newGame, "startGame");

        //expect(newGame.name).to.be.equal('First game');
        //console.log('Game', newGame);
    });
    it.skip("Should have a color", function() {
        //expect(newGame.playersColor).to.be.equal('white');
    });
});*/

describe('newGame', () => {
  let createNewGameStub;
  let addUserGameStub;
  let setGameStub;

  beforeEach(() => {
    createNewGameStub = sinon.stub(GameController, 'createNewGame');
    addUserGameStub = sinon.stub(UserController, 'addUserGame');
    setGameStub = sinon.stub(Redis, 'setGame');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return an error if the user is not signed in', async () => {
    const result = await newGame({ clientId: '123', username: '', name: 'Test', playersColor: 'white' });

    expect(result).to.deep.equal({ error: 'Please Sign In!' });
  });

  it('should return an error if color is not provided', async () => {
    const result = await newGame({ clientId: '123', username: 'TestUser', name: 'Test', playersColor: '' });

    expect(result).to.deep.equal({ error: 'Title and color are required!' });
  });

  it('should return an error if title is not provided', async () => {
    const result = await newGame({ clientId: '123', username: 'TestUser', name: '', playersColor: 'white' });

    expect(result).to.deep.equal({ error: 'Title and color are required!' });
  });

  it('should return an error if the id was not assigned', async () => {
    const result = await newGame({ clientId: null, username: 'TestUser', name: 'Test', playersColor: 'white' });

    expect(result).to.deep.equal({ error: 'An Id wasn\'t assigned to this socket session' });
  });

  it('should create a new game and update the board if all parameters are provided', async () => {
    createNewGameStub.resolves(true);
    addUserGameStub.resolves(true);
    setGameStub.resolves(true);

    const expectedGame = {
      name: 'Test',
      layout: [],
      history: [],
      playersTurn: 'white',
      playerOne: {
        clientId: '123',
        username: 'TestUser',
        playersColor: 'white',
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

    const result = await newGame({ clientId: '123', username: 'TestUser', name: 'Test', playersColor: 'white' });

    expect(createNewGameStub).to.have.been.calledOnceWith('123', 'Test', 'TestUser', 'white', sinon.match.func);
    expect(addUserGameStub).to.have.been.calledOnceWith('123', 'Test', 'TestUser');
    expect(setGameStub).to.have.been.calledOnceWith('Test', JSON.stringify(expectedGame));
    expect(result).to.deep.equal({ name: 'Test', clientId: '123', layout: [] });
  });

  it('should return an error if the game cannot be created', async () => {
    createNewGameStub.resolves(false);

    const result = await newGame({ clientId: '123', username: 'TestUser', name: 'Test', playersColor: 'white' });

    expect(createNewGameStub).to.have.been.calledOnceWith('123', 'Test', 'TestUser', 'white', sinon.match.func);
    expect(addUserGameStub).to.not.have.been.called;
    expect(setGameStub).to.not.have.been.called;
    expect(result).to.deep.equal({ error: 'Couldn\'t create game' });
  });

  it('should return an error if the game cannot be added to the user', async () => {
    createNewGameStub.resolves(true);
    addUserGameStub.resolves(false);

    const result = await newGame({ clientId: '123', username: 'TestUser', name: 'Test', playersColor: 'white' });

    expect(createNewGameStub).to.have.been.calledOnceWith('123', 'Test', 'TestUser', 'white', sinon.match.func);
    expect(addUserGameStub).to.have.been.calledOnceWith('123', 'Test', 'TestUser');
    expect(setGameStub).to.not.have.been.called;
    expect(result).to.deep.equal({ error: 'Couldn\'t create game' });
  });
});

describe('joinGame', () => {
    let joinCreatedGameStub;
    let addUserGameStub;
    let getGameStub;
    let setGameStub;
    let findOneStub;
    let expectedGame;

    beforeEach(() => {
        joinCreatedGameStub = sinon.stub(GameController, 'joinCreatedGame');
        addUserGameStub = sinon.stub(UserController, 'addUserGame');
        setGameStub = sinon.stub(Redis, 'setGame');
        getGameStub = sinon.stub(Redis, 'getGame');
        findOneStub = sinon.stub(Game, 'findOne');

        expectedGame = {
            name: 'Test',
            layout: [],
            history: [],
            playersTurn: 'white',
            playerOne: {
              clientId: '123',
              username: 'TestUser',
              playersColor: 'white',
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
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should return an error if the user is not signed in', async () => {
        const result = await joinGame({ clientId: '456', username: '', name: 'Test' });
    
        expect(result).to.deep.equal({ error: 'Please Sign In!' });
    });

    it('should return an error if title is not provided', async () => {
        const result = await joinGame({ clientId: '456', username: 'TestUser2', name: '' });
    
        expect(result).to.deep.equal({ error: 'Enter title of game!' });
    });

    it('should return an error if the id was not assigned', async () => {
        const result = await joinGame({ clientId: null, username: 'TestUser2', name: 'Test' });
    
        expect(result).to.deep.equal({ error: 'An Id wasn\'t assigned to this socket session' });
    });

    it('should add new player to game if all parameters are provided', async () => {
        joinCreatedGameStub.resolves(true);
        addUserGameStub.resolves(true);
        setGameStub.resolves(true);
        getGameStub.resolves(JSON.stringify(expectedGame));
    
        const result = await joinGame({ clientId: '456', username: 'TestUser2', name: 'Test' });

        expectedGame.playerTwo = {
            clientId: '456',
            username: 'TestUser2',
            playersColor: 'black',
            canKingCastleLeft: true,
            canKingCastleRight: true
        }
    
        expect(joinCreatedGameStub).to.have.been.calledOnceWith('456', 'Test', 'TestUser2');
        expect(addUserGameStub).to.have.been.calledOnceWith('456', 'Test', 'TestUser2');
        expect(setGameStub).to.have.been.calledOnceWith('Test', JSON.stringify(expectedGame));
        expect(result).to.deep.equal({game: expectedGame});
    });

    it('should still return the game even when absent from Redis', async () => {
        expectedGame.playerTwo = {
            clientId: '456',
            username: 'TestUser2',
            playersColor: 'black',
            canKingCastleLeft: true,
            canKingCastleRight: true
        }
        joinCreatedGameStub.resolves(true);
        addUserGameStub.resolves(true);
        setGameStub.resolves(true);
        getGameStub.resolves('');
        findOneStub.resolves(expectedGame);
    
        const result = await joinGame({ clientId: '456', username: 'TestUser2', name: 'Test' });
    
        expect(joinCreatedGameStub).to.have.been.calledOnceWith('456', 'Test', 'TestUser2');
        expect(addUserGameStub).to.have.been.calledOnceWith('456', 'Test', 'TestUser2');
        expect(getGameStub).to.have.been.calledOnceWith('Test');
        expect(findOneStub).to.have.been.calledOnceWith({ name: 'Test'});
        expect(setGameStub).to.have.been.calledOnceWith('Test', JSON.stringify(expectedGame));
        expect(result).to.deep.equal({game: expectedGame});
    });
});
