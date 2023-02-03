module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    //req.flash('error_msg', 'Please log in to view that resource');
    res.redirect('/auth/signin');
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/pages/dashboard');
  },
  authorizeAdmin: function(req, res, next) {    
    try {
        const user = req.user;
        if (user.username === 'Admin') {
            return next();
        }
        res.redirect('/pages/dashboard');
      } catch {
        res.status(500).send('Server Error');
      }
  }
};