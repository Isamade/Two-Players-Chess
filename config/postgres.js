import { EventEmitter } from 'events';
//const mysql = require('mysql2');

const eventEmitter = new EventEmitter();
const host = process.env.PGHOST;
const user = process.env.PGUSER;
const password = process.env.PGPASSWORD;
const database = process.env.PGDATABASE;
const port = process.env.PGPORT;

/*let SQL = mysql.createConnection({
    host,
    user,
    password,
    database
});

SQL.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('sql connected!')
});*/

import pg from 'pg';
const { Client } = pg;
const SQL = new Client({
  user,
  host,
  database,
  password,
  port,
});
/*const SQL = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
});*/

SQL.on("connect", () => {
  console.log('Connected to sql');
});

eventEmitter.on('addUser', (username)=>{
    let sql = `INSERT INTO users (username, games, points) VALUES (\'${username}\', 0, 0)`;
    SQL.query(sql, (err, result) => {
        if (err) throw err;
    })
});

eventEmitter.on('userWon', (username)=>{
    let sql = `UPDATE users SET games = games + 1, points = points + 3 WHERE username = \'${username}\'`;
    SQL.query(sql, (err, result) => {
        if (err) throw err;
    })
});

eventEmitter.on('userLost', (username)=>{
    let sql = `UPDATE users SET games = games + 1 WHERE username = \'${username}\'`;
    SQL.query(sql, (err, result) => {
        if (err) throw err;
    })
});

eventEmitter.on('userDrew', (username)=>{
    let sql = `UPDATE users SET games = games + 1, points = points + 1 WHERE username = \'${username}\'`;
    SQL.query(sql, (err, result) => {
        if (err) throw err;
    })
});

export {
    SQL,
    eventEmitter
};