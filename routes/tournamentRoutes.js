import { Router } from 'express';
const router = Router();
import TournamentController from '../controllers/tournamentController.js';
import UserController from '../controllers/userController.js';

import { ensureAuthenticated } from '../middlewares/index.js';

router.get('/', ensureAuthenticated, (req, res) => res.render('tournaments'));
router.get('/archive', ensureAuthenticated, (req, res) => res.render('tournamentsArchive'));
router.get('/data', ensureAuthenticated, TournamentController.getTournamentData);
router.get('/tournament/:name', ensureAuthenticated, TournamentController.getTournament);
router.get('/my-tournaments', ensureAuthenticated, (req, res) => res.render('myTournaments'));
router.get('/my-tournaments-data', ensureAuthenticated, UserController.getUserTournaments);
router.get('/new-tournament', ensureAuthenticated, (req, res) => res.render('newTournament'));
router.get('/join-tournament', ensureAuthenticated, (req, res) => res.render('joinTournament'));
router.get('/join-tournament-data', TournamentController.getJoinTournamentData);
router.get('/contract', ensureAuthenticated, TournamentController.getContract);
router.get('/addPlayer', ensureAuthenticated, TournamentController.addPlayer);
router.post('/new-tournament', ensureAuthenticated, TournamentController.createTournament);
router.post('/join-tournament', ensureAuthenticated, TournamentController.joinTournament);

export default router;