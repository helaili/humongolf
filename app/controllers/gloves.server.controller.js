'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Glove = mongoose.model('Glove'),
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
				message = 'Glove already exists';
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
 * Create a Glove
 */
exports.create = function(req, res) {
	var glove = new Glove(req.body);
	glove.user = req.user;

	glove.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(glove);
		}
	});
};

/**
 * Show the current Glove
 */
exports.read = function(req, res) {
	res.jsonp(req.glove);
};

/**
 * Update a Glove
 */
exports.update = function(req, res) {
	var glove = req.glove ;

	glove = _.extend(glove , req.body);

	glove.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(glove);
		}
	});
};

/**
 * Delete an Glove
 */
exports.delete = function(req, res) {
	var glove = req.glove ;

	glove.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(glove);
		}
	});
};

/**
 * List of Gloves
 */
exports.list = function(req, res) { Glove.find().sort('-created').populate('user', 'displayName').exec(function(err, gloves) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(gloves);
		}
	});
};

/**
 * Glove middleware
 */
exports.gloveByID = function(req, res, next, id) { Glove.findById(id).populate('user', 'displayName').exec(function(err, glove) {
		if (err) return next(err);
		if (! glove) return next(new Error('Failed to load Glove ' + id));
		req.glove = glove ;
		next();
	});
};

/**
 * Glove authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.glove.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};