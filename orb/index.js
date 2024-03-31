import * as THREE from 'three';
import { setup , loadAndPlaceOBJ} from './utils/setup.js';
import { THREEx } from './utils/KeyboardState.js';
import {GUI} from 'jsm/libs/dat.gui.module.js';
import {EXRLoader} from 'jsm/loaders/EXRLoader.js';



/////////////////////////////////////////////////////////
// Setup GUI for hdr environment
/////////////////////////////////////////////////////////
// https://fossies.org/linux/three.js/examples/webgl_loader_texture_exr.html
// GUI
const gui = new GUI();
gui.open();


/////////////////////////////////////////////////////////
// get glsl code
/////////////////////////////////////////////////////////
var vs;
var fs;
// diamond shader
vs = await fetch('../Diamond/diamond.vs.glsl').then((response) => response.text());
fs = await fetch('../Diamond/diamond.fs.glsl').then((response) => response.text());
var diamond_shader = { VS: vs, FS: fs };

// noise shader
vs = await fetch('../Normal_Noise/noise.vs.glsl').then((response) => response.text());
fs = await fetch('../Normal_Noise/noise.fs.glsl').then((response) => response.text());
var noise_shader = { VS: vs, FS: fs };

// polka dots shader
vs = await fetch('../polka-dots/dots.vs.glsl').then((response) => response.text());
fs = await fetch('../polka-dots/dots.fs.glsl').then((response) => response.text());
var dots_shader = { VS: vs, FS: fs };

// toon shader
vs = await fetch('../toon_shading/toon.vs.glsl').then((response) => response.text());
fs = await fetch('../toon_shading/toon.fs.glsl').then((response) => response.text());
var toon_shader = { VS: vs, FS: fs };

// phong shader
vs = await fetch('../phong_shading/phong.vs.glsl').then((response) => response.text());
fs = await fetch('../phong_shading/phong.fs.glsl').then((response) => response.text());
var fs1 = await fetch('../phong_shading/blinn_phong.fs.glsl').then((response) => response.text());
var phong_shader = { VS: vs, FS_PHONG: fs , FS_BLINN: fs1 };

// glass shader
vs = await fetch('../glass/glass.vs.glsl').then((response) => response.text());
fs = await fetch('../glass/toon_glass.fs.glsl').then((response) => response.text());
var glass_shader = { VS: vs, FS: fs };

// static shader
vs = await fetch('../static/static.vs.glsl').then((response) => response.text());
fs = await fetch('../static/static.fs.glsl').then((response) => response.text());
var static_shader = { VS: vs, FS: fs };

// mirror shader
vs = await fetch('../mirror/mirror.vs.glsl').then((response) => response.text());
fs = await fetch('../mirror/mirror.fs.glsl').then((response) => response.text());
var mirror_shader = { VS: vs, FS: fs };






// dynamic light shader
vs = await fetch('./utils/glsl/orb.vs.glsl').then((response) => response.text());
fs = await fetch('./utils/glsl/orb.fs.glsl').then((response) => response.text());
var dynamic_light_shader = { VS: vs, FS: fs };

/////////////////////////////////////////////////////////
// load scene textures
/////////////////////////////////////////////////////////
// HDR loader
// let HDRLoader = new EXRLoader();



/////////////////////////////////////////////////////////
// setup elements for scene
/////////////////////////////////////////////////////////
// Setup and return the scene and related objects.
const {
    renderer,
    scene,
    camera
  } = setup();

// World Coordinate Frame: other objects are defined with respect to it.
const worldFrame = new THREE.AxesHelper(1);

// time ticks
const ticks = { type: "f", value: 0.0 };


// dyanmic light
/////////////////////////////////////////////////////////

// // set background color
scene.background = new THREE.Color(0xf6e8fa);
const spherePosition = { type: 'v3', value: new THREE.Vector3(0.0, 0.0, 2.0) };
const light = new THREE.PointLight(0xffffff, 200);
light.position.set(0, 0, 1.0);

// Shader materials
const sphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
    spherePosition: spherePosition
    },
    vertexShader: dynamic_light_shader.VS,
    fragmentShader: dynamic_light_shader.FS
});

// Create the main sphere geometry (light source)
// https://threejs.org/docs/#api/en/geometries/SphereGeometry
const sphereGeometry = new THREE.IcosahedronGeometry(0.2, 12);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(light.position.x, light.position.y, light.position.z);
sphere.parent = worldFrame;
scene.add(sphere);

/////////////////////////////////////////////////////////
// Create Mesh for ball
/////////////////////////////////////////////////////////


// create geometries
/////////////////////////////////////////////////////////

// create armadillo geometry


// create ball geometry
var ball_geometry = new THREE.IcosahedronGeometry(1, 12);


// define materials
/////////////////////////////////////////////////////////

// DIAMOND
const diamondMaterial = new THREE.ShaderMaterial({
    uniforms: {
      ticks: ticks
    },
    vertexShader: diamond_shader.VS,
    fragmentShader: diamond_shader.FS
});

// NOISE
const noiseMaterial = new THREE.ShaderMaterial({
    uniforms: {
      ticks: ticks
    },
    vertexShader: noise_shader.VS,
    fragmentShader: noise_shader.FS
});

// DOTS
const dotsMaterial = new THREE.ShaderMaterial({
    uniforms: {
      ticks: ticks
    },
    vertexShader: dots_shader.VS,
    fragmentShader: dots_shader.FS
});

// TOON
const toonColor = { type: 'c', value: new THREE.Color(1.0, 0.8, 0.4) };
const toonColor2 = { type: 'c', value: new THREE.Color(0.8, 0.1, 0.35) };
const outlineColor = { type: 'c', value: new THREE.Color(0.35, 0.61, 0.42) };

const toonMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightPosition: { type: 'c', value: light.position },
        toonColor: toonColor,
        toonColor2: toonColor2,
        outlineColor: outlineColor,
        steps: { type: "f", value: 5.0 }
    },
    vertexShader: toon_shader.VS,
    fragmentShader: toon_shader.FS
});

// PHONG
const baseColor = { type: 'c', value: new THREE.Color(1.0, 1.0, 1.0) };
const ambientColor = { type: 'c', value: new THREE.Color(0.0, 0.0, 1.0) };
const diffuseColor = { type: 'c', value: new THREE.Color(0.0, 1.0, 1.0) };
const specularColor = { type: 'c', value: new THREE.Color(1.0, 1.0, 1.0) };
const kAmbient = { type: "f", value: 0.3 };
const kDiffuse = { type: "f", value: 0.6 };
const kSpecular = { type: "f", value: 1.0 };
const shininess = { type: "f", value: 10.0 };

const phongMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightPosition: { type: 'c', value: light.position },
        ambientColor: ambientColor,
        diffuseColor: diffuseColor,
        specularColor: specularColor,
        kAmbient: kAmbient,
        kDiffuse: kDiffuse,
        kSpecular: kSpecular,
        shininess: shininess,
        baseColor: baseColor
    },
    vertexShader: phong_shader.VS,
    fragmentShader: phong_shader.FS_PHONG
});

// Blinn-Phong
const blinnMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightPosition: { type: 'c', value: light.position },
        ambientColor: ambientColor,
        diffuseColor: diffuseColor,
        specularColor: specularColor,
        kAmbient: kAmbient,
        kDiffuse: kDiffuse,
        kSpecular: kSpecular,
        shininess: shininess,
        baseColor: baseColor
    },
    vertexShader: phong_shader.VS,
    fragmentShader: phong_shader.FS_BLINN
});


// Toon-GLASS
const toonGlassMaterial = new THREE.ShaderMaterial({
    uniforms: {
        lightPosition: { type: 'c', value: light.position },
        specularColor: specularColor,
        kSpecular: kSpecular,
        shininess: shininess,
    },
    vertexShader: glass_shader.VS,
    fragmentShader: glass_shader.FS
});

// toonGlassMaterial.blending = THREE.CustomBlending;

// STATIC
const staticMaterial = new THREE.ShaderMaterial({
    uniforms: {
        ticks: ticks
    },
    vertexShader: static_shader.VS,
    fragmentShader: static_shader.FS
});

// // MIRROR
// const mirrorMaterial = new THREE.ShaderMaterial({
//     uniforms: {
//         skybox: { type: 't', value: null },
//         matrixWorld: { type: 'm4', value: camera.matrixWorldInverse },
//     },
//     vertexShader: mirror_shader.VS,
//     fragmentShader: mirror_shader.FS
// });









/////////////////////////////////////////////////////////
// create mesh
/////////////////////////////////////////////////////////

// create mesh
var mesh = new THREE.Mesh(ball_geometry, phongMaterial); 
var scale = 1;
mesh.scale.set(scale, scale, scale);
scene.add(mesh);

/////////////////////////////////////////////////////////
// Update Scene
/////////////////////////////////////////////////////////
// material to use
let mesh_mat = phongMaterial;

let dillo = null;

let env = null;

// create keyboard state
var keyboard = new THREEx.KeyboardState();

function checkKeyboard() {

    if (keyboard.pressed("1")) {
        // change material to phong
        mesh_mat = phongMaterial;
    } else if (keyboard.pressed("2")) {
        // change material to blinn-phong
        mesh_mat = blinnMaterial;
    } else if (keyboard.pressed("3")) {
        // change material to diamond
        mesh_mat = diamondMaterial;
    } else if (keyboard.pressed("4")) {
        // change material to noise
        mesh_mat = noiseMaterial;
    } else if (keyboard.pressed("5")) {
        // change material to dots
        mesh_mat = dotsMaterial;
    } else if (keyboard.pressed("6")) {
        // change material to toon
        mesh_mat = toonMaterial;
    } else if (keyboard.pressed("7")) {
        // change material to toon-glass
        mesh_mat = toonGlassMaterial;
    } else if (keyboard.pressed("8")) {
        // change material to static
        mesh_mat = staticMaterial;
    } else if (keyboard.pressed("9")) {

    } else if (keyboard.pressed("0")) {

    }

    // change the object
    if (keyboard.pressed("shift+A")) {
        // place armadillo

        scene.remove(mesh);
        // loadAndPlaceOBJ('utils/obj/armadillo.obj', mesh_mat, function (armadillo) {
        //     armadillo.position.set(0.0, 0.0, -1.0);
        //     armadillo.rotation.y = Math.PI;
        //     armadillo.scale.set(2.0, 2.0, 2.0);
        //     armadillo.parent = worldFrame;
        // });
    } else if (keyboard.pressed("shift+B")) {
        // place ball
        scene.add(mesh);
    }

    // change material
    mesh.material = mesh_mat;
    if (dillo != null) {
        dillo.material = mesh_mat;
    }


    // change environment
    if (keyboard.pressed("shift+0")) {
        // change scene to standard pink
        scene.background = new THREE.Color(0xf6e8fa);
        env = null;
    } else if (keyboard.pressed("shift+2")) {
        // TODO
    } else if (keyboard.pressed("shift+3")) {
        // TODO
    } else if (keyboard.pressed("shift+4")) {
        // TODO
    } else if (keyboard.pressed("shift+5")) {
        // TODO
    } else if (keyboard.pressed("shift+6")) {
        // TODO
    } else if (keyboard.pressed("shift+7")) {
        // TODO
    } else if (keyboard.pressed("shift+8")) {
        // TODO
    }

    if (env != null) {
        scene.background = env;
    }



    // use arrow keys to move the light
    let move_speed = 0.05;
    if (keyboard.pressed("up"))
      spherePosition.value.z -= move_speed;
    else if (keyboard.pressed("down"))
      spherePosition.value.z += move_speed;
  
    if (keyboard.pressed("left"))
      spherePosition.value.x -= move_speed;
    else if (keyboard.pressed("right"))
      spherePosition.value.x += move_speed;
  
    if (keyboard.pressed("E"))
      spherePosition.value.y -= move_speed;
    else if (keyboard.pressed("Q"))
      spherePosition.value.y += move_speed;
  
    light.position.set(spherePosition.value.x, spherePosition.value.y, spherePosition.value.z);
    sphere.position.set(light.position.x, light.position.y, light.position.z);
  }

// set material update
function updateMaterial() {
    // The following tells three.js that some uniforms might have changed
    sphereMaterial.needsUpdate = true;
    diamondMaterial.needsUpdate = true;
    noiseMaterial.needsUpdate = true;
    dotsMaterial.needsUpdate = true;
    phongMaterial.needsUpdate = true;
    blinnMaterial.needsUpdate = true;
    toonGlassMaterial.needsUpdate = true;
    staticMaterial.needsUpdate = true;
    // mirrorMaterial.needsUpdate = true;
}

function update() {
    ticks.value += 1 / 100.0;

    updateMaterial(mesh.material);
    checkKeyboard();

    requestAnimationFrame(update);
    renderer.render(scene, camera);
};

update();