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
    document.getElementById('update-radius').addEventListener('click', updateSphere)
    camera.position.z = 50;
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
    createSphere(radius);
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