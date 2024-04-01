/**
 * Creates a basic scene and returns necessary objects
 * to manipulate the scene, camera and render context.
 */
import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { OBJLoader } from 'jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';

function setup() {

    // Create a scene
    const w = window.innerWidth;
    const h = window.innerHeight;
    const scene = new THREE.Scene();

    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
    camera.position.z = 5;

    // Create a renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(w, h);
    document.body.appendChild(renderer.domElement);

    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 2.0;


    // Setup orbit controls for the camera.
    new OrbitControls(camera, renderer.domElement);

    // handle window resize
    function handleWindowResize () {
        let w = window.innerWidth;
        let h = window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener('resize', handleWindowResize, false);

    return {
        renderer,
        scene,
        camera
    };
}

/**
 * Utility function that loads glb files 
 */
function loadAndPlaceGLB(file, place) {
    const manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    const onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            const percentComplete = xhr.loaded / xhr.total * 100.0;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    const loader = new GLTFLoader(manager);
    loader.load(file, function (gltf) {
        place(gltf.scene);
    }, onProgress);
}

export {setup, loadAndPlaceGLB};
