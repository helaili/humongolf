'use strict';

// Balls controller
angular.module('balls').controller('BallsController', ['$rootScope', '$scope', '$stateParams', '$location', 'Authentication', 'Balls', 'Global',
	function($rootScope, $scope, $stateParams, $location, Authentication, Balls, Global ) {
		$scope.authentication = Authentication;
		$scope.publishedTrue = true;
		$scope.publishedFalse = false;
		$scope.cartTypeLabel = 'Select Cart type';
		$scope.balls = [];

		$scope.editFlags = {};


		$scope.carts = {
			'same' : {value : 0, label : 'Same ball', cart : []},
			'differentColor' : {value : 1, label : 'Different color', cart : []}
		};


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
			var ball = $scope.ball ;

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
			$scope.brands = Balls.listBrands();
		};

		// Find a list of Balls
		$scope.listAll = function() {
			$scope.balls = Balls.listAll();
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

		$scope.addToAdminCart = function(ball, recursive) {
			if($scope.cart != null) {
				//Check if ball is not already in cart
				for(var index = 0; index < $scope.cart.length; index++) {
					if($scope.cart[index]._id === ball._id) {
						return;
					}
				}
				$scope.cart.push(ball);

				if(recursive) {
					//Add linked balls 
					var array; 
					if($scope.cart  ===  $scope.carts.same.cart) {
						array = ball.sameAs;
					} else if($scope.cart  ===  $scope.carts.differentColor.cart) {
						array = ball.differentColorAs;
					}
					
					for(var arrayIndex = 0; arrayIndex < array.length; arrayIndex++) {
						for(var ballIndex = 0; ballIndex < $scope.balls.length; ballIndex++) {
							if(array[arrayIndex] === $scope.balls[ballIndex]._id) {
								$scope.addToAdminCart($scope.balls[ballIndex], false);
								break;
							}
						}
					}
				}
			}
		};

		$scope.removeFromAdminCart = function(index) {
			if($scope.cart != null) {
				$scope.cart.splice(index, 1);
				angular.element('#saveCartButton').removeClass('btn-success').addClass('btn-default');
			}
		};

		$scope.switchCart = function(cartType) {
			if(cartType === $scope.carts.same.value) {
				$scope.cartTypeLabel = $scope.carts.same.label;
				$scope.cart  =  $scope.carts.same.cart;
				angular.element('#saveCartButton').removeClass('btn-success').addClass('btn-default');
			} else if(cartType === $scope.carts.differentColor.value) {
				$scope.cartTypeLabel = $scope.carts.differentColor.label;
				$scope.cart  =  $scope.carts.differentColor.cart;
				angular.element('#saveCartButton').removeClass('btn-success').addClass('btn-default');
			}
		};		

		$scope.saveCart = function() {
			if($scope.cart  ===  $scope.carts.same.cart) {
				Balls.sameBall($scope.carts.same.cart, function(response) {
					if(response.ok == true) {
						angular.element('#saveCartButton').removeClass('btn-default').addClass('btn-success');
					}	
				});
			} else if($scope.cart  ===  $scope.carts.differentColor.cart) {
				Balls.differentColor($scope.carts.differentColor.cart, function(response) {
					if(response.ok == true) {
						angular.element('#saveCartButton').removeClass('btn-default').addClass('btn-success');
					}	
				});
			}
		};

		$scope.clearCart = function() {
			$scope.cart = [];
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

		$scope.submitEdits = function() {
			var ballEdits = {
				'_id' : $scope.ball._id, 
				'brand' : $scope.ball.brand,
				'color' : $scope.ball.color,
				'pieces' : $scope.ball.pieces,
				'description' : $scope.ball.description
			};

			Balls.setProperties(ballEdits, function(response) {
				if(response.ok == true) {
					$scope.cancelEdit();
				}	
			});
		};
	}
]);