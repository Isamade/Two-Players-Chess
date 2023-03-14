import { Router } from 'express';
const router = Router();

import { ensureAuthenticated } from '../middlewares/index.js';

router.get('/new-game', ensureAuthenticated, (req, res) => res.render('newGame'));
router.get('/join-game', ensureAuthenticated, (req, res) => res.render('joinGame'));
router.get('/continue-game', ensureAuthenticated, (req, res) => res.render('continueGame'));
router.get('/load-game', ensureAuthenticated, (req, res) => res.render('loadGame'));
router.get('/watch-game', ensureAuthenticated, (req, res) => res.render('watchGame'));
router.get('/review-game', ensureAuthenticated, (req, res) => res.render('reviewGame'));

export default router;