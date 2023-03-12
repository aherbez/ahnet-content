/*
Map.js

responsible for drawing a map and managing data points 
*/

var MAP_URL = 'usa_blank.jpg';
var MAP_WIDTH = 800;
var MAP_HEIGHT = 400;

// constructor
function Map(canvas)
{	
	var m = new Object();
	m.data = new Array();
	m.display_year = 1970;
	
	m.canvas = canvas;
	m.ctx = m.canvas.getContext('2d');
	m.background = new Image();
	m.background.src = MAP_URL;
	
	// reads in all the data to be displayed
	// data_in: JSON string of all the data
	// [{"age":1,"value":13453,"state":1,"year":2011}]
	m.setData = function(data_in) {
		console.log('setting data');		
		var data_obj = eval(data_in);
	
		for (var i=0; i<data_obj.length; i++)
		{
			console.log('making data point');
			this.data.push(DataPoint(data_obj[i],this.ctx));
		}
	};
	
	m.update = function() {
		
		// clear the map
		this.ctx.clearRect(0,0,MAP_WIDTH,MAP_HEIGHT);
		this.ctx.drawImage(this.background,0,0);
		
		// run through all of the data points
		for (var i=0; i<this.data.length; i++)
		{
			// draw them if we're on that year
			this.data[i].update(this.display_year);
		}
	};
	
	m.setYear = function(new_year) {
		this.display_year = new_year;
		this.update();
	};
	
	m.update();
	
	return m;
}