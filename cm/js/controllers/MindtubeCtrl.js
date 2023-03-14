(function() {

	var app = angular.module('MindtubeCtrl', []);

	app.controller('MindtubeController', ['$scope', '$routeParams', function($scope, $routeParams) {
		
		alert('MINDTUBE! ' + $routeParams);


		$scope.tagline = 'It is the duty of the artist to sabotage the familiar';
	}]);


})();