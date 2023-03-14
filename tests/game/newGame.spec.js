/*import {expect} from "chai";
import sinon from "sinon";
import {NewGame} from "../../controllers/chessController.js";

describe("New Game", function() {
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

/*
const sinon = require('sinon');

// Mock the localStorage API
const localStorageFake = (() => {
  let store = {};
  return {
    getItem: key => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: key => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

// Use the localStorageFake instead of the real localStorage in your tests
describe('MyModule', () => {
  beforeEach(() => {
    sinon.replace(window, 'localStorage', localStorageFake);
  });

  afterEach(() => {
    sinon.restore();
    localStorageFake.removeItem('currentGame');
  });

  it('should set and get an item from localStorage', () => {
    const myModule = require('./myModule');
    myModule.setItem('foo', 'bar');
    expect(myModule.getItem('foo')).to.equal('bar');
  });
});
*/

import chai from "chai";
import sinon from "sinon";
const expect = chai.expect;

import dom from '../domSetup.js';
import NewGame from '../../public/js/newGame.js';

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

describe('NewGame', () => {
  let newGame;
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
    newGame = new NewGame('test', 'white');
    Object.defineProperty(newGame, 'messenger', { value: messengerFake });
    Object.defineProperty(newGame, 'board', { value: boardFake });
    sinon.stub(newGame, 'connectTools');
  });

  afterEach(() => {
    localStorageFake.clear();
    sinon.restore();
  });

  it('should create a new game', () => {
    expect(newGame).to.be.an.instanceOf(NewGame);
    expect(newGame.playersColor).to.equal('white');
    expect(newGame.page).to.equal('newGame');
  });

  it('should start the game', () => {
    newGame.startGame();
    expect(newGame.connectTools.calledOnce).to.be.true;
    expect(newGame.messenger.socket.emit.calledOnce).to.be.true;
  });

  it('should update board and set current game in localStorage', () => {
    const id = '123';
    const layout = [];
    newGame.cb(null, id, layout);
    expect(newGame.id).to.equal(id);
    expect(newGame.board.updateBoard.calledOnce).to.be.true;
    expect(localStorageFake.setItem.calledOnce).to.be.true;
    expect(localStorageFake.setItem.calledWith('currentGame', JSON.stringify({ name: 'test', clientId: id }))).to.be.true;
  });

  it('should handle error in callback', () => {
    const error = 'Error';
    sinon.stub(window, 'alert');
    newGame.cb(error);
    expect(window.alert.calledWith(error)).to.be.true;
  });
});
