import chai from "chai";
import sinon from "sinon";
const expect = chai.expect;

import dom from '../domSetup.js';
import JoinGame from '../../public/js/joinGame.js';

const localStorageFake = {
    getItem: sinon.stub(),
    setItem: sinon.stub(),
    removeItem: sinon.stub(),
    clear: sinon.stub()
};

const sessionStorageFake = {
    getItem: sinon.stub(),
    setItem: sinon.stub(),
    removeItem: sinon.stub(),
    clear: sinon.stub()
};

const messengerFake = {
    socket: {
        emit: sinon.stub(),
        on: sinon.stub()
    }
}

const boardFake = {
    updateBoard: sinon.stub()
}

describe('JoinGame', () => {
  let joinGame;
  let localStorage = window.localStorage;
  let sessionStorage = window.sessionStorage;

  before(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageFake });
    Object.defineProperty(window, 'sessionStorage', { value: sessionStorageFake });
    global.window.sessionStorage.getItem.resolves('testUser');
  })

  after(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorage });
    Object.defineProperty(window, 'sessionStorage', { value: sessionStorage });
  })

  beforeEach(() => {
    joinGame = new JoinGame('test');
    Object.defineProperty(joinGame, 'messenger', { value: messengerFake });
    Object.defineProperty(joinGame, 'board', { value: boardFake });
    sinon.stub(joinGame, 'connectTools');
  });

  afterEach(() => {
    localStorageFake.clear();
    sinon.restore();
  });

  it('should join an existing game', () => {
    expect(joinGame).to.be.an.instanceOf(JoinGame);
    expect(joinGame.page).to.equal('joinGame');
  });

  it('should start playing the game', () => {
    joinGame.playGame();
    expect(joinGame.connectTools.calledOnce).to.be.true;
    expect(joinGame.messenger.socket.emit.calledOnce).to.be.true;
  });

  it('should update game and set current game in localStorage', () => {
    const id = '123';
    const layout = [];
    const opponent = 'testUser1';
    const playersColor = 'black';
    const playersTurn = 'white';
    joinGame.cb(null, id, opponent, playersColor, layout, playersTurn);
    expect(joinGame.id).to.equal(id);
    expect(joinGame.opponent).to.equal(opponent);
    expect(joinGame.playersColor).to.equal(playersColor);
    expect(joinGame.board.updateBoard.calledOnce).to.be.true;
    expect(localStorageFake.setItem.calledOnce).to.be.true;
    expect(localStorageFake.setItem.calledWith('currentGame', JSON.stringify({ name: 'test', clientId: id }))).to.be.true;
  });

  it('should handle error in callback', () => {
    const error = 'Error';
    sinon.stub(window, 'alert');
    joinGame.cb(error);
    expect(window.alert.calledWith(error)).to.be.true;
  });
});