import './style.css'
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let camera, 
    scene, 
    renderer, 
    duck, 
    hue = 0, 
    direction= 1, 
    pointLight, 
    obamas = [],
    didInit = false, 
    obamaSpun = false, 
    audio,
    gitHue = 0,
    gitDirection = 1,
    bgHue = 0,
    bgDirection = -1,
    stopRave = true;

var r = 5;
var theta = 0;
var dTheta = 2 * Math.PI / 1000;

function rand() {
    let r = Math.random();

    if (r > 0.4 && r < 0.8) {
        return r;
    } else {
        r = rand();
        return r;
    }
}

const loader = new GLTFLoader();

chooseSplash()
//gitRave()

function addCommands() {
    document.getElementById("cmd").style.display = "block";
    document.getElementById("cmd").focus()
}

function remCommands() {
    document.getElementById("cmd").style.display = "none";
    document.getElementById("error").style.display = "none";
}

if (document.getElementById("cmd")) {
    const textField = document.getElementById("cmd")
    textField.addEventListener('keydown', (e) => {
        if (e.key === "Enter") {
            let commandVal = textField.value;
            let command = commandVal.split(' ')[0];
            document.getElementById("error").style.display = "none";

            if (command == "/toggleRave") {
                stopRave = !stopRave;
                bgRave();
                remCommands();
                if (didInit == false) {init(); didInit = true}
            } else if (command == "/removeObamas") {
                removeObama();
                remCommands();
                if (didInit == false) {init(); didInit = true}
            } else {
                let parse = require('./interpreter')
                let parsed;

                try {
                    parsed = parse(commandVal);
                } catch (error) {
                    document.getElementById("error").style.display = "block";
                    document.getElementById('error').innerHTML = error;
                    console.error(error);
                }

                if (command == "/obama") {
                    if (obamas.length <= 10000) {
                        let size;
                        if (parsed.default > 1000) {
                            parsed.default = 1000;
                        }

                        for (let x = 1; x <= parsed.default; x++) {
                            if (parsed['-S']) {size = parsed['-S']}
                            else if (parsed['--minsize']) {size = Math.random(parsed['--minsize'], parsed['--maxsize'])}
                            loadObama(size != undefined ? size : 1);
                        }
                    } else {
                        alert("exceeded maximum obamas!")
                    }
                }

                if (document.getElementById("error").style.display == "none") {
                    remCommands();
                }
            }
        } else if (e.key === "Escape") {
            remCommands();
        }
    })
}

document.addEventListener('keydown', (event) => {
    var name = event.key;
    
    if (document.activeElement == document.body) {
        if (name === "m") {
            let volumeElement = document.getElementById('volume');
            if (volumeElement.classList.contains("turnOff")) {
                audio.pause();
            } else {
                audio.play();
            }
            toggleVolumeIcon();
        }
    }
    if (name === "/") {
        addCommands();
    }

}, false);

document.addEventListener('click', (e) => {
    if (e.target.id == 'gitButton') return window.open('https://github.com/tarekelkurjie/duck.js', '_blank').focus
    if (e.target.id == 'volume') {
        let volumeElement = document.getElementById('volume');
        if (volumeElement.classList.contains("turnOff")) {
            audio.pause();
        } else {
            audio.play();
        }
        toggleVolumeIcon();
    }
}, false);

document.addEventListener('click', (e) => {
    if (e.target.id == 'git') return window.open('https://github.com/tarekelkurjie/duck.js', '_blank').focus
    if (e.target.id == 'volume') {
        let volumeElement = document.getElementById('volume');
        if (volumeElement.classList.contains("turnOff")) {
            audio.pause();
        } else {
            audio.play();
        }
        toggleVolumeIcon();
    };
    if (didInit) return;
    init()
    didInit = true;
})

function toggleVolumeIcon () {
    let volumeElement = document.getElementById('volume');
    volumeElement.classList.toggle("fa-volume-up");
    volumeElement.classList.toggle("turnOff");

    volumeElement.classList.toggle("fa-volume-mute");
    volumeElement.classList.toggle("turnOn");
}

function init () {

    document.getElementById('duck').remove()
    document.getElementById('subtitle').remove()
    document.getElementById('splash1').remove()
    document.getElementById('splash2').remove()

    document.getElementById('volume').style.display = 'block'
    document.body.style.cursor = 'auto';

    audio = new Audio('public/running_in_the_90s.mp3');
    audio.play();

    const container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.25, 20);
    camera.position.x = 4;
    camera.position.z = 5;
    camera.position.y = 3;

    scene = new THREE.Scene();

    pointLight = new THREE.PointLight(0xffffff, 1.5);
    pointLight.position.set(0, 100, 90);
    scene.add(pointLight);
  
    let ambient = new THREE.AmbientLight(0xffffff, .05);
    scene.add(ambient);

    loader.load('public/duck.glb', function (gltf) {
        scene.add(gltf.scene);

        render();

        duck = gltf.scene;

        window.requestAnimationFrame(duckRotate)

    }, undefined, function (error) {
        console.error(error);
    });

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

    // bgRave()

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

    window.requestAnimationFrame(rave)
}

function loadObama (size=1) {
    loader.load('public/obama_prism.glb', function (gltf) {

        gltf.scene.scale.set(size, size, size)
        scene.add(gltf.scene);
        

        obamas.push({
            obj: gltf.scene,
            seed: rand() * 2,
            direction: Math.round(Math.random()) ? -1 : 1
        });
        
        if (!obamaSpun) {
            window.requestAnimationFrame(obamaSpin)
        }
        
    }, undefined, function (error) {
        console.error(error);
    });
}

function removeObama() {
    for (let x = 0; x <= obamas.length - 1; x++) {
        scene.remove(obamas[x].obj)
    } 
    for (let x = 0; x <= obamas.length; x++) {
        obamas.splice(x, 1);
    } 
}

function obamaSpin () {
    theta += dTheta;
    obamaSpun = true;
    if (obamas.length) {
        for (let i = 0; i < obamas.length; i++) {
            obamas[i].obj.rotation.x += obamas[i].seed / 10;
            obamas[i].obj.rotation.z += obamas[i].seed / 10;
            obamas[i].obj.position.x = r * Math.cos(theta * i * obamas[i].direction);
            obamas[i].obj.position.z = r * Math.sin(theta * obamas[i].seed * i * obamas[i].direction);
            obamas[i].obj.position.y = r * Math.sin(theta * obamas[i].seed * obamas[i].direction);
        }
    }

    window.requestAnimationFrame(obamaSpin)
}

function gitRave () {
    let git = document.getElementById('git')

    gitHue += gitDirection;
    if (gitHue > 250) {
        gitDirection *= -1;
        gitHue = 250;
    }
    if (gitHue < 0) {
        gitDirection *= -1;
        gitHue = 0;
    }

    git.style.fill = `hsl(${gitHue}, 100%, 50%)`

    window.requestAnimationFrame(gitRave)
}

function bgRave () {
    bgHue += bgDirection;
    if (bgHue > 250) {
        bgDirection *= -1;
        bgHue = 250;
    }
    if (bgHue < 0) {
        bgDirection *= -1;
        bgHue = 0;
    }

    scene.background = new THREE.Color(`hsl(${bgHue}, 100%, 50%)`);
    if (stopRave == false) {
        window.requestAnimationFrame(bgRave)
        window.requestAnimationFrame(rave)
        window.cancelAnimationFrame(bgReset);
    } else if (stopRave == true) {
        bgReset();
        return;
    }
}


function bgReset () {
    scene.background = new THREE.Color('rgb(0, 0, 0)');
    window.cancelAnimationFrame(rave);
    window.requestAnimationFrame(bgReset)
}

function chooseSplash () {
    let choices = [
        'so cool',
        'much wow',
        'how exquisite',
        'amazing',
        'indubitably',
        '"10/10" - IGN',
        'wasting time since 1931',
        'it spins',
        'higher budget than cyberpunk',
        'backed by obama'
    ]
    let length = choices.length

    let choice1 = choices[Math.floor(Math.random() * length)]
    let choice2 = choices[Math.floor(Math.random() * length)]

    while (choice1 == choice2) {
        choice2 = choices[Math.floor(Math.random() * length)]
    }
    document.getElementById('splash1').innerHTML = choice1
    document.getElementById('splash2').innerHTML = choice2
}