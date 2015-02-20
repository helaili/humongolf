'use strict';


angular.module('core').controller('HomeController', [ '$scope', 'Authentication', 'Featurettes', 'Global',
	function($scope, Authentication, Featurettes, Global) {
		$scope.authentication = Authentication;
		$scope.featurettes = Featurettes.listEnabled();


		Global.setShowCarousel(true);
	}
]);