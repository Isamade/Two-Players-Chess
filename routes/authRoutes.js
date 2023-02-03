const express = require('express');
const router = express.Router();
const {
    authUser,
    signup,
    signin,
    signout
} = require('../controllers/authController');

const { forwardAuthenticated, ensureAuthenticated } = require('../middlewares');

router.get('/', ensureAuthenticated, authUser);
router.get('/signin', forwardAuthenticated, (req, res) => res.render('login'));
router.get('/signup', forwardAuthenticated, (req, res) => res.render('register'));
router.get('/signout', ensureAuthenticated, signout);
router.post('/signup', forwardAuthenticated, signup);
router.post('/signin', forwardAuthenticated, signin);

module.exports = router;