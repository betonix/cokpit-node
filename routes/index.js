var express = require('express');
var router = express.Router();

/* GET user information after login */

router.get('/', function(req, res, next) {

  /*var username   = req.session.user.username;
  var full_name  = req.session.user.full_name;
  
  res.render('index', { username: username, full_name: full_name });*/
  res.render('index');
});

function isAuthenticated(req, res, next) {
  if (req.session.user)
      return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SIGNIN PAGE
  res.redirect('/login');
}

module.exports = router;