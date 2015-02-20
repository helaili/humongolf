'use strict';

//Gps service used to communicate Gps REST endpoints
angular.module('gps').factory('Gps', ['$resource',
	function($resource) {
		return $resource('gps/:gpId', { gpId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);