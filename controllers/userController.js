import User from '../models/User.js';

export default class UserController {
  static addUserGame = async (clientId, name, username) => {
    try {
      const user = await User.findOne({ username });
      user.currentGames.push({ name, clientId });
      await user.save();
      return true
    }
    catch {
      return false
    }
  }

  static userWon = async (name, username) => {
    try {
      const user = await User.findOne({ username });
      user.completedGames.push({ name });
      user.currentGames.some((game, idx) => {
        if (game.name === name) {
          user.currentGames[idx] = user.currentGames[user.currentGames.length - 1];
          user.currentGames.pop();
          return true;
        }
      });
      user.wins = user.wins + 1;
      await user.save();
      return true;
    }
    catch {
      return false;
    }
  }

  static userLost = async (name, username) => {
    try {
      const user = await User.findOne({ username });
      user.completedGames.push({ name });
      user.currentGames.some((game, idx) => {
        if (game.name === name) {
          user.currentGames[idx] = user.currentGames[user.currentGames.length - 1];
          user.currentGames.pop();
          return true;
        }
      });
      user.loses = user.loses + 1;
      await user.save();
      return true;
    }
    catch {
      return false;
    }
  }

  static userDrew = async (name, username) => {
    try {
      const user = await User.findOne({ username });
      user.completedGames.push({ name });
      user.currentGames.some((game, idx) => {
        if (game.name === name) {
          user.currentGames[idx] = user.currentGames[user.currentGames.length - 1];
          user.currentGames.pop();
          return true;
        }
      });
      user.draws = user.draws + 1;
      await user.save();
      return true;
    }
    catch {
      return false;
    }
  }

  static addUserTournament = async (tournament, username) => {
    let user = await User.findOne({ username });
    if (user) {
      user.tournaments.push(tournament);
    }
    user.save();
  }

  static getUserTournaments = async (req, res) => {
    try {
      const username = req.query.username;
      const user = await User.findOne({username});
      if (user) {
        res.json({tournaments: user.tournaments})
      }
    } catch (err) {
      console.log(err);
    }
  }
}

/*export async function addUserGame(clientId, name, username) {
    try {
        const user = await User.findOne({ username });
        user.currentGames.push({name, clientId});
        await user.save();
        return true
    }
    catch {
        return false
    }
}

export async function userWon(name, username) {
    try {
        const user = await User.findOne({ username });
        user.completedGames.push({name});
        user.currentGames.some((game, idx) => {
          if (game.name === name) {
            user.currentGames[idx] = user.currentGames[user.currentGames.length - 1];
            user.currentGames.pop();
            return true;
          }
        });
        user.wins = user.wins + 1;
        await user.save();
        return true;
    }
    catch {
        return false;
    }
}

export async function userLost(name, username) {
    try {
        const user = await User.findOne({ username });
        user.completedGames.push({name});
        user.currentGames.some((game, idx) => {
          if (game.name === name) {
            user.currentGames[idx] = user.currentGames[user.currentGames.length - 1];
            user.currentGames.pop();
            return true;
          }
        });
        user.loses = user.loses + 1;
        await user.save();
        return true;
    }
    catch {
        return false;
    }
}

export async function userDrew(name, username) {
    try {
        const user = await User.findOne({ username });
        user.completedGames.push({name});
        user.currentGames.some((game, idx) => {
          if (game.name === name) {
            user.currentGames[idx] = user.currentGames[user.currentGames.length - 1];
            user.currentGames.pop();
            return true;
          }
        });
        user.draws = user.draws + 1;
        await user.save();
        return true;
    }
    catch {
        return false;
    }
}

export async function addUserTournament(tournament, username) {
    let user = await User.findOne({ username });
    if (user) {
      user.tournaments.push(tournament);
    }
    user.save();
}

export async function getUserTournaments(req, res) {
  try {
    const username = req.query.username;
    const user = await User.findOne({username});
    if (user) {
      res.json({tournaments: user.tournaments})
    }
  } catch (err) {
    console.log(err);
  }
}*/