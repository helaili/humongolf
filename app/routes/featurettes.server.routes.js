'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var featurettes = require('../../app/controllers/featurettes');

	// Featurettes Routes
	app.route('/featurettes/listEnabled')
		.get(featurettes.listEnabled);
	
	app.route('/featurettes')
		.get(featurettes.list)
		.post(users.requiresLogin, featurettes.create);

	app.route('/featurettes/:featuretteId')
		.get(featurettes.read)
		.put(users.requiresLogin, featurettes.hasAuthorization, featurettes.update)
		.delete(users.requiresLogin, featurettes.hasAuthorization, featurettes.delete);

	// Finish by binding the Featurette middleware
	app.param('featuretteId', featurettes.featuretteByID);
};