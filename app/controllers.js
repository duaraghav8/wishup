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

exports.api.createItem = function (req, res) {
  var newItem = req.body;

  if (!req.body.description) { return (res.sendStatus (StatusCodes.NOT_ACCEPTABLE)); }
  newItem.done = false;

  listModel.findOne ({_id: req.user.toDoList}, function (err, list) {
    if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }

    newItem.id = list.items.length + 1;
    list.items.push (newItem);
    list.save (function (err) {
      if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }
      return (res.sendStatus (StatusCodes.CREATED));
    });
  });

/*  listModel.update ({_id: req.user.toDoList}, {$push: {items: newItem}}, function (err, response) {
    if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }
    res.sendStatus (StatusCodes.OK);
  });*/
};

exports.api.deleteItem = function (req, res) {
  listModel.update ({_id: req.user.toDoList}, {$pull: {items: {id: parseInt (req.params.itemId)}}}, function (err) {
    if (err) { return (res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR)); }
    return (res.sendStatus (StatusCodes.OK));
  });
};

exports.api.toggleItemStatus = function (req, res) {};
