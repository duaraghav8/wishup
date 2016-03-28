var mongoose = require ('mongoose'),
  StatusCodes = require ('./StatusCodes'),
  userModel = mongoose.model ('users'),
  listModel = mongoose.model ('lists');

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
		username: req.user.facebook.displayName || req.user.local.email
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
    res.render ('404', {});
  }
  else { res.sendStatus (StatusCodes.NOT_FOUND); }
};

//===============API controllers===================
//=================================================
