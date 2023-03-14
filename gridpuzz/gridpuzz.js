var questionDiv;
var controlsDiv;

var canvas;
var ctx;

var WIDTH = 500;
var HEIGHT = 500;

var DIVISIONS = 10;

var OFFSET = 20;

function toggleControls()
{
	if (controlsDiv.style.visibility == "hidden")
	{
		controlsDiv.style.visibility = "visible";
	}
	else
	{
		controlsDiv.style.visibility = "hidden";
	}
}


function main()
{
	questionDiv = document.getElementById("questions");
	controlsDiv = document.getElementById("controls");

	canvas = document.getElementById("graph");

	ctx = canvas.getContext('2d');
}

function addQuestion()
{
	// alert('new question');

	var qNum = questionDiv.children.length;

	var div = document.createElement('DIV');
	var l1 = document.createElement('LABEL');
	l1.appendChild(document.createTextNode("Question:"));
	div.appendChild(l1);

	var q = document.createElement('INPUT');
	q.className = "question";
	// q.value = "question text";
	// q.appendChild(document.createTextNode("Q"+qNum));
	div.appendChild(q);

	var l2 = document.createElement('LABEL');
	l2.appendChild(document.createTextNode("Answer:"));
	div.appendChild(l2);

	var a = document.createElement('INPUT');
	a.className = "answer";
	// a.value = "A"+qNum;
	div.appendChild(a);

	questionDiv.appendChild(div);
}

function makeImage()
{
	ctx.clearRect(0, 0, 800, 800);

	drawGrid();

	addAnswers();
	addExtras();

}

function drawGrid()
{
	var gap;


	ctx.beginPath();
	ctx.moveTo(0+OFFSET, (HEIGHT/2)+OFFSET);
	ctx.lineTo(WIDTH+OFFSET, (HEIGHT/2)+OFFSET);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo((WIDTH/2)+OFFSET, 0+OFFSET);
	ctx.lineTo((WIDTH/2)+OFFSET, HEIGHT+OFFSET);
	ctx.stroke();

	ctx.font = "12px Arial";
	ctx.textAlign = "center";

	var num;

	gap = WIDTH/DIVISIONS;
	for (var i=0; i <= DIVISIONS; i++)
	{
		ctx.beginPath();
		ctx.moveTo((i*gap)+OFFSET, (HEIGHT/2)-10+OFFSET);
		ctx.lineTo((i*gap)+OFFSET, (HEIGHT/2)+10+OFFSET);
		ctx.stroke();

		num = (i-DIVISIONS/2);

		ctx.fillText(""+num, (i*gap)+OFFSET, (HEIGHT/2)+20+OFFSET);


		ctx.beginPath();
		ctx.moveTo((WIDTH/2)-10+OFFSET, (i*gap)+OFFSET);
		ctx.lineTo((WIDTH/2)+10+OFFSET, (i*gap)+OFFSET);
		ctx.stroke();

		num = DIVISIONS/2 - i;

		ctx.fillText(""+num, (WIDTH/2)+20+OFFSET, (i*gap)+6+OFFSET);

	}
}

function addDot(text, x, y)
{
	gap = WIDTH / DIVISIONS;

  	ctx.beginPath();
  	ctx.arc(x * gap+OFFSET, y * gap+OFFSET, 5, 0, 2*Math.PI, false);
  	ctx.fill();	
	ctx.textAlign = "center";

	ctx.fillText(text, (x*gap)+OFFSET, (y*gap) + 20+OFFSET);	
}

function addAnswers()
{
	var s = "";
	var q;
	var qText;
	var aText;

	var x,y;
	var xcoord, ycoord;
	var gap;

	for (var i=0; i<questionDiv.children.length; i++)
	{
		q = questionDiv.children[i];

		qText = q.children[1].value;
		aText = q.children[3].value;
	
		x = Math.floor(Math.random() * DIVISIONS);
		y = Math.floor(Math.random() * DIVISIONS);

		xcoord = x - (DIVISIONS/2);
		ycoord = (DIVISIONS/2) - y;

		addDot(aText, x, y);

		qText = qText + ' (' + xcoord + ',' + ycoord + ') __________________';
		ctx.textAlign = "left";
		ctx.fillText(qText, OFFSET, (OFFSET*2)+HEIGHT+(i*20)+20);
	}


}

function addExtras()
{
	var eText = document.getElementById("extras").value;

	var extras = eText.split(',');

	var x,y;

	for (var i=0; i < extras.length; i++)
	{
		x = Math.floor(Math.random() * DIVISIONS);
		y = Math.floor(Math.random() * DIVISIONS);
		addDot(extras[i], x, y);		
	}
}

function listQuestions()
{
	// alert(questionDiv.children);
	var s = "";
	var q;
	for (var i=0; i<questionDiv.children.length; i++)
	{
		// s += questionDiv.children[i] + ' ';
		q = questionDiv.children[i];

		for (var j=0; j<q.children.length; j++)
		{
			if (q.children[j].nodeName == "INPUT")
			{
				s += q.children[j].value + ' ';
			}
		}

	}

	console.log(s);

}