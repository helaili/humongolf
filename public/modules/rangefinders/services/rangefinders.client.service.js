'use strict';

//Rangefinders service used to communicate Rangefinders REST endpoints
angular.module('rangefinders').factory('Rangefinders', ['$resource',
	function($resource) {
		return $resource('rangefinders/:rangefinderId', { rangefinderId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);