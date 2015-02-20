'use strict';

(function() {
	// Gloves Controller Spec
	describe('Gloves Controller Tests', function() {
		// Initialize global variables
		var GlovesController,
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

			// Initialize the Gloves controller.
			GlovesController = $controller('GlovesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Glove object fetched from XHR', inject(function(Gloves) {
			// Create sample Glove using the Gloves service
			var sampleGlove = new Gloves({
				name: 'New Glove'
			});

			// Create a sample Gloves array that includes the new Glove
			var sampleGloves = [sampleGlove];

			// Set GET response
			$httpBackend.expectGET('gloves').respond(sampleGloves);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gloves).toEqualData(sampleGloves);
		}));

		it('$scope.findOne() should create an array with one Glove object fetched from XHR using a gloveId URL parameter', inject(function(Gloves) {
			// Define a sample Glove object
			var sampleGlove = new Gloves({
				name: 'New Glove'
			});

			// Set the URL parameter
			$stateParams.gloveId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/gloves\/([0-9a-fA-F]{24})$/).respond(sampleGlove);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.glove).toEqualData(sampleGlove);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Gloves) {
			// Create a sample Glove object
			var sampleGlovePostData = new Gloves({
				name: 'New Glove'
			});

			// Create a sample Glove response
			var sampleGloveResponse = new Gloves({
				_id: '525cf20451979dea2c000001',
				name: 'New Glove'
			});

			// Fixture mock form input values
			scope.name = 'New Glove';

			// Set POST response
			$httpBackend.expectPOST('gloves', sampleGlovePostData).respond(sampleGloveResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Glove was created
			expect($location.path()).toBe('/gloves/' + sampleGloveResponse._id);
		}));

		it('$scope.update() should update a valid Glove', inject(function(Gloves) {
			// Define a sample Glove put data
			var sampleGlovePutData = new Gloves({
				_id: '525cf20451979dea2c000001',
				name: 'New Glove'
			});

			// Mock Glove in scope
			scope.glove = sampleGlovePutData;

			// Set PUT response
			$httpBackend.expectPUT(/gloves\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/gloves/' + sampleGlovePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid gloveId and remove the Glove from the scope', inject(function(Gloves) {
			// Create new Glove object
			var sampleGlove = new Gloves({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Gloves array and include the Glove
			scope.gloves = [sampleGlove];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/gloves\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGlove);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.gloves.length).toBe(0);
		}));
	});
}());