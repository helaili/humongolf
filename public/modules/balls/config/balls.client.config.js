'use strict';

// Configuring the Articles module
angular.module('balls').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Balls', 'balls', 'button', 'balls', true, ['user']);
		Menus.addMenuItem('topbar', 'Ball Manager', 'balls', 'dropdown', '/balls(/create)?', false, ['admin']);
		Menus.addSubMenuItem('topbar', 'balls', 'List Balls', 'balls');
		Menus.addSubMenuItem('topbar', 'balls', 'Array List Balls', 'balls/array');
		Menus.addSubMenuItem('topbar', 'balls', 'New Ball', 'balls/create', 'balls/create');
		Menus.addSubMenuItem('topbar', 'balls', 'Pictures', 'balls/pictures', 'balls/pictures');
		//menuId, rootMenuItemURL, menuItemTitle, menuItemURL, [menuItemUIRoute], [isPublic], [roles]
	}
]);