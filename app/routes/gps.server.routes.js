'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var gps = require('../../app/controllers/gps');

	// Gps Routes
	app.route('/gps')
		.get(gps.list)
		.post(users.requiresLogin, gps.create);

	app.route('/gps/:gpId')
		.get(gps.read)
		.put(users.requiresLogin, gps.hasAuthorization, gps.update)
		.delete(users.requiresLogin, gps.hasAuthorization, gps.delete);

	// Finish by binding the Gp middleware
	app.param('gpId', gps.gpByID);
};