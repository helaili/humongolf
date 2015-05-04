'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var balls = require('../../app/controllers/balls');

	// Balls Routes
	app.route('/balls/listBrands')
		.get(balls.listBrands);

	app.route('/balls/sameBall')
		.post(users.requiresLogin, balls.hasAuthorization, balls.sameBall);

	app.route('/balls/differentColor')
		.post(users.requiresLogin, balls.hasAuthorization, balls.differentColor);

	app.route('/balls/merge')
		.post(users.requiresLogin, balls.hasAuthorization, balls.merge);

	app.route('/balls/:ballId/getImages')
			.post(users.requiresLogin, balls.hasAuthorization, balls.getAllImages);

	app.route('/balls/:ballId/unmerge')
		.post(users.requiresLogin, balls.hasAuthorization, balls.unmerge);

	app.route('/balls/:ballId/setProperties')
		.post(users.requiresLogin, balls.hasAuthorization, balls.setProperties);

	app.route('/balls/listAll')
		.get(users.requiresLogin, balls.hasAuthorization, balls.listAll);

	app.route('/balls')
		.get(balls.list)
		.post(users.requiresLogin, balls.create);

	app.route('/balls/:ballId')
		.get(balls.read)
		.put(users.requiresLogin, balls.hasAuthorization, balls.update)
		.delete(users.requiresLogin, balls.hasAuthorization, balls.delete);

	// Finish by binding the Ball middleware
	app.param('ballId', balls.ballByID);
};
