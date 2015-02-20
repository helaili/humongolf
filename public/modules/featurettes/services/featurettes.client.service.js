'use strict';

//Featurettes service used to communicate Featurettes REST endpoints
angular.module('featurettes').factory('Featurettes', ['$resource',
	function($resource) {
		return $resource('featurettes/:featuretteId', { featuretteId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
    		listEnabled: {
      			method : 'GET', 
      			url : 'featurettes/listEnabled',
      			isArray: true
			}
		});
	}
]);