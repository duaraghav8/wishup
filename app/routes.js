'use strict';

var controllers = require ('./controllers'),
  apiRouter = require ('express').Router ();

module.exports = function (app, passport) {
  //===============Static Pages======================
  //=================================================

  app
    .get ('/', controllers.getLoginPage)
    .get ('/login', controllers.getLoginPage)
    .post ('/login', passport.authenticate ('local_login', {
      successRedirect: '/profile',
      failureRedirect: '/login'
    }))
    .get ('/profile', controllers.isLoggedIn, controllers.getUserProfile)
		.get ('/logout', controllers.isLoggedIn, controllers.logout)
    .get ('/signup', controllers.getSignupPage)
    .post ('/signup', passport.authenticate ('local_signup', {
      successRedirect: '/profile',
      failureRedirect: '/signup'
    }));

  //===============facebook==========================
  //=================================================

  app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
      successRedirect : '/profile',
      failureRedirect : '/'
    })
  );

  //===============API Routes========================
  //=================================================

  apiRouter
    .use (controllers.isLoggedIn);
    // add other API routes here

  app.use ('/api', apiRouter);

  //===============404===============================
  //=================================================

  app.all ('*', controllers.notFound);

  return (app);
};
