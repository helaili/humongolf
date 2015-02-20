'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var rangefinders = require('../../app/controllers/rangefinders');

	// Rangefinders Routes
	app.route('/rangefinders')
		.get(rangefinders.list)
		.post(users.requiresLogin, rangefinders.create);

	app.route('/rangefinders/:rangefinderId')
		.get(rangefinders.read)
		.put(users.requiresLogin, rangefinders.hasAuthorization, rangefinders.update)
		.delete(users.requiresLogin, rangefinders.hasAuthorization, rangefinders.delete);

	// Finish by binding the Rangefinder middleware
	app.param('rangefinderId', rangefinders.rangefinderByID);
};