'use strict';

// Gps controller
angular.module('gps').controller('GpsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Gps',
	function($scope, $stateParams, $location, Authentication, Gps ) {
		$scope.authentication = Authentication;

		// Create new Gp
		$scope.create = function() {
			// Create new Gp object
			var gp = new Gps ({
				name: this.name
			});

			// Redirect after save
			gp.$save(function(response) {
				$location.path('gps/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Gp
		$scope.remove = function( gp ) {
			if ( gp ) { gp.$remove();

				for (var i in $scope.gps ) {
					if ($scope.gps [i] === gp ) {
						$scope.gps.splice(i, 1);
					}
				}
			} else {
				$scope.gp.$remove(function() {
					$location.path('gps');
				});
			}
		};

		// Update existing Gp
		$scope.update = function() {
			var gp = $scope.gp ;

			gp.$update(function() {
				$location.path('gps/' + gp._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Gps
		$scope.find = function() {
			$scope.gps = Gps.query();
		};

		// Find existing Gp
		$scope.findOne = function() {
			$scope.gp = Gps.get({ 
				gpId: $stateParams.gpId
			});
		};
	}
]);