'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Gp = mongoose.model('Gp'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Gp already exists';
				break;
			default:
				message = 'Something went wrong';
		}
	} else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Gp
 */
exports.create = function(req, res) {
	var gp = new Gp(req.body);
	gp.user = req.user;

	gp.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(gp);
		}
	});
};

/**
 * Show the current Gp
 */
exports.read = function(req, res) {
	res.jsonp(req.gp);
};

/**
 * Update a Gp
 */
exports.update = function(req, res) {
	var gp = req.gp ;

	gp = _.extend(gp , req.body);

	gp.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(gp);
		}
	});
};

/**
 * Delete an Gp
 */
exports.delete = function(req, res) {
	var gp = req.gp ;

	gp.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(gp);
		}
	});
};

/**
 * List of Gps
 */
exports.list = function(req, res) { Gp.find().sort('-created').populate('user', 'displayName').exec(function(err, gps) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(gps);
		}
	});
};

/**
 * Gp middleware
 */
exports.gpByID = function(req, res, next, id) { Gp.findById(id).populate('user', 'displayName').exec(function(err, gp) {
		if (err) return next(err);
		if (! gp) return next(new Error('Failed to load Gp ' + id));
		req.gp = gp ;
		next();
	});
};

/**
 * Gp authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.gp.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};