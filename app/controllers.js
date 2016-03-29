var mongoose = require ('mongoose'),
  StatusCodes = require ('./StatusCodes'),
  userModel = mongoose.model ('users'),
  listModel = mongoose.model ('lists');

exports.api = {};

exports.getLoginPage = function (req, res) {
	if (req.user) {
		res.redirect ('/profile');
	}
	else {
		res.render ('index');
	}
};

exports.isLoggedIn = function (req, res, next) {
	if (req.isAuthenticated ()) {
		return (next ());
	}
	res.redirect ('/login');
};

exports.getUserProfile = function (req, res) {
/*	res.render ('profile', {
		username: req.user.username
	});*/
  res.send ('You profile motherfuckerzzz');
};

exports.logout = function (req, res) {
	req.logout ();
	//res.redirect ('/');
  res.send ('get the fuck out')
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
    //res.render ('404', {});
    res.send ('not fucking found fuck off');
  }
  else { res.sendStatus (StatusCodes.NOT_FOUND); }
};

//===============API controllers===================
//=================================================

exports.api.getItemList = function (req, res) {
  listModel.findOne ({_id: req.user.toDoList}, {items: 1}, function (err, items) {
    if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }
    res.status (StatusCodes.OK).json (items);
  });
};

/*
  //To be fixed

exports.api.getItemById = function (req, res) {
  console.log (req.params.itemId);
  listModel.findOne ({'items.id': mongoose.Types.ObjectId (req.params.itemId)}, function (err, item) {
    if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }
    console.log (item);
    return (res.json (item));
  });
};

*/

exports.api.createItem = function (req, res) {
  var newItem = req.body;
  if (!req.body.description) { return (res.sendStatus (StatusCodes.NOT_ACCEPTABLE)); }

  newItem.done = false;
  newItem.id = mongoose.Types.ObjectId ();

  listModel.update ({_id: req.user.toDoList}, {$push: {items: newItem}}, function (err, response) {
    if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }
    res.sendStatus (StatusCodes.OK);
  });
};

exports.api.deleteItem = function (req, res) {
  listModel.update ({_id: req.user.toDoList},
  {$pull: {items: {id: mongoose.Types.ObjectId (req.params.itemId)}}},
  function (err, response) {
    if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }
    return (res.sendStatus (StatusCodes.OK));
  });
};

/* To be written */
exports.api.toggleItemStatus = function (req, res) {
  listModel.findOne ({_id: req.user.toDoList}, function (err, list) {
    if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }

    var foundItem = list.items.filter (function (item) {
      if (item.id.toString () === req.params.itemId) { return (item); }
    }) [0];
    foundItem.done = !foundItem.done;
    console.log (list.items);

    list.save (function (err, response) {
      if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }
      console.log (response);
      return (res.sendStatus (StatusCodes.OK));
    });
  });
};
