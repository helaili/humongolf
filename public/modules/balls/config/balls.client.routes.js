'use strict';

//Setting up route
angular.module('balls').config(['$stateProvider',
	function($stateProvider) {
		// Balls state routing
		$stateProvider.
		state('listBalls', {
			url: '/balls',
			templateUrl: 'modules/balls/views/list-balls.client.view.html'
		}).
		state('arrayListBalls', {
			url: '/balls/array',
			templateUrl: 'modules/balls/views/array-list-balls.client.view.html'
		}).
		state('createBall', {
			url: '/balls/create',
			templateUrl: 'modules/balls/views/create-ball.client.view.html'
		}).
		state('viewBall', {
			url: '/balls/:ballId',
			templateUrl: 'modules/balls/views/view-ball.client.view.html'
		}).
		state('editBall', {
			url: '/balls/:ballId/edit',
			templateUrl: 'modules/balls/views/edit-ball.client.view.html'
		});
	}
]);