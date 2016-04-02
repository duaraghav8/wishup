'use strict';

var localStrategy = require ('passport-local').Strategy,
    facebookStrategy = require ('passport-facebook').Strategy,
    mongoose = require ('mongoose'),
    config = require ('./config'),
    userModel = mongoose.model ('users'),
    listModel = mongoose.model ('lists'),
    requiredFields = {username: 1, _id: 1, toDoList: 1};

module.exports = function (passport) {
  passport.serializeUser (function (user, done) {
		done (null, user.id);
	});
	passport.deserializeUser (function (id, done) {
		userModel.findById (id, function (err, user) {
			done (err, user);
		});
	});

  //===============Local Login Strategy==========================
  //=============================================================
  passport.use ('local_login', new localStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, email, password, done) {
    userModel.findOne ({'local.email': email, 'local.password': password}, requiredFields, function (err, response) {
      if (err) {
        return (done (err));
      }
      else if (response) {
        return (done (null, response));
      }
      return (done (null, false));
    });
  }));

  //===============Local signup Strategy=============
  //=================================================

  passport.use ('local_signup', new localStrategy ({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function (req, email, password, done) {
    process.nextTick (function () {
      userModel.findOne ({'local.email': email}, {_id: 1}, function (err, response) {
        if (err) {
          return (done (err));
        }
        else if (response) {
          return (done (null, false));
        }
        else {
          var newUser = new userModel (),
            newToDoList = new listModel ();

          newUser.local.email = email;
          newUser.local.password = password;
          newUser.username = email.split ('@') [0];
          newUser.toDoList = '';

          newUser.save (function (err) {
            if (err) { throw (err); }
            else {
              newToDoList.user = newUser._id;
              newToDoList.items = [];

              newToDoList.save (function (err) {
                if (err) { throw (err); }
                userModel.update ({_id: newUser._id}, {$set: {toDoList: newToDoList._id}}, function (err) {
                  if (err) { throw (err); }
                  return done(null, newUser);
                });
              });
            }
          });
        }
      });
    });
  }));

  //========facebook Signup+Login Strategy===========
  //=================================================
  passport.use (new facebookStrategy ({
    clientID: config.facebook.clientID, // your App ID
    clientSecret: config.facebook.clientSecret, // your App Secret
    //callbackURL: 'http://localhost:8080/auth/facebook/callback'
    callbackURL: config.facebook.callbackURL
  },
  function (token, refreshToken, profile, done) {
    process.nextTick (function () {
      userModel.findOne ({'facebook.id': profile.id}, requiredFields, function (err, response) {
        if (err) {
          return (done (err));
        }
        else if (response) {
          return (done (null, response));
        }
        else {
          var newUser = new userModel (),
            newToDoList = new listModel ();

          newUser.facebook.id    = profile.id; // set the users facebook id
          newUser.facebook.token = token; // we will save the token that facebook provides to the user
          newUser.facebook.displayName  = profile.displayName; // look at the passport user profile to see how names are returned
          newUser.username = profile.displayName;
          newUser.toDoList = '';

          // save our user to the database
          newUser.save(function(err) {
            if (err) { throw (err); }

            // if successful, create the user's to do list and then return the new user
            newToDoList.user = newUser._id;
            newToDoList.items = [];

            newToDoList.save (function (err) {
              if (err) { throw (err); }
              userModel.update ({_id: newUser._id}, {$set: {toDoList: newToDoList._id}}, function (err) {
                if (err) { throw (err); }
                return done(null, newUser);
              });
            });
          });
        }
      });
    });
  }));
};

//the Callback Hell strikes again :-S
