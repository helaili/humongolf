'use strict';

(function() {
	// Balls Controller Spec
	describe('Balls Controller Tests', function() {
		// Initialize global variables
		var BallsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Balls controller.
			BallsController = $controller('BallsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Ball object fetched from XHR', inject(function(Balls) {
			// Create sample Ball using the Balls service
			var sampleBall = new Balls({
				name: 'New Ball'
			});

			// Create a sample Balls array that includes the new Ball
			var sampleBalls = [sampleBall];

			// Set GET response
			$httpBackend.expectGET('balls').respond(sampleBalls);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.balls).toEqualData(sampleBalls);
		}));

		it('$scope.findOne() should create an array with one Ball object fetched from XHR using a ballId URL parameter', inject(function(Balls) {
			// Define a sample Ball object
			var sampleBall = new Balls({
				name: 'New Ball'
			});

			// Set the URL parameter
			$stateParams.ballId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/balls\/([0-9a-fA-F]{24})$/).respond(sampleBall);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ball).toEqualData(sampleBall);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Balls) {
			// Create a sample Ball object
			var sampleBallPostData = new Balls({
				name: 'New Ball'
			});

			// Create a sample Ball response
			var sampleBallResponse = new Balls({
				_id: '525cf20451979dea2c000001',
				name: 'New Ball'
			});

			// Fixture mock form input values
			scope.name = 'New Ball';

			// Set POST response
			$httpBackend.expectPOST('balls', sampleBallPostData).respond(sampleBallResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Ball was created
			expect($location.path()).toBe('/balls/' + sampleBallResponse._id);
		}));

		it('$scope.update() should update a valid Ball', inject(function(Balls) {
			// Define a sample Ball put data
			var sampleBallPutData = new Balls({
				_id: '525cf20451979dea2c000001',
				name: 'New Ball'
			});

			// Mock Ball in scope
			scope.ball = sampleBallPutData;

			// Set PUT response
			$httpBackend.expectPUT(/balls\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/balls/' + sampleBallPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid ballId and remove the Ball from the scope', inject(function(Balls) {
			// Create new Ball object
			var sampleBall = new Balls({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Balls array and include the Ball
			scope.balls = [sampleBall];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/balls\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleBall);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.balls.length).toBe(0);
		}));
	});
}());