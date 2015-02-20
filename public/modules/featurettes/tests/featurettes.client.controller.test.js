'use strict';

(function() {
	// Featurettes Controller Spec
	describe('Featurettes Controller Tests', function() {
		// Initialize global variables
		var FeaturettesController,
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

			// Initialize the Featurettes controller.
			FeaturettesController = $controller('FeaturettesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Featurette object fetched from XHR', inject(function(Featurettes) {
			// Create sample Featurette using the Featurettes service
			var sampleFeaturette = new Featurettes({
				name: 'New Featurette'
			});

			// Create a sample Featurettes array that includes the new Featurette
			var sampleFeaturettes = [sampleFeaturette];

			// Set GET response
			$httpBackend.expectGET('featurettes').respond(sampleFeaturettes);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.featurettes).toEqualData(sampleFeaturettes);
		}));

		it('$scope.findOne() should create an array with one Featurette object fetched from XHR using a featuretteId URL parameter', inject(function(Featurettes) {
			// Define a sample Featurette object
			var sampleFeaturette = new Featurettes({
				name: 'New Featurette'
			});

			// Set the URL parameter
			$stateParams.featuretteId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/featurettes\/([0-9a-fA-F]{24})$/).respond(sampleFeaturette);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.featurette).toEqualData(sampleFeaturette);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Featurettes) {
			// Create a sample Featurette object
			var sampleFeaturettePostData = new Featurettes({
				name: 'New Featurette'
			});

			// Create a sample Featurette response
			var sampleFeaturetteResponse = new Featurettes({
				_id: '525cf20451979dea2c000001',
				name: 'New Featurette'
			});

			// Fixture mock form input values
			scope.name = 'New Featurette';

			// Set POST response
			$httpBackend.expectPOST('featurettes', sampleFeaturettePostData).respond(sampleFeaturetteResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Featurette was created
			expect($location.path()).toBe('/featurettes/' + sampleFeaturetteResponse._id);
		}));

		it('$scope.update() should update a valid Featurette', inject(function(Featurettes) {
			// Define a sample Featurette put data
			var sampleFeaturettePutData = new Featurettes({
				_id: '525cf20451979dea2c000001',
				name: 'New Featurette'
			});

			// Mock Featurette in scope
			scope.featurette = sampleFeaturettePutData;

			// Set PUT response
			$httpBackend.expectPUT(/featurettes\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/featurettes/' + sampleFeaturettePutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid featuretteId and remove the Featurette from the scope', inject(function(Featurettes) {
			// Create new Featurette object
			var sampleFeaturette = new Featurettes({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Featurettes array and include the Featurette
			scope.featurettes = [sampleFeaturette];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/featurettes\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleFeaturette);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.featurettes.length).toBe(0);
		}));
	});
}());