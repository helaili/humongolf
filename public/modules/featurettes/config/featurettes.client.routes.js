'use strict';

//Setting up route
angular.module('featurettes').config(['$stateProvider',
	function($stateProvider) {
		// Featurettes state routing
		$stateProvider.
		state('listFeaturettes', {
			url: '/featurettes',
			templateUrl: 'modules/featurettes/views/list-featurettes.client.view.html'
		}).
		state('createFeaturette', {
			url: '/featurettes/create',
			templateUrl: 'modules/featurettes/views/create-featurette.client.view.html'
		}).
		state('viewFeaturette', {
			url: '/featurettes/:featuretteId',
			templateUrl: 'modules/featurettes/views/view-featurette.client.view.html'
		}).
		state('editFeaturette', {
			url: '/featurettes/:featuretteId/edit',
			templateUrl: 'modules/featurettes/views/edit-featurette.client.view.html'
		});
	}
]);