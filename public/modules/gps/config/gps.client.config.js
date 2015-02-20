'use strict';

// Configuring the Articles module
angular.module('gps').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'GPS', 'gpsbrowser', 'button', '/browsegps', true, ['user']);
		Menus.addMenuItem('topbar', 'GPS Manager', 'gps', 'dropdown', '/gps(/create)?', false, ['admin']);
		Menus.addSubMenuItem('topbar', 'gps', 'List GPS', 'gps');
		Menus.addSubMenuItem('topbar', 'gps', 'New GPS', 'gps/create');
	}
]);