// import { OrbitControls } from "./libs/OrbitControls";
let renderer, camera, scene, controls;
const crts = [];

let gampad = null;
let clock, lastTime;

const buttonKeys = {
    'z': 0,
    'x': 1,
    'c': 2,
    'v': 3,
    'b': 4,
    'n': 5,
    'm': 6
};

const sizes = {
    width : 600,
    height : 600
}

function initCodeEditor() {
    editor = ace.edit("code");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/javascript");
}


function makeCRTGrids() {
    const num = 1;
    const offset = ((num - 1)/2) * 3;
    for (let i=0; i < num*num; i++) {
        let x = i % num;
        let y = Math.floor( i / num);

        let c = new Display();
        c.mesh.position.set(x * 3 - offset, y * 3 - offset, 0);
        c.addToScene(scene);
        crts.push(c);
    }

    crts.forEach( c => {
        c.mesh.rotation.y = Math.PI * -0.12;
        c.mesh.rotation.x = Math.PI * 0.1;    
    })
    
}
// makeCRTGrids();

function tick() {
    let newTime = clock.getElapsedTime();
    let deltaTime = newTime - lastTime;

    // b.root.rotation.z += 0.025;

    crts.forEach( c => {
        c.animate(deltaTime);
    })

    lastTime = newTime;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

function init() {
    const canvas = document.getElementById('stage');
    scene = new THREE.Scene();
    scene.background = new THREE.Color('white'); 
    
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
    camera.position.y = 0.2;
    camera.position.z = 4.5;
    scene.add(camera);

    renderer = new THREE.WebGLRenderer({
        canvas: canvas
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    clock = new THREE.Clock()
    lastTime = clock.getElapsedTime();

    gamepad = new Gamepad();
    gamepad.root.position.x = -4;
    gamepad.addTo(scene);
    gamepad.root.rotation.x = -Math.PI * 0.32;
    
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    camera.position.set(0, 10, 10);
    controls.update();

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    // initCodeEditor();
    tick();
}

function onKeyDown(evt) {
    const k = evt.key;
    if (buttonKeys[k] !== undefined) {     
        gamepad.setButtonState(buttonKeys[k], true);
    }

}

function onKeyUp(evt) {
    const k = evt.key;
    if (buttonKeys[k] !== undefined) {
        gamepad.setButtonState(buttonKeys[k], false);
    }
}



init();