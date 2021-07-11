import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

// Loading
const textureLoader = new THREE.TextureLoader();
const normalTexture = textureLoader.load("/textures/normal-map-2.png");

// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Objects
const geometry = new THREE.SphereBufferGeometry(0.5, 64, 64);

// Materials

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.normalMap = normalTexture;
material.color = new THREE.Color(0x888c8d);

// Mesh
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

const addLight = (defaultColour, folderName, posArray) => {
  const pointLight = new THREE.PointLight(defaultColour, 2);
  pointLight.position.set(...posArray);
  pointLight.intensity = 5;

  const lightFolder = gui.addFolder(folderName);

  scene.add(pointLight);

  lightFolder.add(pointLight.position, "x").min(-3).max(3).step(0.01);
  lightFolder.add(pointLight.position, "y").min(-3).max(3).step(0.01);
  lightFolder.add(pointLight.position, "z").min(-3).max(3).step(0.01);
  lightFolder.add(pointLight, "intensity").min(0).max(10).step(0.01);

  const lightColour = {
    color: defaultColour,
  };

  lightFolder.addColor(lightColour, "color").onChange(() => {
    pointLight.color.set(lightColour.color);
  });

  // const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
  // scene.add(pointLightHelper);
};

addLight(0xff0000, "Light 1", [1, 1, 0]);
addLight(0x00ff00, "Light 2", [1, -1, 0]);
addLight(0x0000ff, "Light 3", [-3, 0, 0]);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowX = window.innerWidth / 2;
const windowY = window.innerHeight / 2;

const onMouseMove = (event) => {
  mouseX = event.clientX - windowX;
  mouseY = event.clientY - windowY;
};

document.addEventListener("mousemove", onMouseMove);

const updateSphere = (event) => {
  sphere.position.y = window.scrollY * 0.001;
};

document.addEventListener("scroll", updateSphere);

const tick = () => {
  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  sphere.rotation.x += 2 * targetY - sphere.rotation.x;
  sphere.rotation.y += 2 * targetX - sphere.rotation.y;
  // Update Orbital Controls
  // controls.update()

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
