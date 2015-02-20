'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Ball = mongoose.model('Ball'),
	_ = require('lodash');


var ballBrands = null;

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
			case 11000:
			case 11001:
				message = 'Ball already exists';
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
 * Create a Ball
 */
exports.create = function(req, res) {
	var ball = new Ball(req.body);
	ball.user = req.user;

	ball.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(ball);
		}
	});
};

/**
 * Show the current Ball
 */
exports.read = function(req, res) {
	res.jsonp(req.ball);
};

/**
 * Update a Ball
 */
exports.update = function(req, res) {
	var ball = req.ball ;

	ball = _.extend(ball , req.body);

	ball.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(ball);
		}
	});
};

exports.setProperties = function(req, res) {
	//mongoose.set('debug', true);
	var where = {'_id' : req.ball._id};
	var setValues = req.body;
	delete setValues._id;

	Ball.where(where).setOptions({ multi: false }).update({ $set: setValues}, function(err, numberAffected, raw) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			return res.send(200, raw);
		}
	});
};

/**
 * Delete an Ball
 */
exports.delete = function(req, res) {
	var ball = req.ball ;

	ball.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(ball);
		}
	});
};

/**
 * List of Balls
 */
exports.list = function(req, res) { 

	var filterFromQuery = JSON.parse(req.query.filters);
	var query = Ball.find();

	if(filterFromQuery.hasOwnProperty('published')) {
		query.where('published').equals(filterFromQuery.published);
	}
	
	if(filterFromQuery.hasOwnProperty('brands')) {
		query.where('brand').in(filterFromQuery.brands);
	}


	query.sort('-created').populate('user', 'displayName').exec(function(err, balls) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(balls);
		}
	});
};

/**
 * List of Balls
 */
exports.listAll = function(req, res) { 
	var query = Ball.find();
	console.log('************ listAll ************');
	query.sort('-fullname').exec(function(err, balls) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			res.jsonp(balls);
		}
	});
};



/**
 * List of brands
 */
exports.listBrands = function(req, res) { 
	if(ballBrands === null) {
		Ball.distinct({'published': true}, 'brand').exec(function(err, balls) {
			if (err) {
				return res.send(400, {
					message: getErrorMessage(err)
				});
			} else {
				ballBrands = balls;
				res.jsonp(balls);
			}
		});
	} else {
		res.jsonp(ballBrands);
	}
};




/**
 * Ball middleware
 */
exports.ballByID = function(req, res, next, id) { 
	Ball.findById(id).populate('user', 'displayName').exec(function(err, ball) {
		if (err) return next(err);
		if (! ball) return next(new Error('Failed to load Ball ' + id));
		req.ball = ball ;
		next();
	});
};

/**
 * Ball authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if(req.user.roles.indexOf('admin') >= 0) {
		next();
	} else if (req.ball.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	} else {
		next();
	}
};

exports.sameBall = function(req, res) {
	if(req.body.length >= 2) {
		var virtualBallJSON = JSON.parse(JSON.stringify(req.body[0]));
		delete virtualBallJSON._id;
		virtualBallJSON.virtual = true;
		virtualBallJSON.published = true;

		var virtualBall = new Ball(virtualBallJSON);
		console.log(virtualBall);

		virtualBall.save(function (err) {
  			if (err) {
  				console.log(err);
  				return res.send(400, {message: err});
  			}
  			console.log(virtualBall._id);
  		});

  		/*
		var virtualBallID; 

		var ids = [];

		for(var counter = 0; counter < req.body.length; counter++) {
			ids.push(req.body[counter]._id);
		}
		
		Ball.where({'_id' : {'$in' : ids}}).update({ $set: {'virtualParent' : virtualBallID, published : false}}, function(err, numberAffected, raw) {
			if (err) {
				return res.send(400, {
					message: getErrorMessage(err)
				});
			}
		});
*/

	}
	return res.send(200, {'ok' : true});
};


exports.differentColor = function(req, res) {
	if(req.body.length >= 2) {
		for(var counter = 0; counter < req.body.length; counter++) {
			var currentBall = req.body[counter];
			for(var sameCounter = 0; sameCounter < req.body.length; sameCounter++) {
				if(currentBall._id !== req.body[sameCounter]._id) {
					currentBall.differentColorAs.push(req.body[sameCounter]._id);
				}
			}
			Ball.where({'_id' : currentBall._id}).update({ $set: {'differentColorAs' : currentBall.differentColorAs}}, function(err, numberAffected, raw) {
				if (err) {
					return res.send(400, {
						message: getErrorMessage(err)
					});
				}
			});
		}
	}
	return res.send(200, {'ok' : true});
};
