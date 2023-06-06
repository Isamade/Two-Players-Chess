import { createClient } from 'redis';
//const redisClient = redis.createClient({url: process.env.REDIS_URL});
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.PORT
  }
});
redisClient.on('error', err => console.log('Redis Client Error', err));
redisClient.on('connect', () => {
    console.log('Connected to Redis...')
});

/*const promiser = (resolve, reject) => {
    return (err, data) => {
      if(err) reject(err);
      resolve(data);
    };
};*/

export default class Redis {
  static connect = async () => {
    await redisClient.connect();
  }

  static getGame = async (name) => {
    const reply = await redisClient.get(name);
    return reply;
  }

  static setGame = async(name, game) => {
    const reply = await redisClient.set(name, game);
    return reply;
  }
}

/*const getGame = (name) => {
    return new Promise((resolve, reject) => {
      redisClient.get(name, promiser(resolve, reject));
    });
};

const setGame = (name, game) => {
  return new Promise((resolve, reject) => {
    redisClient.set(name, game, promiser(resolve, reject));
  });
};

const getGame = async(name) => {
  const reply = await client.get(name);
  return reply;
};

const setGame = async(name, game) => {
  const reply = await client.set(name, game);
  return reply;
};
  
const currentGames = () => {
    return new Promise((resolve, reject) => {
      redisClient.lRange('chessGames', 0, -1, promiser(resolve, reject));
    });
};

const updateGames = (idx, game) => {
  return new Promise((resolve, reject) => {
    redisClient.lSet('chessGames', idx, game, promiser(resolve, reject));
  });
};

const popGame = () => {
  return new Promise((resolve, reject) => {
    redisClient.rPop('chessGames', promiser(resolve, reject));
  });
};
  
const _getGame = getGame;
export { _getGame as getGame };
const _setGame = setGame;
export { _setGame as setGame };
const _currentGames = currentGames;
export { _currentGames as currentGames };
const _updateGames = updateGames;
export { _updateGames as updateGames };
const _popGame = popGame;
export { _popGame as popGame };
export const client = redisClient;*/
  
  
