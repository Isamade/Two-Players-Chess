import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import crypto from 'crypto';

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please add a name"],
    unique: [true, "Name already exists"]
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    match: [
      /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm, "Please add a valid email"
    ]
  },
  password: {
    type: String,
    required: true
  },
  currentGames: [],
  completedGames: [],
  tournaments: [],
  wins: {
    type: Number,
    default: 0
  },
  loses: {
    type: Number,
    default: 0
  },
  draws: {
    type: Number,
    default: 0
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  date: {
    type: Date,
    default: Date.now
  }
});

/*UserSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

UserSchema.index({ name: 1 });*/

export default model('user', UserSchema);