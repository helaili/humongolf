'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var gloves = require('../../app/controllers/gloves');

	// Gloves Routes
	app.route('/gloves')
		.get(gloves.list)
		.post(users.requiresLogin, gloves.create);

	app.route('/gloves/:gloveId')
		.get(gloves.read)
		.put(users.requiresLogin, gloves.hasAuthorization, gloves.update)
		.delete(users.requiresLogin, gloves.hasAuthorization, gloves.delete);

	// Finish by binding the Glove middleware
	app.param('gloveId', gloves.gloveByID);
};