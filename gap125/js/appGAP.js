var app = angular.module('appGap125', []);

var MAX_CLASS = 14;

app.controller('gapCtrl', ['$scope', function($scope) {

	$scope.topics = [];

	for (var i=0; i<topics.length; i++)
	{
		$scope.topics[i] = topics[i];
		$scope.topics[i].enabled = i < MAX_CLASS;
		$scope.topics[i].quizup = i < MAX_CLASS - 2;
	}

	console.log('STARTING');

	$scope.showSessions = true;
	$scope.showQuizzes = true;
	$scope.currSection = 1;
	$scope.currClass = -1;
	$scope.currQuiz = -1;

	$scope.showSection = function (which) {
		$scope.currClass = -1;
		$scope.currQuiz = -1;
		$scope.currSection = which;
		console.log(which);

	};

	$scope.gotoQuiz = function (which) {
		$scope.currQuiz = (which + 1);
		$scope.currClass = -1;
		$scope.currSection = -1;
	};

	$scope.gotoSession = function(which) {
		$scope.currClass = (which + 1);
		$scope.currSection = -1;
		$scope.currQuiz = -1;
	};
	
	$scope.toggleQuizzes = function() {
		$scope.showQuizzes = !$scope.showQuizzes;
		$scope.showSessions = !$scope.showQuizzes;
	};

	$scope.toggleSessions = function() {
		$scope.showSessions = !$scope.showSessions;
		$scope.showQuizzes = !$scope.showSessions;
	};
}]);


var topics = [
	{"week": 1, "topic": "Introduction"},
	{"week": 2, "topic": "Variables & Branching"},
	{"week": 3, "topic": "Variables continued, more control, random numbers"},
	{"week": 4, "topic": "Functions"},
	{"week": 5, "topic": "Arrays, For Loops"},
	{"week": 6, "topic": "Introduction to the STL"},
	{"week": 7, "topic": "Debugging"},
	{"week": 8, "topic": "Pointers & References"},
	{"week": 9, "topic": "Dynamic Memory"},
	{"week": 10, "topic": "Classes"},
	{"week": 11, "topic": "Inheritance & Composition"},
	{"week": 12, "topic": "Writing data, binary vs text files"},
	{"week": 13, "topic": "Workshop day"},
	{"week": 14, "topic": "Workshop day / Review"},
	{"week": 15, "topic": "Final Project Presentations"}

];