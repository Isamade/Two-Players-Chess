import { Router } from 'express';
const router = Router();
import { authUser, signup, signin, signout } from '../controllers/authController.js';

import { forwardAuthenticated, ensureAuthenticated } from '../middlewares/index.js';

router.get('/', ensureAuthenticated, authUser);
router.get('/signin', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/signup', forwardAuthenticated, (req, res) => res.render('register'));
router.get('/signout', ensureAuthenticated, signout);
router.post('/signup', forwardAuthenticated, signup);
router.post('/signin', forwardAuthenticated, signin);

export default router;