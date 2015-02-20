'use strict';

// Configuring the Articles module
angular.module('rangefinders').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Rangefinders', 'rangefinderbrowser', 'button', '/browserangefinders', true, ['user']);
		Menus.addMenuItem('topbar', 'Rangefinder Manager', 'rangefinders', 'dropdown', '/rangefinders(/create)?', false, ['admin']);
		Menus.addSubMenuItem('topbar', 'rangefinders', 'List Rangefinders', 'rangefinders');
		Menus.addSubMenuItem('topbar', 'rangefinders', 'New Rangefinder', 'rangefinders/create');
	}
]);