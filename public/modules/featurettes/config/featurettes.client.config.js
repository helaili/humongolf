'use strict';

// Configuring the Articles module
angular.module('featurettes').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Featurettes', 'featurettes', 'dropdown', '/featurettes(/create)?', false, ['admin']);
		Menus.addSubMenuItem('topbar', 'featurettes', 'List Featurettes', 'featurettes');
		Menus.addSubMenuItem('topbar', 'featurettes', 'New Featurette', 'featurettes/create');
	}
]);