const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

passport.use(new LocalStrategy(function (username, password, done) {
  User.findOne({username: username}, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false);
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false)
      }
    })
  })
}));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
      return done(err, user);
    })
});

module.exports = passport;

