'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Featurette = mongoose.model('Featurette'),
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
				message = 'Featurette already exists';
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
 * Create a Featurette
 */
exports.create = function(req, res) {
	var featurette = new Featurette(req.body);

	featurette.user = req.user;

	featurette.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(featurette);
		}
	});
};

/**
 * Show the current Featurette
 */
exports.read = function(req, res) {
	res.jsonp(req.featurette);
};

/**
 * Update a Featurette
 */
exports.update = function(req, res) {
	var featurette = req.featurette ;

	featurette = _.extend(featurette , req.body);

	featurette.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(featurette);
		}
	});
};

/**
 * Delete an Featurette
 */
exports.delete = function(req, res) {
	var featurette = req.featurette ;

	featurette.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(featurette);
		}
	});
};

/**
 * List of Featurettes
 */
exports.list = function(req, res) { Featurette.find().sort('+position').populate('user', 'displayName').exec(function(err, featurettes) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(featurettes);
		}
	});
};



/**
 * List of Enabled Featurettes
 */
exports.listEnabled = function(req, res) { Featurette.find({enabled : true}).sort('+position').exec(function(err, featurettes) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(featurettes);
		}
	});
};



/**
 * Featurette middleware
 */
exports.featuretteByID = function(req, res, next, id) { Featurette.findById(id).populate('user', 'displayName').exec(function(err, featurette) {
		if (err) return next(err);
		if (! featurette) return next(new Error('Failed to load Featurette ' + id));
		req.featurette = featurette ;
		next();
	});
};

/**
 * Featurette authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.featurette.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};