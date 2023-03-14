export function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  //req.flash('error_msg', 'Please log in to view that resource');
  res.redirect('/auth/signin');
}
export function forwardAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/pages/dashboard');
}
export function authorizeAdmin(req, res, next) {
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