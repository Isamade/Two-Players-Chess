import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcryptjs from 'bcryptjs';
const { compare } = bcryptjs;
import User from '../models/User.js';

passport.use(new LocalStrategy(function (username, password, done) {
  User.findOne({username: username}, (err, user) => {
    if (err) { return done(err); }
    if (!user) {
      return done(null, false);
    }

    compare(password, user.password, (err, isMatch) => {
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

export default passport;

