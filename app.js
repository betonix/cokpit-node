var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var flash             = require('connect-flash');

var crypto            = require('crypto');

var passport          = require('passport');

var sess              = require('express-session');

var Store             = require('express-session').Store;
 
var BetterMemoryStore = require(__dirname + '/memory');

var store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true });
var app = express();

 app.use(sess({

    name: 'JSESSION',

    secret: 'MYSECRETISVERYSECRET',

    store:  store,

    resave: true,

    saveUninitialized: true

}));

app.use(flash());

app.use(passport.initialize());

app.use(passport.session());

var indexRouter = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./services/authenticate.js')(passport);

app.get('/login', function(req, res){
  res.render('login',{'message' :req.flash('message')});
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
