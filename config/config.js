'use strict';

module.exports = {
  dbURL: 'mongodb://localhost:27017/wishup',
  sessionSecret: 'DoIWannaKnow',

  smtpUrl: 'smtps://<EMAIL>:<PASSWORD>@smtp.gmail.com',
  wishupEmailId: '',  //email
  wishupEmailPassword: '',  //password

  facebook: {
    clientID: '570197129796800',
    clientSecret: '8eb2c4d9dcd49cc7ddab9c0c97d4659e',
    callbackURL: 'http://localhost:8080/auth/facebook/callback'
  }

};
