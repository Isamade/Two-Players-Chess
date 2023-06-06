import bcryptjs from 'bcryptjs';
const { genSalt, hash: _hash} = bcryptjs;
import passport from '../config/passport.js';
import User from '../models/User.js';
import { eventEmitter } from '../config/postgres.js';

export async function authUser(req, res) {
  try {
    //console.log("reqUser", req.user);
    const user = req.user;
    //res.json({username});
    res.send({user});
  } catch {
    res.status(500).send('Server Error');
  }
}

export async function signup(req, res) {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
          return res
            .status(400)
            .json({ errors: [{ msg: 'User already exists' }] });
        }

        user = new User({ username, email, password });
        genSalt(10, (err, salt) => {
            _hash(user.password, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;
              user
                .save()
                .then(user => {
                  (username !== 'Admin') && eventEmitter.emit('addUser', user.username);
                  res.redirect('/auth/signin');
                })
                .catch(err => console.log(err));
            });
        });

    } catch (err) {
        console.error(err.message);
        return res
            .status(500)
            .json({message: 'Something went wrong. Try again'});
    }
}

export async function signin(req, res) {
    passport.authenticate('local', {
      successRedirect: '/pages/dashboard',
      failureRedirect: '/auth/signin'
    })(req, res);
}


export async function signout(req, res) {
  try {
    req.logout();
    res.redirect('/auth/signin');
  }
  catch(err) {
    console.log(err);
  }
}



/*
const token = jwt.sign({ name, email, password }, process.env.JWT_ACCOUNT_ACTIVATION, { expiresIn: 360000 });
user.save((err, user) => {
    if (err) {
        return res.status(401).json({
            error: errorHandler(err)
        });
    }
    const token = jwt.sign({ _id: user._id }, 'mysecret', { expiresIn: 360000 });


    return res
        .json({username, token});
    return res
        .status(201)
        .send({username, token});
    return res.redirect('/dashboard');
    res.end();
});


exports.signin = async (req, res) => {
    const { email, password } = req.body;
    // check if user exist
    User.findOne({ email }).exec((err, user) => {
        if(err) {
          res.status(500).send('Server error');
        }
        if (!user) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
        // authenticate
        if (!user.authenticate(password)) {
            return res.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
        }
        // generate a token and send to client
        const token = jwt.sign({ _id: user._id }, 'mysecret', { expiresIn: 360000 });

        return res.json({
            token
        });
    });
};
*/