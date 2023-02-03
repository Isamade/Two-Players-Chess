const redis = require('redis');
const redisClient = redis.createClient({url: process.env.REDIS_URL});
//const redisClient = redis.createClient();
redisClient.on('connect', () => {
    console.log('Connected to Redis...')
});

const promiser = (resolve, reject) => {
    return (err, data) => {
      if(err) reject(err);
      resolve(data);
    };
};

const getGame = (key) => {
    return new Promise((resolve, reject) => {
      redisClient.get(key, promiser(resolve, reject));
    });
};
  
/*const hgetall = (key) => {
    return new Promise((resolve, reject) => {
      if(key === null) reject();
      redisClient.hgetall(key, promiser(resolve, reject));
    });
};*/
  
const currentGames = () => {
    return new Promise((resolve, reject) => {
      redisClient.lrange('chessGames', 0, -1, promiser(resolve, reject));
    });
};

const updateGames = (idx, game) => {
  return new Promise((resolve, reject) => {
    redisClient.lset('chessGames', idx, game, promiser(resolve, reject));
  });
};

const popGame = () => {
  return new Promise((resolve, reject) => {
    redisClient.rpop('chessGames', promiser(resolve, reject));
  });
};
  
module.exports.getGame = getGame;
module.exports.currentGames = currentGames;
module.exports.updateGames = updateGames;
module.exports.popGame = popGame;
module.exports.client = redisClient;
  
  
