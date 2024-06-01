import * as THREE from 'three';
let scene, camera, renderer, sphere;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xd3d3d3 );
    camera = new THREE.PerspectiveCamera(
                        75,
                        window.innerWidth/ window.innerHeight,
                        0.1,
                        1000
                    );
    renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    
    const ambientLight = new THREE.AmbientLight(0x404040, 80); // Soft white light with intensity 1
    scene.add(ambientLight);
    
    createSphere(15);
    updateCamera(15);
    document.getElementById("volume-result").innerHTML = calculateVolume(15);
    document.getElementById('update-radius').addEventListener('click', updateSphere)
    document.getElementById('radius').addEventListener('click', updateSphere)
    document.getElementById('radius').addEventListener('keypress', function(event) {
        if (event.key == "Enter") {
            event.preventDefault();
            document.getElementById("radius").click();
        }
    })

    document.getElementById("slide-range").addEventListener('click', updateSlider);
    document.getElementById("log-slide-range").addEventListener('click', updateLogSlider);

    document.getElementById('lin').addEventListener('click', linearSlide)
    document.getElementById('log').addEventListener('click', logSlide)
    camera.position.z = 50;
}

function linearSlide() {
    var linear = document.getElementById("lin-slide-container");
    // upon initial display, set to none
    if (linear.style.display == ''){
        linear.style.display = "none"
    }
   
    var log = document.getElementById("log-slide-container");
    if (linear.style.display== "none"){
        linear.style.display = "block";
        log.style.display = "none";
    }
    else {
        linear.style.display = "none";
    }
}

function logSlide() {
    var log = document.getElementById("log-slide-container");
    //on init display, set to none
    if(log.style.display==''){
        log.style.display = "none";
    }
    var linear = document.getElementById("lin-slide-container");
    if (log.style.display == "none"){
        log.style.display = "block";
        linear.style.display = "none";
    }
    else {
        log.style.display = "none";
    }
}
function updateSlider() {
    const slider = document.getElementById("slide-range");
    const slideVal = document.getElementById("slide-value");
    slideVal.innerHTML = slider.value;
    slider.oninput = function() {
        slideVal.innerHTML = this.value;
        document.getElementById("volume-result").innerHTML = calculateVolume(this.value);
    }
}

function updateLogSlider() {
    const slider = document.getElementById("log-slide-range");
    const slideVal = document.getElementById("log-slide-value");
    slideVal.innerHTML = slider.value;
    slider.oninput = function() {
        slideVal.innerHTML = this.value;
        document.getElementById("volume-result").innerHTML = calculateVolume(10**this.value);
    }
}
function createSphere(radius) {
    if (sphere) {
        scene.remove(sphere);
    }
    const geometry = new THREE.SphereGeometry( radius, 32, 16 ); 
    const texture = new THREE.TextureLoader().load('textures/image.png');
    const material = new THREE.MeshPhongMaterial({ map: texture });

    sphere = new THREE.Mesh( geometry, material ); 
    scene.add( sphere );
}

function updateSphere() {
    const radius = document.getElementById("radius").value;
    if (radius > 0) {
        createSphere(radius);
        updateCamera(radius);
        document.getElementById("volume-result").innerHTML = calculateVolume(radius);
    }
    else {
        if(radius == 0) {
            document.getElementById("volume-result").innerHTML = "0";
        }
        else{
            document.getElementById("volume-result").innerHTML = "Enter a positive number."
    
        }
    }
}

function updateCamera(radius) {
    const distance = radius * 3;
    camera.position.z = distance;
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
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', windowResize, false);
init();
animate()