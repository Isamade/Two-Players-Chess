import * as path from 'path'
import { fileURLToPath } from 'url'
import express from 'express';
import session from 'express-session';
const app = express();
import bodyParser from 'body-parser';
const { json, urlencoded } = bodyParser;
import passport from 'passport';
import { connectSql } from './config/sdb.js';
import { connectContract } from './config/eth.js';
import connectDB from './config/mdb.js';
import Redis from './config/redis.js';
connectSql.connect();
connectContract();
connectDB();
Redis.connect();

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import pageRoutes from './routes/pageRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import tournamentRoutes from './routes/tournamentRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(json());
app.use(urlencoded({ extended: false }));

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

export default app;