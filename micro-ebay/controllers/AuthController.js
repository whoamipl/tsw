// jshint esversion: 6
let mongoose = require("mongoose");
let passport = require("passport");
let User = require("../models/user");
let Item = require("../models/item");

let userController = {};

const passportConfig = { 
    failureRedirect: '/login' 
};

// Restrict access to root page
userController.home = (req, res) => {
  Item
    .find()
    .sort({dateStart: 'desc'})
    .limit(4)
    .exec((err, items) => {
      res.render('index', { user : req.user, items: items });
    });
  };
// Go to registrtion page
userController.register = (req, res) => {
  res.render('register');
};

// Post registration
userController.doRegister = (req, res) => {
  User.register(new User({
     username : req.body.username, 
     firstName: req.body.firstname,
     lastName: req.body.lastname,
     eMail: req.body.email,
     phoneNumber: req.body.phonenumber
    }), req.body.password, function(err, user) {
    if (err) {
      if (err.name == "UserExistsError")
        return res.render('register', {message : "Taki użytkownik już istnieje!"});
      else if (err.name == "MissingPasswordError")
        return res.render('register', {message : "Nie podano hasła!"});
      else if (err.name == "MissingUsernameError")
        return res.render('register', {message : "Nie podano nazwy użytkownika!"});
      else {
        return res.render('register', {message : "Nieznany błąd!"});
      }
    }

    passport.authenticate('local')(req, res,() => {
      res.redirect('/');
    });
  });
};

// Go to login page
userController.login = (req, res) => {
  res.render('login');
};

// Post login
userController.doLogin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
          return res.render('login', { message: 'Niepoprawny login lub hasło'});
        }
        req.logIn(user, function(err) {
          if (err) { return next(err); }
          return res.redirect('/');
        });
      })(req, res, next);
};

// logout
userController.logout = (req, res) => {
  req.logout();
  res.redirect('/');
};

module.exports = userController;