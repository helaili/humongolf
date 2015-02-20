'use strict';

//Setting up route
angular.module('gloves').config(['$stateProvider',
	function($stateProvider) {
		// Gloves state routing
		$stateProvider.
		state('listGloves', {
			url: '/gloves',
			templateUrl: 'modules/gloves/views/list-gloves.client.view.html'
		}).
		state('createGlove', {
			url: '/gloves/create',
			templateUrl: 'modules/gloves/views/create-glove.client.view.html'
		}).
		state('viewGlove', {
			url: '/gloves/:gloveId',
			templateUrl: 'modules/gloves/views/view-glove.client.view.html'
		}).
		state('editGlove', {
			url: '/gloves/:gloveId/edit',
			templateUrl: 'modules/gloves/views/edit-glove.client.view.html'
		});
	}
]);