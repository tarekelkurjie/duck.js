import * as THREE from '/threejs';
import { GLTFLoader } from '/threejs/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const loader = new GLTFLoader();

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

loader.load('/duck_with_sunglasses/scene.gltf', function ( gltf ) {
    scene.add(gltf.scene);
}, undefined, function ( error ) {
    console.error( error );
});


const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();