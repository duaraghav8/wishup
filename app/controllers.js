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
	res.render ('profile', {
		username: req.user.username;
	});
  //res.send ('You profile motherfuckerzzz');
};

exports.logout = function (req, res) {
	req.logout ();
	res.redirect ('/');
  //res.send ('get the fuck out')
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
    res.render ('404', {});
    //res.send ('not fucking found fuck off');
  }
  else { res.sendStatus (StatusCodes.NOT_FOUND); }
};

//===============API controllers===================
//=================================================

exports.api.getItemList = function (req, res) {
  listModel.findOne ({_id: req.user.toDoList}, {items: 1}, function (err, items) {
    if (err) { res.sendStatus (StatusCodes.INTERNAL_SERVER_ERROR); }
    res.status (StatusCodes.OK).json (items);
  });
};
