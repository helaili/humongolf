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


	query.exec(function(err, balls) {
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
	query.sort('brand name color').exec(function(err, balls) {
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


/*
 * Merge several balls in one, update the ball collection and the importedBall collection
 */
exports.merge = function(req, res) {
	//Expecting an array of balls
	if(req.body.length >= 2) {
		//Let's use the first ball as a starting point
		var firstBall = req.body[0];


		var ballsId = [];
		var importedBallsId = [];
		ballsId.push(mongoose.Types.ObjectId(firstBall._id));



		//Intilize the price if it doesn't exist so the merge and computations are easier
		if(firstBall.price == null) {
			firstBall.price = {};

			//These values will be overidden by actual max and min
			firstBall.price.min = 9999999;
			firstBall.price.max = -1;
		}

		//Merging the different arrays
		for(var counter = 1; counter < req.body.length; counter++) {
			var currentBall = req.body[counter];
			ballsId.push(mongoose.Types.ObjectId(currentBall._id));

			if(currentBall.benchmarks != null && firstBall.benchmarks != null) {
				firstBall.benchmarks = firstBall.benchmarks.concat(currentBall.benchmarks);
			} else if(currentBall.benchmarks != null) {
				firstBall.benchmarks = currentBall.benchmarks;
			}
		}


		//Recalculating the prices & building the array of imported balls id
		var sum = 0;
		for(var benchmarksCounter=0; benchmarksCounter < firstBall.benchmarks.length; benchmarksCounter ++) {
			sum += firstBall.benchmarks[benchmarksCounter].price;
			firstBall.price.min = Math.min(firstBall.price.min,  firstBall.benchmarks[benchmarksCounter].price);
			firstBall.price.max = Math.max(firstBall.price.max,  firstBall.benchmarks[benchmarksCounter].price);

			importedBallsId.push(mongoose.Types.ObjectId(firstBall.benchmarks[benchmarksCounter].ball));
		}

		if(sum != 0) {
			//There is at least a price
			firstBall.price.avg = sum / firstBall.benchmarks.length;
		} else {
			//There's no price
			delete firstBall.price;
		}

		var now = Date.now();
		firstBall.updated = now;
		firstBall.created = now;

		//Enforcing the creation of a new ball, easier for rollback
		delete firstBall._id;

		var ball = new Ball(firstBall);

		//Let's save the new ball
		ball.save(function(saveErr) {
			if(saveErr)  {
				console.log(saveErr);
				return res.send(400, {
					message: getErrorMessage(saveErr)
				});
			} else {
				//Updating the imported balls so they point to the new one
				Ball.db.collection('importedBalls').update({'_id' : {'$in' : importedBallsId}},
															{'$set' : {'published_ball' : ball._id}},
															{'multi' : true}, function(updateErr, updateResult) {
					if(updateErr)  {
						console.log(updateErr);
						return res.send(400, {
							message: getErrorMessage(updateErr)
						});
					} else {
						//Deleting the old balls as they are now merged in the new one
						Ball.remove({'_id' : {'$in' : ballsId}}, function (deleteErr) {
							if(deleteErr) {
								console.log(deleteErr);
								return res.send(400, {
									message: getErrorMessage(deleteErr)
								});
							} else {
								return res.send(200, {'ok' : true});
							}
						});
					}
				});
			}
		});
	}
};

exports.unmerge = function(req, res) {
	console.log("unmerging " + req.ball._id);
	Ball.where({'_id' : req.ball._id}).findOne(function(err, ball) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		} else {
			var benchmarks = ball.benchmarks;
			var now = Date.now();

			//Building the list of imported balls to retrieve
			var ballsId = [];
			for(var benchmarkCounter in benchmarks) {
				ballsId.push(mongoose.Types.ObjectId(benchmarks[benchmarkCounter].ball));
			}

			//Using the toArray convenience as the number of balls retrieved should be fairly limited
			Ball.db.collection('importedBalls').find({'_id' : {'$in' : ballsId}}).toArray(function(findImportedBallsErr, importedBalls) {
				if(findImportedBallsErr) {
					console.log(findImportedBallsErr);
					return res.send(400, {
						message: getErrorMessage(findImportedBallsErr)
					});
				} else {
					for(var importedBallCounter in importedBalls) {
						var importedBall = importedBalls[importedBallCounter];
						var benchmark = {};

						benchmark.source = importedBall.source;
						benchmark.price = importedBall.price;
						benchmark.url = importedBall.url;
						benchmark.ball = importedBall._id;

						importedBall.benchmarks = [];
						importedBall.benchmarks.push(benchmark);

						var price = importedBall.price;
						importedBall.price = {};
						importedBall.price.min = price;
						importedBall.price.max = price;
						importedBall.price.avg = price;

						importedBall.updated = now;
						importedBall.created = now;

						if(importedBall.name == null) {
							importedBall.name = 'XXXXXXXXXXX';
						}

						if(importedBall.brand == null) {
							importedBall.brand = 'XXXXXXXXXXX';
						}

						if(importedBall.fullname == null) {
							importedBall.fullname = 'XXXXXXXXXXX';
						}

						delete importedBall._id;
						delete importedBall.published_ball;
						delete importedBall.source;
						delete importedBall.url;

						var newBall = new Ball(importedBall);

						//Let's save the new ball
						newBall.save(function(saveErr) {
							if(saveErr)  {
								console.log(saveErr);
								return res.send(400, {
									message: getErrorMessage(saveErr)
								});
							} else {
								console.log('new ball Id is ' + newBall._id);
								console.log('imported ball Id is ' + newBall.benchmarks[0].ball);
								//Updating the imported ball so it points to the new ball
								Ball.db.collection('importedBalls').update({'_id' : newBall.benchmarks[0].ball},
																			{'$set' : {'published_ball' : mongoose.Types.ObjectId(newBall._id)}}, function(updateErr) {
									if(updateErr)  {
										console.log(updateErr);
										return res.send(400, {
											message: getErrorMessage(updateErr)
										});
									}
								});
							}
						});
					}

					//Removing the old merged ball, useless now
					ball.remove(function(removeErr) {
						if(removeErr)  {
							console.log(removeErr);
							return res.send(400, {
								message: getErrorMessage(removeErr)
							});
						} else {
							return res.send(200, {'ok' : true});
						}
					});
				}

			});
		}
	});
};
