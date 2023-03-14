angular.module('appRoutes', []).config(
	['$routeProvider', '$locationProvider', 
		function($routeProvider, $locationProvider){

	$routeProvider.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		}).
		when('/articles', {
			templateUrl: 'views/article.html',
			controller: 'ArticleController'
		}).
		when('/huffplanet', {
			templateUrl: 'views/huffplanet.html',
			controller: 'PlanetController'
		}).
		when('/mindtube', {
			templateUrl: 'views/mindtube.html',
			controller: 'MindtubeController'
		}).
		when('/mindtube/:vidId', {
			templateUrl: 'views/mindtube.html',
			controller: 'MindtubeIdController'
		});

	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});

}]);