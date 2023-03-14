import { EventEmitter } from 'events';
//const mysql = require('mysql2');
//import { get } from 'config';
import config from 'config';

const eventEmitter = new EventEmitter();
const host = config.get('SQL_HOST');
const user = config.get('SQL_USER');
const password = config.get('SQL_PASSWORD');
const database = config.get('SQL_DATABASE');
const port = config.get('SQL_PORT');

/*let connectSql = mysql.createConnection({
    host,
    user,
    password,
    database
});

connectSql.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('sql connected!')
});*/

//import { Client } from "pg";
import pg from 'pg';
const { Client } = pg;
const connectSql = new Client({
  user,
  host,
  database,
  password,
  port,
});
/*const connectSql = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
});*/

connectSql.on("connect", () => {
  console.log('Connected to sql');
});

eventEmitter.on('addUser', (username)=>{
    let sql = `INSERT INTO users (username, games, points) VALUES (\'${username}\', 0, 0)`;
    connectSql.query(sql, (err, result) => {
        if (err) throw err;
    })
});

eventEmitter.on('userWon', (username)=>{
    let sql = `UPDATE users SET games = games + 1, points = points + 3 WHERE username = \'${username}\'`;
    connectSql.query(sql, (err, result) => {
        if (err) throw err;
    })
});

eventEmitter.on('userLost', (username)=>{
    let sql = `UPDATE users SET games = games + 1 WHERE username = \'${username}\'`;
    connectSql.query(sql, (err, result) => {
        if (err) throw err;
    })
});

eventEmitter.on('userDrew', (username)=>{
    let sql = `UPDATE users SET games = games + 1, points = points + 1 WHERE username = \'${username}\'`;
    connectSql.query(sql, (err, result) => {
        if (err) throw err;
    })
});

export {
    connectSql,
    eventEmitter
};