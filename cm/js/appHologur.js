var app = angular.module('hologurApp', []);

app.controller('HologurCtrl', [
	'$scope',
	function($scope) {

		// alert('hologur!');



}]);

app.config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
})