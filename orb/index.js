import * as THREE from 'three';
import { setup } from './utils/setup.js';
import { THREEx } from './utils/KeyboardState.js';
import { GUI } from 'jsm/libs/dat.gui.module.js';
import { RGBELoader } from 'jsm/loaders/RGBELoader.js';
import { OBJLoader } from 'jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';

/////////////////////////////////////////////////////////
// Setup GUI for hdr environment
/////////////////////////////////////////////////////////
// https://polyhaven.com/hdris
const Params = {
    exposure: 0.3,
    hdrToneMapping: 'ACESFilmic'
  };
  
  const hdrToneMappingOptions = {
    None: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping
  };

// GUI
const gui = new GUI();
gui.add( Params, 'hdrToneMapping', Object.keys(hdrToneMappingOptions));
gui.add( Params, 'exposure', 0, 2, 0.01 );
gui.open();


/////////////////////////////////////////////////////////
// Physical Based Rendering(PBR) and Image Based Lighting(IBL) setup
/////////////////////////////////////////////////////////

// textures and gltf model from:
// https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0/DamagedHelmet/glTF

// Helmet glTF textures 
function loadTextureForGLTF(path, useForColorData = false) {
  let texture = new THREE.TextureLoader().load(path);
  // required texture properties:
  if (useForColorData) { texture.encoding = THREE.sRGBEncoding; } // If texture is used for color information, set colorspace.
  texture.flipY = false; // UVs use the convention that (0, 0) corresponds to the upper left corner of a texture.
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  // optional properties for textures
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

// Helmet glTF textures for PBR
const helmetAlbedoMap = loadTextureForGLTF('./orb/utils/glb/DamagedHelmet/Default_albedo.jpg', true);
const helmetNormalMap = loadTextureForGLTF('./orb/utils/glb/DamagedHelmet/Default_normal.jpg');
const helmetEmissiveMap = loadTextureForGLTF('./orb/utils/glb/DamagedHelmet/Default_emissive.jpg', true);
const helmetAmbientOcclusionMap = loadTextureForGLTF('./orb/utils/glb/DamagedHelmet/Default_AO.jpg');
const helmetMetallicAndRoughnessMap = loadTextureForGLTF('./orb/utils/glb/DamagedHelmet/Default_metalRoughness.jpg');

// Helmet material
// this includes all the textures for PBR with helmet glb
const helmetMaterial = new THREE.MeshStandardMaterial({
  emissive: new THREE.Color(1,1,1),
  metalness: 1.0,
  envMapIntensity: 1.0,

  emissiveMap: helmetEmissiveMap,
  map: helmetAlbedoMap,
  normalMap: helmetNormalMap,
  roughnessMap: helmetMetallicAndRoughnessMap,
  metalnessMap: helmetMetallicAndRoughnessMap,
  aoMap: helmetAmbientOcclusionMap,
});

let damagedHelmetObject;
{
  const gltfLoader = new GLTFLoader();
  gltfLoader.load("./orb/utils/glb/DamagedHelmet/DamagedHelmet.gltf", (gltf) => {
    damagedHelmetObject = gltf.scene;
    damagedHelmetObject.traverse( function (child) {
      if (child.isMesh) 
      {
        // applying textures to the helmet glb for PBR
        child.material = helmetMaterial;
      }
    });
  });
}

/////////////////////////////////////////////////////////
// get glsl code
/////////////////////////////////////////////////////////
async function loadShader(vs_path, fs_path) {
    let vs = await fetch(vs_path).then((response) => response.text());
    let fs = await fetch(fs_path).then((response) => response.text());
    return { VS: vs, FS: fs };
}

// diamond shader
var diamond_shader = await loadShader('./GLSL/Diamond/diamond.vs.glsl', './GLSL/Diamond/diamond.fs.glsl');

// noise shader
var noise_shader = await loadShader('./GLSL/Normal_Noise/noise.vs.glsl', './GLSL/Normal_Noise/noise.fs.glsl');

// polka dots shader
var dots_shader = await loadShader('./GLSL/Polka-Dots/dots.vs.glsl', './GLSL/Polka-Dots/dots.fs.glsl');

// toon shader
var toon_shader = await loadShader('./GLSL/Toon_Shading/toon.vs.glsl', './GLSL/Toon_Shading/toon.fs.glsl');

// phong shader
let vs = await fetch('./GLSL/Phong_Shading/phong.vs.glsl').then((response) => response.text());
let fs = await fetch('./GLSL/Phong_Shading/phong.fs.glsl').then((response) => response.text());
let fs1 = await fetch('./GLSL/Phong_Shading/blinn_phong.fs.glsl').then((response) => response.text());
var phong_shader = { VS: vs, FS_PHONG: fs , FS_BLINN: fs1 };

// glass shader
var glass_shader = await loadShader('./GLSL/Toon_Glass/toon_glass.vs.glsl', './GLSL/Toon_Glass/toon_glass.fs.glsl');

// static shader
var static_shader = await loadShader('./GLSL/Static/static.vs.glsl', './GLSL/Static/static.fs.glsl');

// mirror shader
var mirror_shader = await loadShader('./GLSL/Mirror/mirror.vs.glsl', './GLSL/Mirror/mirror.fs.glsl');




// dynamic light shader
var dynamic_light_shader = await loadShader('./orb/utils/glsl/orb.vs.glsl', './orb/utils/glsl/orb.fs.glsl');

/////////////////////////////////////////////////////////
// load scene textures
/////////////////////////////////////////////////////////
// HDR loader
// let SceneLoader = new EXRLoader();
const SceneLoader = new RGBELoader();

let env1;
let env2;
let env3;
let env;

// load default HDR environment
await SceneLoader.load('./orb/utils/scenes/paris.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    env1 = texture;
});

await SceneLoader.load('./orb/utils/scenes/stars.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    env2 = texture;
});

await SceneLoader.load('./orb/utils/scenes/sky.hdr', function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    env3 = texture;
});

env = env1;



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
let pink = new THREE.Color(0xf6e8fa);
scene.background = pink;
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
// create ball geometry
var ball_geometry = new THREE.IcosahedronGeometry(1, 12);

var dillo;

var objectLoader = new OBJLoader();
objectLoader.load('./orb/utils/obj/armadillo.obj', (obj) => {
    dillo = obj;
    dillo.position.set(0.0, 0.0, -1.0);
    dillo.rotation.y = Math.PI;
    dillo.scale.set(2.0, 2.0, 2.0);
    dillo.parent = worldFrame;
});


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
const toonColor2 = { type: 'c', value: new THREE.Color(0.85, 0.07, 0.0) };
const outlineColor = { type: 'c', value: new THREE.Color(0.0, 0.14, 0.03) };

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

// MIRROR
// work in progress
const mirrorMaterial = new THREE.ShaderMaterial({
    uniforms: {
        skybox: { type: 't', value: env },
        matrixWorld: { type: 'm4', value: camera.matrixWorldInverse },
    },
    vertexShader: mirror_shader.VS,
    fragmentShader: mirror_shader.FS
});



/////////////////////////////////////////////////////////
// create mesh
/////////////////////////////////////////////////////////

// create mesh
var mesh = new THREE.Mesh(ball_geometry, phongMaterial); 
var scale = 1;
mesh.scale.set(scale, scale, scale);

/////////////////////////////////////////////////////////
// Update Scene
/////////////////////////////////////////////////////////
// material to use
let mesh_mat = phongMaterial;

// object on the scene
let subject = mesh;

scene.add(subject);

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
        // change material to mirror
        console.log(env);
        mesh_mat = mirrorMaterial;
    } else if (keyboard.pressed("0")) {
        // no material change implemented yet
    }

    // change the object
    if (keyboard.pressed("shift+A")) {
        // place armadillo
        scene.remove(subject);
        subject = dillo;
        scene.add(subject);
    } else if (keyboard.pressed("shift+B")) {
        // place ball
        scene.remove(subject);
        subject = mesh;
        scene.add(subject);
    } else if (keyboard.pressed("shift+H")) { 
        // place helmet
        // TODO: fix bug where GUI disappears when helmet is placed
        scene.remove(subject);
        subject = damagedHelmetObject;
        scene.add(subject);
    }

    // change material
    mesh.material = mesh_mat;

    if (dillo) {
        dillo.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = mesh_mat;
            }
        });
    }


    // change environment
    if (keyboard.pressed("shift+0")) {
        // change scene to standard pink
        scene.background = pink;
    } else if (keyboard.pressed("shift+1")) {
        // change scene to paris environment
        env = env1;
        scene.background = env;
        helmetMaterial.envMap = env;
    } else if (keyboard.pressed("shift+2")) {
        // change scene to stars environment
        env = env2;
        scene.background = env;
        helmetMaterial.envMap = env;
    } else if (keyboard.pressed("shift+3")) {
        // change scene to sunset environment
        env = env3;
        scene.background = env;
        helmetMaterial.envMap = env;
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
    toonMaterial.needsUpdate = true;
    toonGlassMaterial.needsUpdate = true;
    staticMaterial.needsUpdate = true;
    mirrorMaterial.needsUpdate = true;
    helmetMaterial.needsUpdate = true;
}

function update() {
    ticks.value += 1 / 100.0;

    updateMaterial(mesh.material);
    checkKeyboard();

    requestAnimationFrame(update);
    
    // renderer settings for HDR environment
    /////////////////////////////////////////
    // https://threejs.org/docs/#api/en/renderers/WebGLRenderer.physicallyCorrectLights
    renderer.physicallyCorrectLights = true;
    // https://threejs.org/docs/#api/en/renderers/WebGLRenderer.toneMapping
    renderer.toneMapping = hdrToneMappingOptions[ Params.hdrToneMapping ];
    // https://threejs.org/docs/#api/en/textures/Texture.encoding
    renderer.outputEncoding = THREE.sRGBEncoding;
    var prevToneMappingExposure = renderer.toneMappingExposure;
    renderer.toneMappingExposure = Params.exposure;

    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    // restore non-IBL renderer properties
    renderer.physicallyCorrectLights = false;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.outputEncoding = THREE.LinearEncoding;
    renderer.toneMappingExposure = prevToneMappingExposure;
};

update();