var app = angular.module('appSSC', []);

app.controller('sscCtrl', ['$scope', '$window', function($scope, $window) {

	$scope.dlURL = "./ssc01.zip";

	// $scope.terminalIn = "foo";
	// console.log($window);

	$scope.checkInput = function(event) {
		// alert($event.keyCode);
		if (event.keyCode == 13)
		{
			$scope.processCommand($scope.terminalIn);
			$scope.terminalIn = "";
		}
	};


	$scope.processCommand = function(comIn)
	{

		var com = comIn.toLowerCase();

		if (com == "download" || com == "dl")
		{
			// alert('downloading');
			$window.location.href = $scope.dlURL;
		}
	}


}]);
