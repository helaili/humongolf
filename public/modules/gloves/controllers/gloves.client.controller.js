'use strict';

// Gloves controller
angular.module('gloves').controller('GlovesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Gloves',
	function($scope, $stateParams, $location, Authentication, Gloves ) {
		$scope.authentication = Authentication;

		// Create new Glove
		$scope.create = function() {
			// Create new Glove object
			var glove = new Gloves ({
				name: this.name
			});

			// Redirect after save
			glove.$save(function(response) {
				$location.path('gloves/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Glove
		$scope.remove = function( glove ) {
			if ( glove ) { glove.$remove();

				for (var i in $scope.gloves ) {
					if ($scope.gloves [i] === glove ) {
						$scope.gloves.splice(i, 1);
					}
				}
			} else {
				$scope.glove.$remove(function() {
					$location.path('gloves');
				});
			}
		};

		// Update existing Glove
		$scope.update = function() {
			var glove = $scope.glove ;

			glove.$update(function() {
				$location.path('gloves/' + glove._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Gloves
		$scope.find = function() {
			$scope.gloves = Gloves.query();
		};

		// Find existing Glove
		$scope.findOne = function() {
			$scope.glove = Gloves.get({ 
				gloveId: $stateParams.gloveId
			});
		};
	}
]);