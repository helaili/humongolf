'use strict';

//Balls service used to communicate Balls REST endpoints
angular.module('balls').factory('Balls', ['$resource',
	function($resource) {
		return $resource('balls/:ballId', { ballId: '@_id'
		}, {
			update: {
				method: 'PUT'
			},
    		listBrands: {
      			method : 'GET', 
      			url : 'balls/listBrands',
      			isArray: true
			},
			listAll: {
      			method : 'GET', 
      			url : 'balls/listAll',
      			isArray: true
			},
			setProperties: {
				method : 'POST', 
      			url : 'balls/:ballId/setProperties'	
			},
			sameBall: {
				method : 'POST', 
      			url : 'balls/sameBall'	
			},
			differentColor: {
				method : 'POST', 
      			url : 'balls/differentColor'	
			}
		});
	}
]);