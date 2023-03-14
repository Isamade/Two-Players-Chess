/*class MyClass {
    myMethod() {
      return 'original implementation';
    }
}
  
// create a stub for MyClass
const myClassStub = sinon.createStubInstance(MyClass);

// stub the myMethod method of MyClass
myClassStub.myMethod.returns('stubbed implementation');

// use the stub in your test
assert.equal(myClassStub.myMethod(), 'stubbed implementation');

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;

class MyClass {
  constructor(arg1, arg2) {
    // some code
  }
}

describe('MyClass', () => {
  it('should create a new instance', () => {
    const myClassStub = sinon.stub().returns({
        // fake instance
    });
    sinon.stub(MyClass, 'constructor').callsFake(myClassStub);

    // code that calls new MyClass()

    expect(myClassStub.calledOnce).to.be.true;

    MyClass.constructor.restore();
  });
});*/



/*describe('createTournamentGame', () => {
    it('should create a new tournament game', async() => {
        const gameFake = sinon.stub().returns({
          save: sinon.stub()
        })
        sinon.stub(Game, 'constructor').callsFake(gameFake);

        expect(gameFake.calledOnce).to.be.true;
    })
})*/
  

import sinon from 'sinon';
import chai from 'chai';
const { expect } = chai;
import GameController from '../../controllers/gameController.js';
import Game from '../../models/Game.js';
import UserController from '../../controllers/userController.js';

describe('createTournamentGame', () => {
  let findOneStub, saveStub, addUserGameStub;

  beforeEach(() => {
    findOneStub = sinon.stub(Game, 'findOne');
    saveStub = sinon.stub(Game.prototype, 'save');
    addUserGameStub = sinon.stub(UserController, 'addUserGame');
  });

  afterEach(() => {
    findOneStub.restore();
    saveStub.restore();
    addUserGameStub.restore();
  });

  it.only('should create a new game', async () => {
    const match = {
      playerOne: 'Alice',
      playerTwo: 'Bob'
    };
    const tournament = '123';
    const name = 'Alice vs Bob 1';
    findOneStub.withArgs({ name }).returns(null);

    const result = await GameController.createTournamentGame(match, tournament);

    expect(result).to.deep.equal({
      name,
      playerOne: match.playerOne,
      playerTwo: match.playerTwo
    });

    const expectedPlayerOne = {
      clientId: sinon.match.string,
      username: match.playerOne,
      playersColor: 'white',
      hasKingCastled: false
    };
    const expectedPlayerTwo = {
      clientId: sinon.match.string,
      username: match.playerTwo,
      playersColor: 'black',
      hasKingCastled: false
    };
    expect(saveStub.calledOnce).to.be.true;
    /*expect(saveStub.firstCall.args[0]).to.deep.include({
      name,
      playerOne: expectedPlayerOne,
      playerTwo: expectedPlayerTwo,
      tournament
    });*/

    expect(addUserGameStub.calledTwice).to.be.true;
    expect(addUserGameStub.firstCall.calledWithExactly(
      expectedPlayerOne.clientId,
      name,
      expectedPlayerOne.username
    )).to.be.true;
    expect(addUserGameStub.secondCall.calledWithExactly(
      expectedPlayerTwo.clientId,
      name,
      expectedPlayerTwo.username
    )).to.be.true;
  });

  it('should increment the game name if it already exists', async () => {
    const match = {
      playerOne: 'Alice',
      playerTwo: 'Bob'
    };
    const tournament = '123';
    const name = 'Alice vs Bob 1';
    const existingGame = {
      name,
      playerOne: { username: match.playerOne },
      playerTwo: { username: match.playerTwo }
    };
    findOneStub.withArgs({ name }).returns(existingGame);

    const result = await GameController.createTournamentGame(match, tournament);

    expect(result).to.deep.equal({
      name: 'Alice vs Bob 2',
      playerOne: match.playerOne,
      playerTwo: match.playerTwo
    });
  });
});
