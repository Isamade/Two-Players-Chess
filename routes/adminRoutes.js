import { Router } from 'express';
const router = Router();

import { SQL } from '../config/postgres.js';
import { ensureAuthenticated, authorizeAdmin } from '../middlewares/index.js';

/*router.get('/createDB', ensureAuthenticated, authorizeAdmin, (req, res) => {
    let sqlQuery = 'CREATE DATABASE highscores';
    SQL.query(sqlQuery, (err, result) => {
        if (err) throw err;
        res.send('database created...')
    })
});*/

router.get('/createTable', ensureAuthenticated, authorizeAdmin, (req, res) => {
    let sqlQuery = 'CREATE TABLE users(username VARCHAR(255), games INTEGER, points INTEGER, PRIMARY KEY(username))';
    SQL.query(sqlQuery, (err, result) => {
        if (err) throw err;
        res.send('table created...')
    })
});

export default router;