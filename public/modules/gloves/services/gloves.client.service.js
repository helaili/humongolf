'use strict';

//Gloves service used to communicate Gloves REST endpoints
angular.module('gloves').factory('Gloves', ['$resource',
	function($resource) {
		return $resource('gloves/:gloveId', { gloveId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);