const express = require('express');
const router = express.Router();
const { createTournament, joinTournament, getTournament, getTournamentData, getJoinTournamentData, getContract, addPlayer } = require('../controllers/tournamentController');
const { getUserTournaments } = require('../controllers/userController');

const { ensureAuthenticated } = require('../middlewares');

router.get('/', ensureAuthenticated, (req, res) => res.render('tournaments'));
router.get('/archive', ensureAuthenticated, (req, res) => res.render('tournamentsArchive'));
router.get('/data', ensureAuthenticated, getTournamentData);
router.get('/tournament/:name', ensureAuthenticated, getTournament);
router.get('/my-tournaments', ensureAuthenticated, (req, res) => res.render('myTournaments'));
router.get('/my-tournaments-data', ensureAuthenticated, getUserTournaments);
router.get('/new-tournament', ensureAuthenticated, (req, res) => res.render('newTournament'));
router.get('/join-tournament', ensureAuthenticated, (req, res) => res.render('joinTournament'));
router.get('/join-tournament-data', getJoinTournamentData);
router.get('/contract', ensureAuthenticated, getContract);
router.get('/addPlayer', ensureAuthenticated, addPlayer);
router.post('/new-tournament', ensureAuthenticated, createTournament);
router.post('/join-tournament', ensureAuthenticated, joinTournament);

module.exports = router;