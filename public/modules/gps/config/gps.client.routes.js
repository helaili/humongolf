'use strict';

//Setting up route
angular.module('gps').config(['$stateProvider',
	function($stateProvider) {
		// Gps state routing
		$stateProvider.
		state('listGps', {
			url: '/gps',
			templateUrl: 'modules/gps/views/list-gps.client.view.html'
		}).
		state('createGp', {
			url: '/gps/create',
			templateUrl: 'modules/gps/views/create-gp.client.view.html'
		}).
		state('viewGp', {
			url: '/gps/:gpId',
			templateUrl: 'modules/gps/views/view-gp.client.view.html'
		}).
		state('editGp', {
			url: '/gps/:gpId/edit',
			templateUrl: 'modules/gps/views/edit-gp.client.view.html'
		});
	}
]);