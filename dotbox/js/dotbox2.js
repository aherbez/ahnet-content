var container;
var textureLoader, modelLoader;
var camera, scene, renderer;

var mouseX = 0, mouseY = 0;
var animating;

var windowHalfX = window.innerWidth/2;
var windowHalfY = window.innerHeight/2;

var spot;

var raycaster;
var mousePos;

/*
	{"y": "3.233", "x": "0.00", "z": "-0.682", "obj": "latch", "tex": "latch.jpg", "id": "latchTop"},
	{"y": "3.15", "x": "0.00", "z": "-11.74", "obj": "boxTop", "tex": "boxBot.jpg", "id": "boxTop"}, 
	y: 0.083, z: 11.062
*/


var objectData = [ 
	{"y": "0.00", "x": "0.00", "z": "0.00", "obj": "side_back", "tex": "boxtex_sm.jpg", "id": "back"},
	{"y": "0.00", "x": "0.00", "z": "0.00", "obj": "side_bottom", "tex": "boxtex_sm.jpg", "id": "bottom"},
	{"y": "0.00", "x": "0.00", "z": "0.00", "obj": "side_front", "tex": "boxtex_sm.jpg", "id": "front"},
	{"y": "0.00", "x": "0.00", "z": "0.00", "obj": "side_left", "tex": "boxtex_sm.jpg", "id": "left"},
	{"y": "0.00", "x": "0.00", "z": "0.00", "obj": "side_right", "tex": "boxtex_sm.jpg", "id": "right"},
	{"y": "0.00", "x": "0.00", "z": "0.00", "obj": "side_top", "tex": "boxtex_sm.jpg", "id": "top"}
	];


var DOT_POS = [[-1, 1], [0, 1], [1,1], [-1, 0], [1, 0], [-1, -1], [0, -1], [1,-1]];
var DOT_POS_DIST = 1.37;


/*
front
right
back
left
top
bottom
*/

var FRONT 	= 0;
var RIGHT 	= 1;
var BACK 	= 2;
var LEFT 	= 3;
var TOP 	= 4;
var BOTTOM 	= 5;

var TURN_LEFT 	= 0;
var TURN_UP 	= 1;
var TURN_RIGHT 	= 2;
var TURN_DOWN 	= 3;

var SIDE_NAMES = ['LEFT', 'UP', 'RIGHT', 'DOWN'];

var SIDE_LOOKUP = [[LEFT, TOP, RIGHT, BOTTOM],
					[FRONT, TOP, BACK, BOTTOM],
					[RIGHT, TOP, LEFT, BOTTOM],
					[BACK, TOP, FRONT, BOTTOM],
					[LEFT, BACK, RIGHT, FRONT],
					[LEFT, FRONT, RIGHT, BACK]];


var DOTS_ROTATIONS = [[0,0,0], [0, 1, 0], [0, 2, 0], [0, -1, 0], [-1, 0, 0], [1, 0, 0]];
var SIDE_ROTS = [ [0, 0, 0],
					[0, -1, 0],
					[0, 2, 0],
					[0, 1, 0],
					[1, 0, 0],
					[-1, 0, 0]];

var models = [];
var dotBases = [];
var dots = [];


var currSide = FRONT;

var dotMat;

var textures = ['boxtex_sm.jpg'];
var textureResources = {};

var wheelRots = [0,0,0];
var currCode = [0,0,0];

// variables for models
var modelHash = {};

var currTex = 0;

var boxtex;

var cubeBase;
var camLookAt;

var modelToLoad = 0;

var rotTarget = [0,0,0];
var rotating = false;


var solved = false;

var fullyInitialized = false;

function onProgress(xhr)
{
	if (xhr.lengthComputable) {
		var percentComplete = xhr.loaded / xhr.total * 100;
	}
};

function onError(xhr) {

};


function loadModel(data, onComplete)
{
	var src = data.obj;

	modelLoader.load('assets/' + src + '.obj', function (object) {
				
		object.traverse(function (child) {
			if (child instanceof THREE.Mesh) {
				child.material.map = textureResources[data.tex];
			}
		});

		models.push(object);
		object.position.x = data.x;
		object.position.y = data.y;
		object.position.z = data.z;

		if (typeof data.id != 'undefined')
		{
			modelHash[data.id] = object;
		}

		currTex++;
	
		scene.add(object);

		if (onComplete)
		{
			onComplete();
		}
	}, onProgress, onError);
}

function loadNextTexture()
{
	if (currTex >= textures.length)
	{
		console.log('TEXTURES FINISHED!');
		modelToLoad = 0;
		loadNextModel();
		return;
	}

	console.log('LOADING TEXTURE ' + (currTex+1) + ' of ' + textures.length);

	textureLoader.load('assets/' + textures[currTex], function (image) {
		
		textureResources[textures[currTex]] = new THREE.Texture();
		textureResources[textures[currTex]].image = image;
		textureResources[textures[currTex]].needsUpdate = true;

		currTex++;
		loadNextTexture();
	
	});	
}

function loadNextModel()
{
	
	if (modelToLoad >= objectData.length) 
	{
		console.log('FINISHED LOADING MODELS');
		finalizeInit();
		return;
	}

	console.log('LOADING MODEL: ' + (modelToLoad+1) + ' of ' + objectData.length);

	loadModel(objectData[modelToLoad], function() {
			modelToLoad++;
			loadNextModel();
		});
}


function turnToSide(side)
{
	var rots = { x: cubeBase.rotation.x,
				 y: cubeBase.rotation.y,
				 z: cubeBase.rotation.z};
	
	var target = { 	x: SIDE_ROTS[side][0] * Math.PI/2,
					y: SIDE_ROTS[side][1] * Math.PI/2,
					z: SIDE_ROTS[side][2] * Math.PI/2 };

	var tween = new TWEEN.Tween(rots).to(target, 1000);	
	tween.onUpdate(function()
	{
		// document.getElementById('message').style.marginTop = position.y+"px";
		cubeBase.rotation.x = rots.x;
		cubeBase.rotation.y = rots.y;
		cubeBase.rotation.z = rots.z;
	});

	
	tween.start();

}

function addDots(side)
{
	if (!dotMat)
	{
		dotMat =
	  	new THREE.MeshLambertMaterial(
	    {
	      color: 0x00FF00,
	      transparent: true, 
	      opacity: 0.4
	    });

	}

	// if (side != 0) return;

	console.log('ADDING DOTS SIDE: ' + side);

	var dotBase = new THREE.Object3D();
	dotBases.push(dotBase);

	for (j=0; j<DOT_POS.length; j++)
	{
		var sphere = new THREE.Mesh(
			new THREE.SphereGeometry(
				0.4,
				16,
				16),
		dotMat);
		
		sphere.position.x = DOT_POS[j][0] * DOT_POS_DIST;
		sphere.position.y = DOT_POS[j][1] * DOT_POS_DIST;

		sphere.visible = false;

		sphere.position.z = 2.5;

		dotBase.add(sphere);	

		dots[side].push(sphere);
	}

	console.log(DOTS_ROTATIONS[side]);
	dotBase.rotation.x = DOTS_ROTATIONS[side][0] * Math.PI/2;
	dotBase.rotation.y = DOTS_ROTATIONS[side][1] * Math.PI/2;


	dotBases.push(dotBase);
	cubeBase.add(dotBase);

}


function finalizeInit()
{
	cubeBase = new THREE.Object3D();
	scene.add(cubeBase);

	cubeBase.add(modelHash['top']);
	cubeBase.add(modelHash['bottom']);
	cubeBase.add(modelHash['right']);
	cubeBase.add(modelHash['left']);
	cubeBase.add(modelHash['front']);
	cubeBase.add(modelHash['back']);

	console.log('ADDING DOTS');
	for (i=0; i<6; i++)
	{
		console.log(i);
		dots[i] = new Array();

		addDots(i);

	}


	fullyInitialized = true;
}


function init()
{
	mousePos = new THREE.Vector2();
	raycaster = new THREE.Raycaster();

	container = document.getElementById('container');

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000);

	var ambient = new THREE.AmbientLight(0x444444);
	scene.add(ambient);

	var directionalLight = new THREE.DirectionalLight(0xebc25e);
	directionalLight.position.set(-3, 3, 1);
	scene.add(directionalLight);

	renderer = new THREE.WebGLRenderer({alpha: true});
	renderer.setClearColor(0x000000, 0);
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	document.addEventListener('mousedown', onMouseDown, false);
	document.addEventListener( 'touchstart', onTouchStart, false );
	window.addEventListener('mousemove', onMouseMove, false);
	window.addEventListener('resize', onWindowResize, false);

	var manager = new THREE.LoadingManager();
	manager.onProgress = function(item, loaded, total) {
		// console.log(item, loaded, total);
	};

	scene.position.y = 0; // 1.2;

	camLookAt = new THREE.Object3D();
	scene.add(camLookAt);

	camLookAt.position.y = 0;
	camLookAt.position.z = 0;

	camera.position.y = 0;
	camera.position.z = 15;


	textureLoader = new THREE.ImageLoader(manager);
	modelLoader = new THREE.OBJLoader(manager);

	animating = false;
	solved = false;

	loadNextTexture();

	console.log('INIT');

}

function signDiff(a, b)
{
	if (a < b) return 1;
	if (a > b) return -1;
	return 0;
}


function onMouseMove(event)
{
	mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
	mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function onTouchStart( event ) {

	event.preventDefault();

	event.clientX = event.touches[0].clientX;
	event.clientY = event.touches[0].clientY;
	onMouseDown( event );

}


function checkSide(side)
{

}

function checkSolution()
{

}

function toggleDot(x, y)
{
	// dots[0][0].visible = !dots[0][0].visible;
	
	var index = 0;

	var xPos = x + 1;
	var yPos = y + 1;

	index = yPos * 3 + xPos;

	if (index != 4)
	{
		if (index > 4) index--;
		dots[currSide][index].visible = !dots[currSide][index].visible;
	}

	checkSolution();
}

function onMouseDown( event ) 
{

	event.preventDefault();

	mousePos.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
	mousePos.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;

	raycaster.setFromCamera( mousePos, camera );

	if (animating) return;

	var intersects;
	/*
	intersects = raycaster.intersectObject(modelHash['btn1'], true);
	if ( intersects.length > 0 ) {
		// console.log('btn1');
		rotateWheel(1, -1);
	}
	*/

	intersects = raycaster.intersectObject(cubeBase, true);
	// console.log(intersects);
	if (intersects.length > 0)
	{
		console.log(mousePos.x + ' : ' + mousePos.y);
	
		var xSlot = 0;
		var ySlot = 0;

		if (Math.abs(mousePos.x) > 0.1)
		{
			if (mousePos.x < 0)
			{
				xSlot = -1;
			}
			else
			{
				xSlot = 1;
			}
		}

		if (Math.abs(mousePos.y) > 0.1)
		{
			if (mousePos.y < 0)
			{
				ySlot = 1;
			}
			else
			{
				ySlot = -1;
			}	
		}

		toggleDot(xSlot, ySlot);
	}
	else
	{
		var turnTo = -1;


		if (Math.abs(mousePos.x) > Math.abs(mousePos.y))
		{
			if (mousePos.x > 0)
			{
				// currSide = (currSide + 1) % 6;
				turnTo = TURN_RIGHT;
			}
			else
			{
				// currSide--;
				// if (currSide < 0) currSide = 5;
				turnTo = TURN_LEFT;
			}
		}
		else
		{
			if (mousePos.y > 0)
			{
				turnTo = TURN_UP;
			}
			else
			{
				turnTo = TURN_DOWN;
			}
		}

		if (turnTo != -1)
		{

			console.log('TURNING ' + SIDE_NAMES[turnTo]);
			currSide = SIDE_LOOKUP[currSide][turnTo];
			turnToSide(currSide);
		}


	}

	// dots[0][0].visible = !dots[0][0].visible;

}


function onWindowResize()
{
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}


function update()
{
	requestAnimationFrame(update);
	render();
	TWEEN.update();
}

function checkSolution()
{
}

function render()
{
	if (fullyInitialized)
	{

		camera.lookAt(camLookAt.position);
		renderer.render(scene, camera);
	}

	if (fullyInitialized)
	{
		// cubeBase.rotation.y -= 0.01;
	}
}


init();
update();

// animate();