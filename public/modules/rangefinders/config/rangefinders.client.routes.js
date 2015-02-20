'use strict';

//Setting up route
angular.module('rangefinders').config(['$stateProvider',
	function($stateProvider) {
		// Rangefinders state routing
		$stateProvider.
		state('listRangefinders', {
			url: '/rangefinders',
			templateUrl: 'modules/rangefinders/views/list-rangefinders.client.view.html'
		}).
		state('createRangefinder', {
			url: '/rangefinders/create',
			templateUrl: 'modules/rangefinders/views/create-rangefinder.client.view.html'
		}).
		state('viewRangefinder', {
			url: '/rangefinders/:rangefinderId',
			templateUrl: 'modules/rangefinders/views/view-rangefinder.client.view.html'
		}).
		state('editRangefinder', {
			url: '/rangefinders/:rangefinderId/edit',
			templateUrl: 'modules/rangefinders/views/edit-rangefinder.client.view.html'
		});
	}
]);