(function(){
	var app = angular.module('MainCtrl', []);

	app.controller('MainController', function($scope) {
		$scope.tagline = 'It is the duty of the artist to sabotage the familiar';
	
		$scope.data = data;

	});

	var data = [
		{"title": "Article 1", "upvotes": 2345},
		{"title": "Article 2", "upvotes": 5},
		{"title": "Article 3", "upvotes": 19},
		{"title": "Article 4", "upvotes": 23},
		{"title": "Article 5", "upvotes": 1},

	];

})();