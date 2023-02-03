const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: [true, "Name already exists"]
  },
  board: {
    type: Array,
    default: ["RW","NW","BW","KW","QW","BW","NW","RW","PW","PW","PW","PW","PW","PW","PW","PW","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","","PB","PB","PB","PB","PB","PB","PB","PB","RB","NB","BB","KB","QB","BB","NB","RB"]
  },
  history: [],
  playersTurn: {
    type: String,
    default: 'white'
  },
  hasGameEnded: Boolean,
  winner: String,
  playerOne: {
    type: Object,
    default: {
        clientId: '',
        username: '',
        playersColor: '',
        hasKingCastled: false
    }
  },
  playerTwo: {
    type: Object,
    default: {
        clientId: '',
        username: '',
        playersColor: '',
        hasKingCastled: false
    }
  },
  tournament: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Game = mongoose.model('game', GameSchema);