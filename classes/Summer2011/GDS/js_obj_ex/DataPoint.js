var STATE_LOCATIONS = new Array();
STATE_LOCATIONS[1] = [70,300];  // CA
STATE_LOCATIONS[2] = [100,120]; // OR
// etc, etc- more state centers

// different colors for the different age ranges
var COLORS = new Array();
COLORS[0] = "rgb(200,0,0)";
COLORS[1] = "rgb(0,200,0)";
COLORS[2] = "rgb(0,0,200)";

// values used to scale the resulting bar
var VALUE_MAX = 1000;
var HEIGHT_MAX = 100;

// constructor
function DataPoint(data_in,ctx_in)
{
	console.log('new data point');
	var o = new Object();
	o.value = data_in.value ;
	o.year = data_in.year;
	o.age = data_in.age;
	o.state = data_in.state;
	o.height = o.value/VALUE_MAX * HEIGHT_MAX;
	o.ctx = ctx_in;
	
	o.update = function(in_year) {
		console.log('datapoint.update');
		if (in_year == this.year)
		{
			this.draw();
		}
	};
	
	o.draw = function() {
		console.log('drawing');
		this.ctx.fillStyle = COLORS[this.age];
		this.ctx.fillRect(STATE_LOCATIONS[this.state][0]+10,
							STATE_LOCATIONS[this.state][1],
							20,-this.height);
	};
	return o;
	
}

