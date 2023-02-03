const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares');
const { connectSql } = require('../config/sdb');

router.get('/dashboard', ensureAuthenticated, (req, res) => res.render('dashboard'));
router.get('/leaderboard', (req, res) => res.render('leaderboard'));
router.get('/highscores', (req, res) => {
    let sql = 'SELECT * FROM users ORDER BY points DESC LIMIT 50';
    connectSql.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result.rows);
    })
});

module.exports = router;