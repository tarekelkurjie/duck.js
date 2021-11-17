import * as THREE from 'https://cdn.skypack.dev/three@0.134.0';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.134.0/examples/jsm/controls/OrbitControls'

let camera, scene, renderer, duck, hue = 1, direction= 1, pointLight, obama;

const loader = new GLTFLoader();

document.addEventListener('keydown', (event) => {
    var name = event.key;
    
    if (name === "r") {
        loadObama()
    }
}, false);

document.addEventListener('click', (e) => {
    if (e.target.id == 'git') return;
    document.getElementById('duck').remove()
    document.getElementById('subtitle').remove()
    document.getElementById('soCool').remove()
    document.getElementById('muchWow').remove()
    init()
})

function init () {
    document.body.style.cursor = 'auto';

    var audio = new Audio('src/running_in_the_90s.mp3');
    audio.play();

    const container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.25, 20);
    camera.position.x = 4;
    camera.position.z = 5;
    camera.position.y = 3;

    scene = new THREE.Scene();

    pointLight = new THREE.PointLight(0xffffff, 1.5); pointLight.position.set(0, 100, 90);
    scene.add(pointLight);

    loader.load('src/duck.glb', function (gltf) {

        scene.add(gltf.scene);

        render();

        duck = gltf.scene;

        window.requestAnimationFrame(duckRotate)

    }, undefined, function (error) {

        console.error(error);

    } );

    window.requestAnimationFrame(rave)

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.minDistance = 4;
    controls.maxDistance = 15;
    controls.target.set(0, 0, - 0.2);
    controls.update();

    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function render() {
    renderer.render(scene, camera);
}

function duckRotate() {
    if (duck) {
        duck.rotation.y += 0.265;
        render()
    }

    window.requestAnimationFrame(duckRotate)
}

function rave () {
    hue += direction;
    if (hue > 210) {
        direction *= -1;
        hue=210;
    }
    if (hue < 0) {
        direction *= -1;
        hue = 0;
    }
    pointLight.color = new THREE.Color(`hsl(${hue}, 100%, 50%)`);

    pointLight.power = 15;

    console.log(hue)

    window.requestAnimationFrame(rave)
}

function loadObama () {
    loader.load('src/obama_prism.glb', function (gltf) {

        scene.add(gltf.scene);

        render();

        duck = gltf.scene;

        window.requestAnimationFrame(obamaSpin)

    }, undefined, function (error) {
        console.error(error);
    });
}
function obamaSpin () {

}