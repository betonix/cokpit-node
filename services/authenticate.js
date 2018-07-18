var connection = require('../config/dbconn');
var LocalStrategy     = require('passport-local').Strategy;

module.exports = function(passport) {
    passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true //passback entire req to call back
      } , function (req, username, password, done){
            console.log(username+' = '+ password);
            if(!username || !password ) { return done(null, false, req.flash('message','All fields are required.')); }
            var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
            connection.query("select * from tbl_users where username = ?", [username], function(err, rows){
                console.log(err);
              if (err) return done(req.flash('message',err));
      
              if(!rows.length){ return done(null, false, req.flash('message','Invalid username or password.')); }
              salt = salt+''+password;
              var encPassword = crypto.createHash('sha1').update(salt).digest('hex');
              var dbPassword  = rows[0].password;
              
              if(!(dbPassword == encPassword)){
                  return done(null, false, req.flash('message','Invalid username or password.'));
               }
               req.session.user = rows[0];
              return done(null, rows[0]);
            });
          }
      ));
      
      passport.serializeUser(function(user, done){
          done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done){
          connection.query("select * from tbl_users where id = "+ id, function (err, rows){
              done(err, rows[0]);
          });
      });
}














  