'use strict';

// Featurettes controller
angular.module('featurettes').controller('FeaturettesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Featurettes',
	function($scope, $stateParams, $location, Authentication, Featurettes ) {
		$scope.authentication = Authentication;

		// Create new Featurette
		$scope.create = function() {
			// Create new Featurette object
			var featurette = new Featurettes (this.featurette);

			// Redirect after save
			featurette.$save(function(response) {
				$location.path('featurettes/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Featurette
		$scope.remove = function( featurette ) {
			if ( featurette ) { featurette.$remove();

				for (var i in $scope.featurettes ) {
					if ($scope.featurettes [i] === featurette ) {
						$scope.featurettes.splice(i, 1);
					}
				}
			} else {
				$scope.featurette.$remove(function() {
					$location.path('featurettes');
				});
			}
		};

		// Update existing Featurette
		$scope.update = function() {
			var featurette = $scope.featurette ;

			featurette.$update(function() {
				$location.path('featurettes/' + featurette._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Featurettes
		$scope.find = function() {
			$scope.featurettes = Featurettes.query();
		};

		// Find existing Featurette
		$scope.findOne = function() {
			$scope.featurette = Featurettes.get({ 
				featuretteId: $stateParams.featuretteId
			});
		};
	}
]);