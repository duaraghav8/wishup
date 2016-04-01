'use strict';

var app = require ('./config/express') (),
  listener = null;

process.env.NODE_ENV = 'development';
listener = app.listen (process.env.PORT || 8085, function () {
  console.log ('Server listening on port: ', listener.address ().port);
});
