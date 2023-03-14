var app = angular.module('appHRC', []);


var timeline = null;
var fulltext = null;
var sourceText = null;

var startDateText = "1947-10-27"
var startDate;
var endDate;
var extents;

var dotDataByID;
var dotElements;
var dotSummaryEls;
var currDot = -1;

function init()
{
	if (timeline === null)
	{
		timeline = document.getElementById("timeline");
		fulltext = document.getElementById("fulltextContent");
		sourceText = document.getElementById("sourceText");
	}

	startDate = new Date(startDateText);
	endDate = new Date();

	extents = endDate - startDate;

	dotDataByID = [];
	dotElements = [];
	dotSummaryEls = [];

	for (var i=0; i < dots.length; i++)
	{

		dots[i].dateObj = new Date(dots[i].date);
		dots[i].datePercent = (dots[i].dateObj - startDate) / extents;

		addDot(dots[i]);
	}
}

function clickDot(dotID)
{
	console.log('CLICKED DOT: ' + dotID);
	// alert(dotID);

	fulltext.innerHTML = dotDataByID[currDot].fulltext;
	sourceText.innerHTML = 'source: <a href="' + dotDataByID[currDot].source + '">' + dotDataByID[currDot].source + '</a>';


}

function mouseOverDot(dotID)
{
	console.log('MOUSE OVER DOT: ' + dotID);

	currDot = dotID;

	if (dotSummaryEls[currDot])
	{
		dotSummaryEls[currDot].style.display = "block";
		
	}




}

function mouseOutDot()
{
	console.log('MOUSE OUT DOT: ' + currDot);

	if (dotSummaryEls[currDot])
	{
		dotSummaryEls[currDot].style.display = "none";
	}	


	/*
	var link = document.createElement("A");
	link.href = dotDataByID[currDot].source;
	link.innerHTML = dotDataByID[currDot].source;

	fulltext.appendChild(link);
	*/
	// fulltext.innerHTML = "";

	currDot = -1;
}

function makeMouseOverDot(dotID)
{
	return function() { mouseOverDot(dotID); };
}

function makeClickDot(dotID)
{
	return function() {clickDot(dotID);}
}

function addDot(dotInfo)
{
	// alert(dotInfo.summary);

	var newDot = document.createElement("DIV");
	newDot.className = "dot";
	newDot.style.left = (dotInfo.datePercent*100) + "%";

	newDot.onmousedown = makeClickDot(dotInfo.id);
	newDot.onmouseover = makeMouseOverDot(dotInfo.id);
	newDot.onmouseout = mouseOutDot;

	timeline.appendChild(newDot);


	var summary = document.createElement("DIV");
	summary.className = "dotSummary";
	summary.innerHTML = dotInfo.summary;
	summary.style.left = (dotInfo.datePercent*100) + "%";
	summary.style.display = "none";

	timeline.appendChild(summary);


	dotDataByID[dotInfo.id] = dotInfo;
	dotElements[dotInfo.id] = newDot;
	dotSummaryEls[dotInfo.id] = summary;


	console.log('ADDED DOT AT: ' + dotInfo.datePercent);
}

app.controller('hrcCtrl', ['$scope', function($scope) {

	/*
	$scope.topics = [];

	for (var i=0; i<topics.length; i++)
	{
		$scope.topics[i] = topics[i];
		$scope.topics[i].enabled = i < MAX_CLASS;
		$scope.topics[i].quizup = i < MAX_CLASS - 2;
	}
	*/


	console.log('STARTING');

	init();



	/*
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
	*/

}]);


var dots = [
	{"id": 1, "date": "1996-01-25", "topics": [1,2,5], "summary": "She called minority children 'superpredators'", "fulltext": "In speaking about crime, Clinton said that certain children were 'superpredators' that needed to be 'brought to heel'", "source": "https://www.youtube.com/watch?v=ALXulk0T8cg&ab_channel=JesseJosephWalker"},
	{"id": 2, "date": "1982-11-21", "topics": [1,2,5], "summary": "She laughed about her defense of a child rapist", "fulltext": "Hillary Clinton defended a man accussed of raping a 12-year old girl, then later laughed about how it convinced her that lie detector tests don't work", "source": "https://www.youtube.com/watch?v=Tor00iWUhDQ&ab_channel=HILLARYforPRISONin2016!"},
	{"id": 3, "date": "1964", "topics": [1,2,5], "summary": "Clinton worked for Republican Barry Goldwater", "fulltext": "Hillary Clinton volunteered for Goldwater, who fought against the Civil Rights Act of 1964", "source": "http://www.factcheck.org/2008/03/hillary-worked-for-goldwater/"}
];


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
	{"week": 12, "topic": "Polymorphism"},
	{"week": 13, "topic": "File and Project organization"},
	{"week": 14, "topic": "Review"},
	{"week": 15, "topic": "Final Project Presentations"}

];