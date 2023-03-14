var canvas = null;
var ctx = null;
var fps = 1000/30;

var pages;
var currPage;

function init()
{
	canvas = document.getElementById('stage');
	ctx = canvas.getContext('2d');

	pages = new Array();

	currPage = new BookPage(ctx);
	currPage.pageText = 'Foo and bar and hello world';
	currPage.nextPage = function() {
		alert('FOO');
		nextPage();
	};
	currPage.activate();

	document.onmousedown = mouseDown;

	setInterval(update, fps);
}

function nextPage()
{
	alert('next!');
}

function mouseDown(e)
{
	// alert(e);
	currPage.startAnim();
}

function update()
{
	// currPage.draw(ctx);
	currPage.update(fps);
}



init();