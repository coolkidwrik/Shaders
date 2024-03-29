import * as THREE from 'three';
import { setup } from './utils/setup.js';
import { THREEx } from './utils/KeyboardState.js';


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



/////////////////////////////////////////////////////////
// setup elements for scene
/////////////////////////////////////////////////////////
// Setup and return the scene and related objects.
const {
    renderer,
    scene,
    camera
  } = setup();
// time ticks
const ticks = { type: "f", value: 0.0 };

// add directional light
var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 3, 5);

// set background color
scene.background = new THREE.Color(0xffffff);

// add spotlight
// var light = new THREE.SpotLight(0xffffff, 1);
// light.position.set(0, 5, 0);
// light.castShadow = true;
// light.shadow.mapSize.width = 1024;
// light.shadow.mapSize.height = 1024;
// light.shadow.camera.near = 0.1;
// light.shadow.camera.far = 100;
// light.shadow.camera.fov = 30;
// scene.add(light);

/////////////////////////////////////////////////////////
// Create Mesh for Orb
/////////////////////////////////////////////////////////

// create geometry
var geometry = new THREE.IcosahedronGeometry(1, 12);


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
        steps: { type: "f", value: 10.0 }
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



var material = new THREE.ShaderMaterial({
    uniforms: {
        utime: ticks,
    },
});
/////////////////////////////////////////////////////////
// create mesh
/////////////////////////////////////////////////////////




// create mesh
var mesh = new THREE.Mesh(geometry, toonGlassMaterial); 
var scale = 1;
mesh.scale.set(scale, scale, scale);
scene.add(mesh);




/////////////////////////////////////////////////////////
// Update Scene
/////////////////////////////////////////////////////////

// create keyboard state
var keyboard = new THREEx.KeyboardState();

function checkKeyboard() {

    if (keyboard.pressed("1")) {
        // change material to phong
        mesh.material = phongMaterial;
    } else if (keyboard.pressed("2")) {
        // change material to blinn-phong
        mesh.material = blinnMaterial;
    } else if (keyboard.pressed("3")) {
        // change material to diamond
        mesh.material = diamondMaterial;
    } else if (keyboard.pressed("4")) {
        // change material to noise
        mesh.material = noiseMaterial;
    } else if (keyboard.pressed("5")) {
        // change material to dots
        mesh.material = dotsMaterial;
    } else if (keyboard.pressed("6")) {
        // change material to toon
        mesh.material = toonMaterial;
    } else if (keyboard.pressed("7")) {
        // change material to toon-glass
        mesh.material = toonGlassMaterial;
    } else if (keyboard.pressed("8")) {
        // change material to static
        mesh.material = staticMaterial;
    } else if (keyboard.pressed("9")) {

    } else if (keyboard.pressed("0")) {

    }

    // change the object
    if (keyboard.pressed("A")) {
        // place armadillo
    } else if (keyboard.pressed("B")) {
        // place ball
    }

  
    // // use arrow keys to move the light
    // if (keyboard.pressed("up"))
    //   spherePosition.value.z -= 0.3;
    // else if (keyboard.pressed("down"))
    //   spherePosition.value.z += 0.3;
  
    // if (keyboard.pressed("left"))
    //   spherePosition.value.x -= 0.3;
    // else if (keyboard.pressed("right"))
    //   spherePosition.value.x += 0.3;
  
    // if (keyboard.pressed("E"))
    //   spherePosition.value.y -= 0.3;
    // else if (keyboard.pressed("Q"))
    //   spherePosition.value.y += 0.3;
  
    // sphereLight.position.set(spherePosition.value.x, spherePosition.value.y, spherePosition.value.z);
  }






// set material update
function updateMaterial(material) {
    // The following tells three.js that some uniforms might have changed
    diamondMaterial.needsUpdate = true;
    noiseMaterial.needsUpdate = true;
    dotsMaterial.needsUpdate = true;
    phongMaterial.needsUpdate = true;
    blinnMaterial.needsUpdate = true;
    toonGlassMaterial.needsUpdate = true;
    staticMaterial.needsUpdate = true;
}

function update() {
    ticks.value += 1 / 100.0;

    updateMaterial(mesh.material);
    checkKeyboard();

    requestAnimationFrame(update);
    renderer.render(scene, camera);
};

update();