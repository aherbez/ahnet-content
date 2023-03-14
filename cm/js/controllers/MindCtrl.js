(function() {

	var app = angular.module('MindCtrl', []);

	app.controller('MindtubeController', function($scope) {
		$scope.tagline = 'Mindtube';

	});

	app.controller('MindtubeIdController', ['$scope', '$routeParams', function($scope, $routeParams) {
		alert('Mindtube ID Controller');		
		var vidId = 0;
		if ($routeParams.vidId !== null) vidId = parseInt($routeParams.vidId);

		$scope.tagline = 'Mindtube Video: ' + vidId;

	}]);


})();