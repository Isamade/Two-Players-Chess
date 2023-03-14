import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const TournamentSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please add a title"],
    unique: [true, "Title already exists"]
  },
  stake: Number,
  numberOfPlayers: Number,
  difficulty: String,
  duration: Number,
  players: [],
  nextRound: [],
  games: [],
  currentGames: Array,
  hasTournamentEnded: {
    type: Boolean,
    default: false
  },
  hasTournamentStarted: {
    type: Boolean,
    default: false
  },
  addedToContract: {
    type: Boolean,
    default: false
  },
  winner: {
    type: String,
    default: ''
  },
  joinTournamentRequest: [],
  created: String,
  date: {
    type: Date,
    default: Date.now
  }
});

export default model('tournament', TournamentSchema);