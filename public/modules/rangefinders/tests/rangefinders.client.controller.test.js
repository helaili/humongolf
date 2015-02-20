'use strict';

(function() {
	// Rangefinders Controller Spec
	describe('Rangefinders Controller Tests', function() {
		// Initialize global variables
		var RangefindersController,
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

			// Initialize the Rangefinders controller.
			RangefindersController = $controller('RangefindersController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Rangefinder object fetched from XHR', inject(function(Rangefinders) {
			// Create sample Rangefinder using the Rangefinders service
			var sampleRangefinder = new Rangefinders({
				name: 'New Rangefinder'
			});

			// Create a sample Rangefinders array that includes the new Rangefinder
			var sampleRangefinders = [sampleRangefinder];

			// Set GET response
			$httpBackend.expectGET('rangefinders').respond(sampleRangefinders);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rangefinders).toEqualData(sampleRangefinders);
		}));

		it('$scope.findOne() should create an array with one Rangefinder object fetched from XHR using a rangefinderId URL parameter', inject(function(Rangefinders) {
			// Define a sample Rangefinder object
			var sampleRangefinder = new Rangefinders({
				name: 'New Rangefinder'
			});

			// Set the URL parameter
			$stateParams.rangefinderId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/rangefinders\/([0-9a-fA-F]{24})$/).respond(sampleRangefinder);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.rangefinder).toEqualData(sampleRangefinder);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Rangefinders) {
			// Create a sample Rangefinder object
			var sampleRangefinderPostData = new Rangefinders({
				name: 'New Rangefinder'
			});

			// Create a sample Rangefinder response
			var sampleRangefinderResponse = new Rangefinders({
				_id: '525cf20451979dea2c000001',
				name: 'New Rangefinder'
			});

			// Fixture mock form input values
			scope.name = 'New Rangefinder';

			// Set POST response
			$httpBackend.expectPOST('rangefinders', sampleRangefinderPostData).respond(sampleRangefinderResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Rangefinder was created
			expect($location.path()).toBe('/rangefinders/' + sampleRangefinderResponse._id);
		}));

		it('$scope.update() should update a valid Rangefinder', inject(function(Rangefinders) {
			// Define a sample Rangefinder put data
			var sampleRangefinderPutData = new Rangefinders({
				_id: '525cf20451979dea2c000001',
				name: 'New Rangefinder'
			});

			// Mock Rangefinder in scope
			scope.rangefinder = sampleRangefinderPutData;

			// Set PUT response
			$httpBackend.expectPUT(/rangefinders\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/rangefinders/' + sampleRangefinderPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid rangefinderId and remove the Rangefinder from the scope', inject(function(Rangefinders) {
			// Create new Rangefinder object
			var sampleRangefinder = new Rangefinders({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Rangefinders array and include the Rangefinder
			scope.rangefinders = [sampleRangefinder];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/rangefinders\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleRangefinder);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.rangefinders.length).toBe(0);
		}));
	});
}());