'use strict';

/*
  Database name: wishup (config.dbURL)
  Collections:
    1. Collection of users: users (userSchema.js)
    2. Collection of all the to-do lists: lists (listSchema.js)
*/

var mongoose = require ('mongoose'),
  Schema = mongoose.Schema,
  listSchema = null, listModel = null;

listSchema = new Schema ({
  items: {
    type: Array,
  },
  user: {
    type: String,
    required: true
  }
});
listModel = mongoose.model ('lists', listSchema, 'lists');
