var container;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth/2;
var windowHalfY = window.innerHeight/2;

var spot;
var dotbox;

var sides;

var rayCast;
var mousePos;

/*

0:	top
1:	front
2:	right
3:	back
4:	left
5:	bottom

*/

/*

rotations:
0: right
1: down
2: left
3: up
-1: nil

*/

var DIR_NONE	= -1;
var DIR_RIGHT 	= 0;
var DIR_DOWN 	= 1;
var DIR_LEFT 	= 2;
var DIR_UP 		= 3;

var modelSrcs = ['side_top.obj',
				'side_front.obj',
				'side_right.obj',
				'side_back.obj',
				'side_left.obj',
				'side_bottom.obj'];
var models = [];

var boxtex;

var cubeBase;

var modelLoader;
var modelToLoad = 0;

var rotTarget = [0,0,0];
var rotating = false;

function onProgress(xhr)
{
	if (xhr.lengthComputable) {
		var percentComplete = xhr.loaded / xhr.total * 100;
		console.log(Math.round(percentComplete, 2) + '% downloaded');
	}
};

function onError(xhr) {

};

function loadModels()
{
	sides = [];

	var manager = new THREE.LoadingManager();
	manager.onProgress = function(item, loaded, total) {
		console.log(item, loaded, total);
	};

	cubeBase = new THREE.Object3D();
	scene.add(cubeBase);

	boxtex = new THREE.Texture();

	var loader = new THREE.ImageLoader(manager);
	loader.load('assets/boxtex_sm.jpg', function (image) {
		boxtex.image = image;
		boxtex.needsUpdate = true;
	});

	modelLoader = new THREE.OBJLoader(manager);


	loadNextModel();
}

function loadNextModel()
{
	if (modelToLoad < modelSrcs.length)
	{
		modelLoader.load('assets/' + modelSrcs[modelToLoad], function (object) {
			object.traverse(function (child) {
				if (child instanceof THREE.Mesh) {
					child.material.map = boxtex;
				}
			});

			models.push(object);

			modelToLoad++;
			loadNextModel();

			// object.position.y = - 80;
			cubeBase.add(object);
		}, onProgress, onError);
	}
}


function init()
{
	rayCast = new THREE.Raycaster();
	mousePos = new THREE.Vector2();

	// container = document.createElement('div');
	// document.body.appendChild(container);
	container = document.getElementById('container');

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.z = 10;

	var geometry = new THREE.BoxGeometry(3, 7, 3);
	var material = new THREE.MeshLambertMaterial({color: 0x0000FF});
	var cube = new THREE.Mesh(geometry, material);
	// scene.add(cube);

	// dotbox = cube;

	var ambient = new THREE.AmbientLight(0x101030);
	scene.add(ambient);

	spot = new THREE.SpotLight(0xFFFFFF);
	spot.position.set(0, 100, -100);
	spot.castShadow = true;
	spot.shadowMapWidth = 1024;
	spot.shadowMapHeight = 1024;
	spot.shadowCameraNear = 500;
	spot.shadowCameraFar = 4000;
	spot.shadowCamersFov = 30;

	var directionalLight = new THREE.DirectionalLight(0xffeedd);
	directionalLight.position.set(0, 0, 1);
	scene.add(directionalLight);

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	document.addEventListener('mousedown', onMouseDown, false);
	document.addEventListener('touchstart', onTouch, false);
	document.addEventListener('mousemove', onMouseMove, false);

	window.addEventListener('resize', onWindowResize, false);

	loadModels();

	console.log('INIT');

}

function onTouch(event)
{
	alert('touched! ' + event);
	onMouseDown(event);
}


function onMouseDown(event)
{
	console.log('mousePos: ' + mousePos.x + ',' + mousePos.y);
	rayCast.setFromCamera(mousePos, camera);

	var intersects = rayCast.intersectObjects(scene.children);

	console.log(intersects);
	for (var i = 0; i < intersects.length; i++)
	{
		intersects[i].object.material.color.set(0x00ff00);
	}


	var xpos = event.clientX - window.innerWidth/2;
	var ypos = event.clientY - window.innerHeight/2;

	if (rotating) return;

	if (xpos > 0)
	{
		rotateCube(DIR_RIGHT);
	}
	else
	{
		rotateCube(DIR_LEFT);
	}

	// console.log(xpos + ',' + ypos);
}

function rotateCube(direction)
{
	rotating = true;

	switch (direction)
	{
		case (DIR_RIGHT):
		{
			rotTarget[1] += Math.PI/2;
			break;
		}
		case (DIR_LEFT):
		{
			rotTarget[1] -= Math.PI/2;
			break;
		}
		case (DIR_DOWN):
		{
			break;
		}
		case (DIR_UP):
		{
			break;
		}
	}

}

function signDiff(a, b)
{
	if (a < b) return 1;
	if (a > b) return -1;
	return 0;
}

function updateRotations()
{
	var continueRotating = false;

	var rotateSpeed = 0.01;

	if (Math.abs(cubeBase.rotation.x - rotTarget[0]) > rotateSpeed * 1.5)
	{
		cubeBase.rotation.x += rotateSpeed * signDiff(cubeBase.rotation.x, rotTarget[0]);
		continueRotating = true;
	}
	if (Math.abs(cubeBase.rotation.y - rotTarget[1]) > rotateSpeed * 1.5)
	{
		// console.log(cubeBase.rotation.y + ',' + rotTarget[1]);
		cubeBase.rotation.y += rotateSpeed * signDiff(cubeBase.rotation.y, rotTarget[1]);
		continueRotating = true;
	}
	if (Math.abs(cubeBase.rotation.z - rotTarget[2]) > rotateSpeed * 1.5)
	{
		cubeBase.rotation.z += rotateSpeed * signDiff(cubeBase.rotation.z, rotTarget[2]);
		continueRotating = true;
	}

	if (!continueRotating)
	{
		// were we rotating?
		if (rotating)
		{
			cubeBase.rotation.x = rotTarget[0];
			cubeBase.rotation.y = rotTarget[1];
			cubeBase.rotation.z = rotTarget[2];
		}

		rotating = false;
	}
}

function onMouseMove(event)
{
	mousePos.x = (event.clientX / window.innerWidth) * 2 - 1;
	mousePos.y = -(event.clientY / window.innerHeight) * 2 + 1;
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
}

function render()
{
	if (cubeBase)
	{
		// cubeBase.rotation.y += 0.01;
	}
	// scene.rotation.y += 0.01;

	updateRotations();

	camera.lookAt(scene.position);
	renderer.render(scene, camera);
}


init();
update();

// animate();
