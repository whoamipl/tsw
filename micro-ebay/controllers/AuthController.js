// jshint esversion: 6
let mongoose = require("mongoose");
let passport = require("passport");
let User = require("../models/user");

let userController = {};

const passportConfig = { 
    failureRedirect: '/login' 
};

// Restrict access to root page
userController.home = (req, res) => {
  res.render('index', { user : req.user });
};

// Go to registration page
userController.register = (req, res) => {
  res.render('register');
};

// Post registration
userController.doRegister = (req, res) => {
  User.register(new User({ username : req.body.username, name: req.body.name }), req.body.password, function(err, user) {
    if (err) {
      return res.render('register', { user : user });
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