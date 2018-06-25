// jshint esversion: 6
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const itemRouter = require('./routes/item');
const chatRouter = require('./routes/chat');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const passportSocketIo = require('passport.socketio');
const session = require('express-session');
const sessionStore = require('memorystore')(session);
const mongoose = require('mongoose');
const mongoDb = 'mongodb://localhost/ubaydev0';
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
let Offer = require('./models/offer');
let Notification = require('./models/notification');
let Item = require('./models/item');
let connectUsers = [];

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

io.on('connection', (socket) => {
  let roomId;
  let userID = socket.request.user.id;
  let username = socket.request.user.username;
  connectUsers.push(userID);
  console.log(connectUsers);
  console.log('Użytkownik się podłaczył:' + userID);
  socket.on('buy now', data => {
      let newOffer = new Offer();
      let notify = new Notification();
      Item
          .findById(data.itemId)
          .exec((err, item) => {
              newOffer.user = username;
              newOffer.price = item.price;
              newOffer.save();
              item.isFinished = true;
              item.bids.push(newOffer);
              notify.fromUser = username;
              notify.message = 'Sprzedałeś przedmiot ' + item.title; 
              notify.save();
              User
                  .findById(item.owner)
                  .exec((err, user) => {
                      user.notifications.push(notify);
                      user.hasUnread = true;
                      user.save();
                  });
              item.save();
          });
  });

  socket.on('make bid', data => {
      let newOffer = new Offer();
      let notify = new Notification();
      let username = socket.request.user.username;
      
      Item
          .findById(data.itemId)
          .exec((err, item) => {
                  newOffer.user = username;
                  newOffer.price = data.price;
                  if (data.price <= Math.max.apply(null, item.bids.map((bid) => bid.price))) {
                    socket.emit('too low price', {msg: 'Twoja oferta jest zbyt niska!'});
                    return;
                  }
                  newOffer.save();
                  item.bids.push(newOffer);
                  notify.formUser = username;
                  notify.message = 'Nowa oferta w:  ' + item.title;
                  notify.save();
                  User
                      .findById(item.owner)
                      .exec((err, user) => {
                          user.notifications.push(notify);
                          user.hasUnread = true;
                          user.save();
                  });
                  if (connectUsers.includes(item.owner)) {

                  }
                  item.save();
                  socket.emit('offer made');
          });
  });

  socket.on('read all', () => {
    User
        .findById(userID) 
        .exec((err, user) => {
            user.hasUnread = false;
            user.notifications.forEach(ntf => {
                ntf.isRead = true;
            });
            user.save();
        });
  });

  socket.on('user chat', (userId) => {
    roomId = userId;
    socket.room = roomId;
    socket.join(roomId);
    console.log('Nowy czat w pokoju ' + roomId);
  });

  socket.on('chat message', (msg) => {
    console.log('Nowa wiadomość');
    console.log(roomId);
    io.in(roomId).emit('new message', {message: msg.message, user: socket.request.user.username});
  }); 

  socket.on('disconnect', () => {
    console.log("Użytkowik się rozłaczył:" + userID);
    connectUsers.pop(userID);
  });
  
});
app.use((req, res, next) => {
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
app.use('/chat', chatRouter);
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

module.exports = {app: app, server: server, io: io};
