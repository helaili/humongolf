'use strict';


angular.module('core').controller('HomeCarouselController', ['$scope', 'Authentication', 'Featurettes', 'Global',
	function($scope, Authentication, Featurettes, Global) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		$scope.Data = Global.getAll();
	
		$scope.myInterval = 5000;
		var slides = $scope.slides = [];
		
		$scope.addSlide = function() {
			var newWidth = 600 + slides.length;

			Featurettes.listEnabled(function(featurettes) {
				featurettes.forEach(function(featurette) {
					slides.push({
						image: featurette.image,
						text: featurette.shortText,
						heading: featurette.heading 
					});
				});
			});
		};

		
			//console.log($window.location.href);

		$scope.addSlide();


	}
]);