'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Rangefinder = mongoose.model('Rangefinder'),
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
				message = 'Rangefinder already exists';
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
 * Create a Rangefinder
 */
exports.create = function(req, res) {
	var rangefinder = new Rangefinder(req.body);
	rangefinder.user = req.user;

	rangefinder.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(rangefinder);
		}
	});
};

/**
 * Show the current Rangefinder
 */
exports.read = function(req, res) {
	res.jsonp(req.rangefinder);
};

/**
 * Update a Rangefinder
 */
exports.update = function(req, res) {
	var rangefinder = req.rangefinder ;

	rangefinder = _.extend(rangefinder , req.body);

	rangefinder.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(rangefinder);
		}
	});
};

/**
 * Delete an Rangefinder
 */
exports.delete = function(req, res) {
	var rangefinder = req.rangefinder ;

	rangefinder.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(rangefinder);
		}
	});
};

/**
 * List of Rangefinders
 */
exports.list = function(req, res) { Rangefinder.find().sort('-created').populate('user', 'displayName').exec(function(err, rangefinders) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(rangefinders);
		}
	});
};

/**
 * Rangefinder middleware
 */
exports.rangefinderByID = function(req, res, next, id) { Rangefinder.findById(id).populate('user', 'displayName').exec(function(err, rangefinder) {
		if (err) return next(err);
		if (! rangefinder) return next(new Error('Failed to load Rangefinder ' + id));
		req.rangefinder = rangefinder ;
		next();
	});
};

/**
 * Rangefinder authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.rangefinder.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};