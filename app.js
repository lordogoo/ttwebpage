const createError = require('http-errors');
const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');



/******************************
helpers
*******************************/

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

var getClientIp = function(req) {
    return (req.headers["X-Forwarded-For"] ||
            req.headers["x-forwarded-for"] ||
            '').split(',')[0] ||
           req.client.remoteAddress;
};

/******************************
routes
*******************************/

var indexRouter = require('./routes/index');
var newsRouter = require('./routes/news');
var gamesRouter = require('./routes/games');
var writingRouter = require('./routes/writing');
var toolsRouter = require('./routes/tools');
var aboutRouter = require('./routes/about');

var app = express();

const oneDay = 1000 * 60 * 60 * 24;
app.set('trust proxy', 1);
app.use(session({
  secret: 'cat beast',
  resave: false,
  saveUninitialized: true,
  cookie: { 
	    maxAge: oneDay 
  }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/news', newsRouter);
app.use('/games', gamesRouter);
app.use('/writing', writingRouter);
app.use('/tools', toolsRouter);
app.use('/about', aboutRouter);

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
console.log("server running");
/*
var server = app.listen(3456, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('running at http://' + host + ':' + port)
});
*/
