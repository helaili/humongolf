'use strict';

// Rangefinders controller
angular.module('rangefinders').controller('RangefindersController', ['$scope', '$stateParams', '$location', 'Authentication', 'Rangefinders',
	function($scope, $stateParams, $location, Authentication, Rangefinders ) {
		$scope.authentication = Authentication;

		// Create new Rangefinder
		$scope.create = function() {
			// Create new Rangefinder object
			var rangefinder = new Rangefinders ({
				name: this.name
			});

			// Redirect after save
			rangefinder.$save(function(response) {
				$location.path('rangefinders/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Rangefinder
		$scope.remove = function( rangefinder ) {
			if ( rangefinder ) { rangefinder.$remove();

				for (var i in $scope.rangefinders ) {
					if ($scope.rangefinders [i] === rangefinder ) {
						$scope.rangefinders.splice(i, 1);
					}
				}
			} else {
				$scope.rangefinder.$remove(function() {
					$location.path('rangefinders');
				});
			}
		};

		// Update existing Rangefinder
		$scope.update = function() {
			var rangefinder = $scope.rangefinder ;

			rangefinder.$update(function() {
				$location.path('rangefinders/' + rangefinder._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Rangefinders
		$scope.find = function() {
			$scope.rangefinders = Rangefinders.query();
		};

		// Find existing Rangefinder
		$scope.findOne = function() {
			$scope.rangefinder = Rangefinders.get({ 
				rangefinderId: $stateParams.rangefinderId
			});
		};
	}
]);