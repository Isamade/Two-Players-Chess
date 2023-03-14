import { Router } from 'express';
const router = Router();
import { ensureAuthenticated } from '../middlewares/index.js';
import { connectSql } from '../config/sdb.js';

router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard'));
router.get('/leaderboard', (req, res) => res.render('leaderboard'));
router.get('/highscores', (req, res) => {
    let sql = `SELECT * FROM users ORDER BY points DESC OFFSET \'${req.query._page * req.query._limit}\' LIMIT \'${req.query._limit}\'`;
    connectSql.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result.rows);
    })
});

export default router;