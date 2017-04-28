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

// view engine setup
app.set('views', path.join(__dirname +'/app/', 'views'));
app.set('view engine', 'html');
app.engine("html",require("ejs").renderFile);
app.locals.pretty = true;
app.set('x-powered-by', false)

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/admin', admin);
app.use('/users', users);

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
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

figlet('LPPAO Chang \n..\n by Chakrit Peungtokit', function (err, data) {
  if (err) {
    console.log('There are something went wrong... plz contact admin');
    console.dir(err);
    return;
  }
  console.log(data)
});

module.exports = app;
