'use strict';

// Balls controller
angular.module('balls').controller('BallsController', ['$rootScope', '$scope', '$window', '$stateParams', '$location', 'Authentication', 'Balls', 'Global',
	function($rootScope, $scope, $window, $stateParams, $location, Authentication, Balls, Global ) {
		$scope.authentication = Authentication;
		$scope.publishedTrue = true;
		$scope.publishedFalse = false;
		$scope.cartTypeLabel = 'Select Cart type';
		$scope.balls = [];
		$scope.handicaps = [];
		$scope.editFlags = {};
		$scope.brandFilter = 'NONE';

		Global.setShowCarousel(false);



		$scope.publishedCheckboxChanged = function(publish) {
			if(publish) {
				$scope.publishedTrue = !$scope.publishedTrue;
			} else {
				$scope.publishedFalse = !$scope.publishedFalse;
			}
			$scope.find();
		};


		// Create new Ball
		$scope.create = function() {
			// Create new Ball object
			var ball = new Balls (this.ball);

			// Redirect after save
			ball.$save(function(response) {
				$location.path('balls/' + response._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});

			// Clear form fields
			this.name = '';
		};

		// Remove existing Ball
		$scope.remove = function( ball ) {
			if ( ball ) {
				ball.$remove();

				for (var i in $scope.balls ) {
					if ($scope.balls [i] === ball ) {
						$scope.balls.splice(i, 1);
					}
				}
			} else {
				$scope.ball.$remove(function() {
					$location.path('balls');
				});
			}
		};

		// Update existing Ball
		$scope.update = function() {
			var ball = $scope.ball;

			console.log('Saving ' + ball);

			ball.$update(function() {
				$location.path('balls/' + ball._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		function initializeBallBrands() {
			if($rootScope.ballBrands == null) {
				Balls.listBrands(function(listOfBrandStrings) {
					var brands = [];
					for(var index = 0; index < listOfBrandStrings.length; index++) {
						brands.push({'label' : listOfBrandStrings[index], 'selected' : false});
					}
					$rootScope.ballBrands = brands;
				});
			}
		};


		// Find a list of Balls
		$scope.find = function() {
			var filters = { };

			initializeBallBrands();

			if(($scope.publishedTrue && !$scope.publishedFalse) || (!$scope.publishedTrue && $scope.publishedFalse)) {
				filters.published = $scope.publishedTrue;
			}


			if($rootScope.ballBrands != null) {
				for(var index = 0; index < $rootScope.ballBrands.length; index++) {
					if($rootScope.ballBrands[index].selected === true) {
						if(filters['brands'] == null) {
							filters.brands = [];
						}
						filters.brands.push($rootScope.ballBrands[index].label);
					}
				}
			}

			$scope.balls = Balls.query({'filters' : filters});
			$rootScope.balls = $scope.balls;
		};

		// Find existing Ball
		$scope.findOne = function() {
			if($rootScope.balls != null && $rootScope.balls.length > 0) {
				foundOne();
			} else {
				$scope.ball = Balls.get({ballId: $stateParams.ballId}, function(response) {
					foundOne();
				});
			}

		};


		function foundOne() {
			var counter = -1;
			if($rootScope.balls != null && $rootScope.balls.length > 0) {

				while(++counter < $rootScope.balls.length) {
					if($stateParams.ballId === $rootScope.balls[counter]._id) {
						$scope.ball = $rootScope.balls[counter];
						if(counter > 0) {
							$scope.previousBallId = $rootScope.balls[counter-1]._id;
						} else {
							$scope.previousBallId = null;
						}

						if(counter < $rootScope.balls.length-1) {
							$scope.nextBallId = $rootScope.balls[counter+1]._id;
						} else {
							$scope.nextBallId = null;
						}
						break;
					}
				}
			}
		}

		$scope.listBrands = function() {
			if($scope.brands == null) {
				$scope.brands = Balls.listBrands();
			}
		};

		// Find a list of Balls
		$scope.listAll = function() {
			$scope.editFlags = {};
			initializeBallBrands();

			if($scope.brandFilter == 'NONE' && $rootScope.brandFilter != null) {
				$scope.brandFilter = $rootScope.brandFilter;
			}

			if($scope.brandFilter != 'NONE') {
				$scope.balls = Balls.list({'filters' : {'brand' : $scope.brandFilter.label}});
				$rootScope.brandFilter = $scope.brandFilter;
			}
		};



		$scope.setBallPublishedState = function(id, published) {
			var ball = {'_id' : id, 'published' : published};
			Balls.setProperties(ball, function(response) {
				if(response.ok == true) {
					var ballFound = false;
					var counter = -1;

					while(++counter < $scope.balls.length && !ballFound) {
						if($scope.balls[counter]._id === id) {
							ballFound = true;
							$scope.balls[counter].published = published;
						}
					}
				}
			});
		};



		$scope.toggleEdit = function(flag) {
			if($scope.authentication.user != null && $scope.authentication.user.roles.indexOf('admin') >= 0) {
				var oldValue = !$scope.editFlags[flag];

				$scope.editFlags[flag] = oldValue;

			}
		};

		$scope.getEditFlag = function(flag) {
			if($scope.authentication.user != null && $scope.authentication.user.roles.indexOf('admin') >= 0) {
				if($scope.editFlags[flag] == null) {
					$scope.editFlags[flag] = false;
				}
				return $scope.editFlags[flag];
			}
		};

		$scope.editFlagsOn = function() {
			var flagOn = false;
			for(var key in $scope.editFlags) {
  				if ($scope.editFlags.hasOwnProperty(key)) {
    				flagOn = flagOn || $scope.editFlags[key];
    				if(flagOn) {
    					break;
    				}
  				}
			}
			return flagOn;
		};

		$scope.cancelEdit = function() {
			for(var key in $scope.editFlags) {
  				if ($scope.editFlags.hasOwnProperty(key)) {
    				$scope.editFlags[key] = false;
  				}
			}
		};

		$scope.udpdateBallInView  = function(ball, index) {
			$scope.ball.$update(function() {
				$scope.cancelEdit();
			});
		};


		$scope.updateBallInArray = function(ball, index) {
			var button = $('#update-btn-'+ball._id);


			button.removeClass('btn-default');
			button.removeClass('btn-success');
			button.removeClass('btn-danger');

			ball.handicap = [];
			for (var key in $scope.handicaps[index]) {
   				if ($scope.handicaps[index].hasOwnProperty(key)) {
   					if($scope.handicaps[index][key]) {
   						ball.handicap.push(key);
   					}
   				}
			}

			ball.$update(function() {
				button.addClass('btn-success');

				$scope.editFlags['brand.'+index] = false;
				$scope.editFlags['name.'+index] = false;
				$scope.editFlags['fullname.'+index] = false;
				$scope.editFlags['color.'+index] = false;
				$scope.editFlags['pieces.'+index] = false;
				$scope.editFlags['compressionValue.'+index] = false;
				$scope.editFlags['compressionClass.'+index] = false;
				$scope.editFlags['minSpeed.'+index] = false;
				$scope.editFlags['maxSpeed.'+index] = false;
				$scope.editFlags['enveloppe.'+index] = false;
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
				button.addClass('btn-danger');
			});

		};

		$scope.mergeBalls = function() {
			var ballsToMerge = [];

			for(var ballIndex in $scope.balls) {
				if($scope.balls[ballIndex].selected) {
					ballsToMerge.push($scope.balls[ballIndex]);
				}
			}

			Balls.merge(ballsToMerge, function(response) {
				if(response.ok == true) {
					$scope.listAll();
				}
			});
		};

		$scope.unmergeBall = function(ball) {
			Balls.unmerge(ball, function(response) {
				if(response.ok == true) {
					$scope.listAll();
				}
			});
		};

		$scope.openViewBallTab = function(ball) {
			$window.open('/#!/balls/'+ball._id);
		}
	}
]);
