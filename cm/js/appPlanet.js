var app = angular.module('planetApp', []);

app.controller('PlanetCtrl', [
	'$scope',
	function($scope) {

		$scope.sections = sections;


	}]);

app.factory('posts', [function() {
	// service body
	var o = {
		posts: []
	};
	return o;
}]);

app.config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
});


var sections = [
	{	
		title: 'central hub',
		subsections: ['one', 'two', 'three']}, 
	{title: 'Galactic council',
		subsections: ['one', 'two', 'three']}, 
	{title: 'holoprojections',
		subsections: ['one', 'two', 'three']}, 
	{title: 'cute organisms',
		subsections: ['one', 'two', 'three']}, 
	{title: 'sex',
		subsections: ['one', 'two', 'three']},
	{title: 'time travel',
		subsections: ['one', 'two', 'three']}, 
	{title: 'green planets',
		subsections: ['one', 'two', 'three']}
];