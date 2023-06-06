import { Router } from 'express';
const router = Router();
import { ensureAuthenticated } from '../middlewares/index.js';
import { SQL } from '../config/postgres.js';

router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard'));
router.get('/leaderboard', (req, res) => res.render('leaderboard'));
router.get('/highscores', (req, res) => {
    let sqlQuery = `SELECT * FROM users ORDER BY points DESC OFFSET \'${req.query._page * req.query._limit}\' LIMIT \'${req.query._limit}\'`;
    SQL.query(sqlQuery, (err, result) => {
        if (err) throw err;
        res.send(result.rows);
    })
});

export default router;