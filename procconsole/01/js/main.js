const sizes = {
    width : 600,
    height : 600
};

const canvas = document.getElementById('stage');
const scene = new THREE.Scene();
scene.background = new THREE.Color('white'); 


const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 10;
scene.add(camera);

// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

const c = new Console();
// c.addToScene(scene);

const crts = [];
const num = 3;
const offset = ((num - 1)/2) * 3;
for (let i=0; i < num*num; i++) {
    let x = i % num;
    let y = Math.floor( i / num);


    let c = new Console();
    c.mesh.position.set(x * 3 - offset, y * 3 - offset, 0);
    c.addToScene(scene);
    crts.push(c);
}


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

c.mesh.rotation.y = 0;//-Math.PI;// * -0.22;
c.mesh.rotation.x = Math.PI * 0.2;

const tick = () => {

    let newTime = clock.getElapsedTime();
    let deltaTime = newTime - lastTime;

    /*
    c.mesh.rotation.y += 0.02;
    c.animate(newTime - lastTime);
    */
    crts.forEach(c => {
        c.mesh.rotation.y += (2 * deltaTime);
        c.animate(deltaTime);
    })

    lastTime = newTime;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
}

tick();