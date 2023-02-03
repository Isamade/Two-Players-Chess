const path = require('path');
const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const { connectSql } = require('./config/sdb');
const { connectContract } = require('./config/eth');
const connectDB = require('./config/mdb');
connectSql.connect();
connectContract();
connectDB();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const pageRoutes = require('./routes/pageRoutes');
const gameRoutes = require('./routes/gameRoutes');
const tournamentRoutes = require('./routes/tournamentRoutes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname + '/views'));
app.set('view engine', 'ejs');
//app.use(express.urlencoded({ extended: true}));

app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
//app.use(passport.authenticate('session'));

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/pages', pageRoutes);
app.use('/games', gameRoutes);
app.use('/tournaments', tournamentRoutes);

app.get('/', (req, res) => {
    res.redirect('/auth/signup');
});

module.exports = app;