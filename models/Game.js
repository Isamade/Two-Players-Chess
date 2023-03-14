import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const GameSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    unique: [true, "Name already exists"]
  },
  layout: {
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
        canKingCastleLeft: true,
        canKingCastleRight: true
    }
  },
  playerTwo: {
    type: Object,
    default: {
        clientId: '',
        username: '',
        playersColor: '',
        canKingCastleLeft: true,
        canKingCastleRight: true
    }
  },
  tournament: String,
  date: {
    type: Date,
    default: Date.now
  }
});

export default model('game', GameSchema);