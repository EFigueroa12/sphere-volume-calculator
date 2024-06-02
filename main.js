import * as THREE from 'three';

let scene, camera, renderer, sphere;
let textureGrassSun, textureMesophere, textureThermo, textureSpace, textureSphere;

// Load textures to global variables
function preloadTextures() {
    const loader = new THREE.TextureLoader();
    textureGrassSun = loader.load('textures/grassSun.jpg');
    textureMesophere = loader.load('textures/mesophere.jpeg');
    textureThermo = loader.load('textures/thermo.jpg');
    textureSpace = loader.load('textures/space.jpg');
    textureSphere = loader.load('textures/image.png');
}

function init() {

    preloadTextures();

    // Set Scene
    scene = new THREE.Scene();
    scene.background = textureGrassSun;
    camera = new THREE.PerspectiveCamera(
                75,
                window.innerWidth/ window.innerHeight,
                0.1,
                1000
            );
    renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setSize(window.innerWidth/2, window.innerHeight/2);
    const container = document.getElementById('renderer-container');
    container.appendChild(renderer.domElement);

    // Set lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 80);
    scene.add(ambientLight);

    // Create initial sphere at radius 15
    createSphere(15);
    document.getElementById("volume-result").innerHTML = calculateVolume(15);

    // React to Radius inputs
    document.getElementById('update-radius').addEventListener('click', updateSphere)
    document.getElementById('radius').addEventListener('click', updateSphere)
    document.getElementById('radius').addEventListener('keypress', function(event) {
        if (event.key == "Enter") {
            event.preventDefault();
            document.getElementById("radius").click();
        }
    })

    // React to Sliders
    document.getElementById('lin').addEventListener('click', linearSlide)
    document.getElementById('log').addEventListener('click', logSlide)

    camera.position.z = 50;
}

function linearSlide() {
    updateLinearSlider();
    var linear = document.getElementById("lin-slide-container");
    var log = document.getElementById("log-slide-container");
    if (linear.style.display == '' || linear.style.display== "none"){
        linear.style.display = "block";
        log.style.display = "none";
        document.getElementById('log').classList.remove('active');
    } else {
        linear.style.display = "none";
        linear.classList.remove('active');
    }
}

function logSlide() {
    updateLogSlider();
    var log = document.getElementById("log-slide-container");
    var linear = document.getElementById("lin-slide-container");
    if(log.style.display=='' || log.style.display == "none"){
        log.style.display = "block";
        linear.style.display = "none";
        document.getElementById('lin').classList.remove('active');
    } else {
        log.style.display = "none";
        log.classList.remove('active');
    }
}
function updateLinearSlider() {
    const slider = document.getElementById("slide-range");
    const slideVal = document.getElementById("slide-value");
    slideVal.innerHTML = slider.value;
    createSphere(slider.value);
    document.getElementById("volume-result").innerHTML = calculateVolume(slider.value);
    slider.oninput = function() {
        slideVal.innerHTML = this.value;
        createSphere(this.value);
        document.getElementById("volume-result").innerHTML = calculateVolume(this.value);
    }
}

function updateLogSlider() {
    const slider = document.getElementById("log-slide-range");
    const slideVal = document.getElementById("log-slide-value");
    slideVal.innerHTML = slider.value;
    document.getElementById("volume-result").innerHTML = calculateVolume(slider.value);
    slider.oninput = function() {
        slideVal.innerHTML = this.value;
        document.getElementById("volume-result").innerHTML = calculateVolume(10**this.value);
    }
}

function createSphere(radius) {
    if (sphere) {
        scene.remove(sphere);
    }
    if (radius > 1000) {
        //limit created spheres to 1000
        radius = 1000;
    }
    const geometry = new THREE.SphereGeometry( radius, 32, 16 ); 
    const material = new THREE.MeshPhongMaterial({ map: textureSphere });
    sphere = new THREE.Mesh( geometry, material ); 
    scene.add( sphere );

    // Set scene for different distances
    if (radius < 30) {
        scene.background = textureGrassSun;
        camera.position.z = 50;
    } else if (radius >= 30 && radius < 60) {
        scene.background = textureMesophere;
        camera.position.z = 100;
    } else if (radius >= 60 && radius < 650) {
        scene.background = textureThermo;
        camera.position.z = 1000;
    } else {
        scene.background = textureSpace;
        camera.position.z = 1500;
    }
}

function updateSphere() {
    const radius = document.getElementById("radius").value;
    if (radius > 0) {
        createSphere(radius);
        document.getElementById("volume-result").innerHTML = calculateVolume(radius);
    } else {
        if (radius == 0) {
            document.getElementById("volume-result").innerHTML = "0";
        } else {
            document.getElementById("volume-result").innerHTML = "Enter a positive number."
    
        }
    }
}

function calculateVolume(radius) {
    return (4/3) * Math.PI * radius**3;
}

function animate() {
    requestAnimationFrame(animate);
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
    renderer.render(scene, camera);
}

function windowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth/2, window.innerHeight/2);
}

window.addEventListener('resize', windowResize, false);
init();
animate()