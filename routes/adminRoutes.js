import { Router } from 'express';
const router = Router();

import { connectSql } from '../config/sdb.js';
import { ensureAuthenticated, authorizeAdmin } from '../middlewares/index.js';

/*router.get('/createDB', ensureAuthenticated, authorizeAdmin, (req, res) => {
    let sql = 'CREATE DATABASE highscores';
    connectSql.query(sql, (err, result) => {
        if (err) throw err;
        res.send('database created...')
    })
});*/

router.get('/createTable', ensureAuthenticated, authorizeAdmin, (req, res) => {
    let sql = 'CREATE TABLE users(username VARCHAR(255), games INTEGER, points INTEGER, PRIMARY KEY(username))';
    connectSql.query(sql, (err, result) => {
        if (err) throw err;
        res.send('table created...')
    })
});

export default router;