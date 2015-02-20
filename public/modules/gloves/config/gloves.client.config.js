'use strict';

// Configuring the Articles module
angular.module('gloves').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Gloves', 'glovebrowser', 'button', '/browsegloves', true, ['user']);
		Menus.addMenuItem('topbar', 'Glove Manager', 'gloves', 'dropdown', '/gloves(/create)?', false, ['admin']);
		Menus.addSubMenuItem('topbar', 'gloves', 'List Gloves', 'gloves');
		Menus.addSubMenuItem('topbar', 'gloves', 'New Glove', 'gloves/create');
	}
]);