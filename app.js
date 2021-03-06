require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const boolParser = require('express-query-boolean');
const favicon = require('serve-favicon');
const session = require('express-session');
const logger = require('morgan');
const uuid = require('node-uuid');

var index = require('./app/routes/index');
var admin = require('./app/routes/admin');
var users = require('./app/routes/users');

var figlet = require('figlet');

var app = express();

let _ = require('lodash')

// view engine setup
app.set('views', path.join(__dirname +'/app/', 'views'));
app.set('view engine', 'html');
app.engine("html",require("ejs").renderFile);
app.locals.pretty = true;
app.set('x-powered-by', false)

app.use(session({
  secret: 'ecrapp2017', 
  resave: true, 
  saveUninitialized: true,
  maxAge: Date.now() + (30 * 60 * 1000)
}));
app.use(function(req, res, next){
  res.locals.session = req.session;
  next();
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/admin', checkAdminAuth, admin);
app.use('/users', checkUsersAuth, users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

figlet('ECRApp LPPAO Chang \n..\n by Chakrit Peungtokit', function (err, data) {
  if (err) {
    console.log('There are something went wrong... plz contact admin');
    console.dir(err);
    return;
  }
  console.log(data)
});

function checkAdminAuth(req, res, next) {
  if (!req.session || _.isUndefined(req.session.isLogin) || !_.eq(req.session.isLogin, true) || !_.eq(req.session.userRole, '10')) {
    res.redirect('/login/')
  } else {
    next();
  }
}

function checkUsersAuth(req, res, next) {
  if (!req.session || _.isUndefined(req.session.isLogin) || !_.eq(req.session.isLogin, true) || !_.eq(req.session.userRole, '20')) {
    res.redirect('/login/')
  } else {
    next();
  }
}

module.exports = app;
