'use strict';

var controllers = require ('./controllers'),
  apiRouter = require ('express').Router ();

module.exports = function (app, passport) {
  //===============CORS==============================
  //=================================================

  app.use (function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
  });

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
    .use (controllers.isLoggedIn)
    .get ('/items', controllers.api.getItemList)
    .get ('/items/:itemId', controllers.api.getItemById)
    .post ('/create', controllers.api.createItem)
    .delete ('/delete/:itemId', controllers.api.deleteItem)
    .get ('/toggle_status/:itemId', controllers.api.toggleItemStatus)    //toggle status -> if item.active = true, item still needs to be completed, if item.active = false, it has been completed
    .get ('/postpone_notification/:itemId', controllers.api.postponeNotif);

    if (process.env.NODE_ENV === 'development') {
      apiRouter
        .get ('/delete/:itemId', controllers.api.deleteItem);
    }

  app.use ('/api', apiRouter);

  //===============404===============================
  //=================================================

  app.all ('*', controllers.notFound);

  return (app);
};
