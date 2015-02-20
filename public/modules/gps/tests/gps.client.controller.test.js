'use strict';

(function() {
	// Gps Controller Spec
	describe('Gps Controller Tests', function() {
		// Initialize global variables
		var GpsController,
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

			// Initialize the Gps controller.
			GpsController = $controller('GpsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Gp object fetched from XHR', inject(function(Gps) {
			// Create sample Gp using the Gps service
			var sampleGp = new Gps({
				name: 'New Gp'
			});

			// Create a sample Gps array that includes the new Gp
			var sampleGps = [sampleGp];

			// Set GET response
			$httpBackend.expectGET('gps').respond(sampleGps);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gps).toEqualData(sampleGps);
		}));

		it('$scope.findOne() should create an array with one Gp object fetched from XHR using a gpId URL parameter', inject(function(Gps) {
			// Define a sample Gp object
			var sampleGp = new Gps({
				name: 'New Gp'
			});

			// Set the URL parameter
			$stateParams.gpId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/gps\/([0-9a-fA-F]{24})$/).respond(sampleGp);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gp).toEqualData(sampleGp);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Gps) {
			// Create a sample Gp object
			var sampleGpPostData = new Gps({
				name: 'New Gp'
			});

			// Create a sample Gp response
			var sampleGpResponse = new Gps({
				_id: '525cf20451979dea2c000001',
				name: 'New Gp'
			});

			// Fixture mock form input values
			scope.name = 'New Gp';

			// Set POST response
			$httpBackend.expectPOST('gps', sampleGpPostData).respond(sampleGpResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Gp was created
			expect($location.path()).toBe('/gps/' + sampleGpResponse._id);
		}));

		it('$scope.update() should update a valid Gp', inject(function(Gps) {
			// Define a sample Gp put data
			var sampleGpPutData = new Gps({
				_id: '525cf20451979dea2c000001',
				name: 'New Gp'
			});

			// Mock Gp in scope
			scope.gp = sampleGpPutData;

			// Set PUT response
			$httpBackend.expectPUT(/gps\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/gps/' + sampleGpPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid gpId and remove the Gp from the scope', inject(function(Gps) {
			// Create new Gp object
			var sampleGp = new Gps({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Gps array and include the Gp
			scope.gps = [sampleGp];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/gps\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGp);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.gps.length).toBe(0);
		}));
	});
}());