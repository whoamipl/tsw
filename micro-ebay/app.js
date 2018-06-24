// jshint esversion: 6
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const itemRouter = require('./routes/item');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const passportSocketIo = require('passport.socketio');
const session = require('express-session');
const sessionStore = require('memorystore')(session);
const mongoose = require('mongoose');
const mongoDb = 'mongodb://localhost/ubaydev3';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

mongoose.connect(mongoDb)
  .then(() => console.log('Connection to database successful'))
  .catch(err => console.log(err));

mongoose.Promise = global.Promise;

let db = mongoose.connection;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const sessionSecret = 'EE26B0DD4AF7E749AA1A8EE3C10AE9923F618980772E473F8819A5D49';
const sessionKey = 'express.sid';
const sessionStorage = new sessionStore({
  checkPeriod: 86400000
});

app.use(session({
  key : sessionKey,
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  store: sessionStorage
}));

app.use(passport.initialize());
app.use(passport.session());

let User = require(path.join(__dirname, 'models/user'));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const onAuthorizeSuccess = (data, accept) => {
  console.log('Udane połaczenie z socket.io');
  accept();
};

const onAuthorizeFail = (data, message, error, accept) => {
  if (error) {
    throw new Error(message);
  }
  console.log('Nieudane połaczenie z socket.io');
  accept(new Error('Brak autoryzacji'));
};

io.use(passportSocketIo.authorize({
  cookieParser: cookieParser,
  key: sessionKey,
  secret: sessionSecret,
  success: onAuthorizeSuccess,
  fail: onAuthorizeFail,
  store: sessionStorage
}));

app.use((req, res, next) => {
  res.io = io;
  res.locals.createPagination = function (pages, page) {
    let url = require('url');
    let qs = require('querystring');
    let params = qs.parse(url.parse(req.url).query);
    let paginationList = '';
    
    params.page = 0;
    paginationList += '<li class="page-item"><a href="?'+qs.stringify(params)+'" class="page-link">Pierwsza</a></li>';
    for (var p = 1; p < pages; p++) {
      params.page = p;
      paginationList += '<li class="page-item"><a href="?'+qs.stringify(params)+'"class="page-link">'+ p +'</a></li>';
    }
    params.page = --p;
    paginationList += '<li class="page-item"><a href="?'+qs.stringify(params)+'" class="page-link" >Ostatnia</a></li>';
  
    return paginationList;
  };
  next();
});

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/item', itemRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};
