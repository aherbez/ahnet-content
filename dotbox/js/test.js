var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight,
	0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,
	window.innerHeight);
document.body.appendChild(renderer.domElement);

var model;

var geometry = new THREE.BoxGeometry(3, 7, 3);
var material = new THREE.MeshLambertMaterial({color: 0x00FF00});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 10;

var light = new THREE.AmbientLight(0x404040);
scene.add(light);

var spot = new THREE.SpotLight(0xFFFFFF);
spot.position.set(0, 100, -100);
spot.castShadow = true;
spot.shadowMapWidth = 1024;
spot.shadowMapHeight = 1024;
spot.target = cube;
spot.intensity = 0.2;

spot.shadowCameraNear = 500;
spot.shadowCameraFar = 4000;
spot.shadowCamersFov = 30;

scene.add(spot);

var manager = new THREE.LoadingManager();

// var loader = new THREE.OBJLoader(manager);
var loader = new THREE.OBJLoader();

loader.load('assets/dotbox.obj', function(object) {
	model = object;
	scene.add(object);
})


function render()
{
	cube.rotation.y += 0.01;
	// cube.rotation.z += 0.1;
	if (model != null)
	{
		model.rotation.y += 0.01;
	}

	requestAnimationFrame(render);
	renderer.render(scene, camera);
}

render();
