'use strict';

var mongoose = require ('mongoose'),
  StatusCodes = require ('./StatusCodes'),
  Cron = require ('./cron/cron'),
  userModel = mongoose.model ('users'),
  listModel = mongoose.model ('lists');

exports.api = {};

exports.getLoginPage = function (req, res) {
	if (req.user) {
		res.redirect ('/profile');
	}
	else {
		res.render ('login', {});
	}
};

exports.isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated ()) {
		return (next ());
	}
	res.redirect ('/login');
};

exports.getUserProfile = function (req, res) {
	res.render ('profile', {
		username: req.user.username
	});
};

exports.logout = function (req, res) {
	req.logout ();
	res.redirect ('/');
};

exports.getSignupPage = function (req, res) {
	if (req.user) {
		res.redirect ('/profile');
	}
	else {
		res.render ('signup');
	}
};

exports.notFound = function (req, res) {
  if (req.accepts ('html')) {
    res.render ('404', {ErrorMessage: 'Page Not Found'});
  }
  else { res.sendStatus (StatusCodes.NOT_FOUND); }
};

//===============API controllers===================
//=================================================

exports.api.getItemList = function (req, res) {
  listModel.findOne ({_id: req.user.toDoList}, {items: 1, _id: 0}, function (err, list) {
    if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }
    return (res.status (StatusCodes.OK).json (list.items));
  });
};

exports.api.getItemById = function (req, res) {
  listModel.findOne ({_id: req.user.toDoList}, function (err, list) {
    if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }
    else if (!list) { return (res.sendStatus (StatusCodes.NOT_FOUND)); }

    return (res.json (
      list.items.filter (function (item) {
        if (item.id.toString () === req.params.itemId) { return (item); }
      }) [0]
    ));
  });
};

exports.api.createItem = function (req, res) {
  var newItem = req.body,
  now = new Date (), itemDeadline = new Date (req.body.deadline);

  /*
    providing description & deadline mandatory, location optional.
    Also, make sure the date provided is not a past date (becase I haven't built a fucking time machine yet)
  */
  if (!(req.body.description && req.body.deadline) || now > itemDeadline) {
    return (res.sendStatus (StatusCodes.NOT_ACCEPTABLE));
  }

  newItem.done = false;
  newItem.id = mongoose.Types.ObjectId ();

  listModel.update ({_id: req.user.toDoList}, {$push: {items: newItem}}, function (err) {
    var thisItem = newItem;
    if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }

    //create a reminder job for this new item, so our client doesn't fuck up by not buying anniversary gift for wife on way back
    thisItem.recipient = req.user.local.email;  //not error proof
    Cron.setReminder (newItem);
    return (res.sendStatus (StatusCodes.OK));
  });
};

exports.api.deleteItem = function (req, res) {
  listModel.update ({_id: req.user.toDoList},
    {$pull: {items: {id: mongoose.Types.ObjectId (req.params.itemId)}}},
    function (err, response) {
      if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }
      return (res.sendStatus (StatusCodes.OK));
    }
  );
};

exports.api.toggleItemStatus = function (req, res) {
  listModel.findOne ({_id: req.user.toDoList}, function (err, list) {
    if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }

    var foundItem = list.items.filter (function (item) {
      if (item.id.toString () === req.params.itemId) { return (item); }
    }) [0];
    foundItem.done = !foundItem.done;
    //console.log (list.items);

    /*list.save (function (err, response) {
      if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }
      console.log (response);
      return (res.sendStatus (StatusCodes.OK));
    });*/
    
    listModel.update ({_id: list._id}, {$set: {items: list.items}}, {upsert: true}, function (err, response) {
      if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }
      //console.log (response);
      return (res.sendStatus (StatusCodes.OK));
    });
  });
};

/*
  To be tested
*/
exports.api.postponeNotif = function (req, res) {
  function date2String (dateObject) {
    return (
      dateObject.getMonth () + '/' + dateObject.getDate () + '/' + dateObject.getFullYear () +
      ' ' + dateObject.getHours () + ':' + dateObject.getMinutes ()
    );
  };

  listModel.findOne ({_id: req.user.toDoList}, function (err, list) {
    if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }
    if (!list) { return (res.sendStatus (StatusCodes.NOT_FOUND)); }

    var date = null, foundItem = list.items.filter (function (item) {
      if (item.id.toString () === req.params.itemId) { return (item); }
    }) [0];

    date = new Date (foundItem.deadline);
    date.setDate (date.getDate () + 1);
    foundItem.deadline = date2String (date);

    list.save (function (err) {
      if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }
      Cron.setReminder (foundItem);
    });
  });
};
