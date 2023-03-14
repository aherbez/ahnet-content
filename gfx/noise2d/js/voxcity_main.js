let scene = null;
let camera = null;
let renderer = null;
let cube = null;

let floor = null;

let c = null;

function init()
{
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    let geometry = new THREE.BoxGeometry(1, 1, 1);
    let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.y = 1;
    
    c = new Chunk();

    addFloor();

    camera.position.y = 2;
    camera.position.z = 5;

    render();
}

function addFloor()
{
    
    let floorGeo = new THREE.BoxGeometry(50, 0.1, 50);
    let floorMat = new THREE.MeshBasicMaterial({color: 0x888888});

    floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = 0;
    scene.add(floor);
    
    // console.log('added floor');
}


function update()
{
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
}

function render()
{
    update();
    
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

init();