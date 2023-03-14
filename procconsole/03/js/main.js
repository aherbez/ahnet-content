const sizes = {
    width : 600,
    height : 600
};

const canvas = document.getElementById('stage');
const scene = new THREE.Scene();
scene.background = new THREE.Color('white'); 


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.y = 0.2;
camera.position.z = 3.5;
scene.add(camera);

// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;
const crts = [];

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

function initCodeEditor() {
    editor = ace.edit("code");
    editor.setTheme("ace/theme/monokai");
    editor.session.setMode("ace/mode/javascript");
}

initCodeEditor();

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.clearColor = '#FFFFFF';

const clock = new THREE.Clock()
let lastTime = clock.getElapsedTime();


let b = new GamepadButton();
b.addTo(scene);
b.mesh.rotation.x = -Math.PI * 0.32;

const tick = () => {

    let newTime = clock.getElapsedTime();
    let deltaTime = newTime - lastTime;

    b.mesh.rotation.z += 0.05;

    crts.forEach( c => {
        c.animate(deltaTime);
    })


    lastTime = newTime;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();