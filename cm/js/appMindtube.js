var appMindtube = angular.module('appMindtube', []);

appMindtube.controller('MindtubeCtrl', [
	'$scope', 
	function($scope) {
		
		// $scope.tagline = 'FOOBAR';
		// alert('MINTUBE!');
	}]);

appMindtube.filter('secondsToTime', [function() {
	return function(seconds) {
		return new Date(1970, 0, 1).setSeconds(seconds);
	};
}])

appMindtube.config(function($interpolateProvider) {
	$interpolateProvider.startSymbol('{[{');
	$interpolateProvider.endSymbol('}]}');
});