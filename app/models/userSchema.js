'use strict';

/*
  Database name: wishup (config.dbURL)
  Collections:
    1. Collection of users: users (userSchema.js)
    2. Collection of all the to-do lists: lists (listSchema.js)
*/

var mongoose = require ('mongoose'),
  Schema = mongoose.Schema,
  userSchema = null, userModel = null;

userSchema = new Schema ({
  local: {
    email: {
      type: String
    },
    password: {
      type: String
    }
  },
  facebook: {
    id: {
      type: String
    },
    token: {
      type: String
    },
    displayName: {
      type: String
    }
  }
});
userModel = mongoose.model ('users', userSchema, 'users');
