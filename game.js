import { Bird } from './objects/bird.js';
import { Car } from './objects/car.js';
import { Cloud } from './objects/cloud.js';
import { Explosion } from './objects/explosion.js';
import { Collectible } from './objects/collectible.js';
import { Ground } from './objects/ground.js';
import { Tree } from './objects/tree.js';
import { Plane } from './objects/plane.js';

let scene;
let camera;
let HEIGHT;
let WIDTH;
let renderer;
let car;
let explosion;
let scoreDiv;
let globalRenderID;

let gameOverFlag = false;
let score = 0;
let health = 5;
let speed = 4;

const trees = [];
const clouds = [];
const birds = [];
const collectibles = [];
const planes = [];

window.onload = function() {
  init();
};

function init() {
  createScene();

  createLights();
  createCar();
  createGround();
  createTrees();
  createBirds();
  createSky();
  createCollectibles();
  createPlanes();

  gameInstructions();
}

function createScene() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xf7d9aa, 10, 950);

  camera = new THREE.PerspectiveCamera(
    60, // field of view
    WIDTH / HEIGHT, // aspect ratio
    1, // near plane
    1000 // far plane
  );
  camera.position.set(0, 100, 200);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(WIDTH, HEIGHT);
  renderer.shadowMap.enabled = true;

  explosion = new Explosion(scene, 10);

  const container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', handleWindowResize, false);

  document.onkeydown = handleKeyDown;

  scoreDiv = document.createElement('div');
  scoreDiv.setAttribute('id', 'scoreBoard');
  document.body.appendChild(scoreDiv);
}

function handleWindowResize() {
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

function createLights() {
  const hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, 0.9);

  const shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);
  shadowLight.position.set(150, 350, 350);
  shadowLight.castShadow = true;

  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  scene.add(hemisphereLight);
  scene.add(shadowLight);
}

function createCar() {
  car = new Car();
  scene.add(car.mesh);
}

function createGround() {
  const ground = new Ground(WIDTH);
  scene.add(ground.mesh);
}

function createTrees() {
  const limit = WIDTH / 4;

  for (let i = 0; i < 20; i += 1) {
    const tree = new Tree();
    scene.add(tree.mesh);
    tree.mesh.position.x = getRandomInt(-limit, limit);
    tree.mesh.position.z = getRandomInt(0, -700);
    trees.push(tree);
  }
}

function createSky() {
  const limit = WIDTH / 2;

  for (let i = 0; i < 10; i += 1) {
    const cloud = new Cloud();
    scene.add(cloud.mesh);
    cloud.mesh.position.x = getRandomInt(-limit, limit);
    cloud.mesh.position.z = getRandomInt(0, -700);

    clouds.push(cloud);
  }
}

function createBirds() {
  const limit = WIDTH / 4;

  for (let i = 0; i < 10; i += 1) {
    const bird = new Bird();
    scene.add(bird.mesh);
    bird.mesh.position.x = getRandomInt(-limit, limit);
    bird.mesh.position.z = getRandomInt(0, -700);
    bird.moveRightLeft = Math.round(Math.random());

    birds.push(bird);
  }
}

function createCollectibles() {
  for (let i = 0; i < 10; i += 1) {
    const collectibe = new Collectible();
    scene.add(collectibe.mesh);
    collectibe.mesh.position.x = getRandomInt(-75, 75);
    collectibe.mesh.position.z = getRandomInt(0, -700);

    collectibles.push(collectibe);
  }
}

function createPlanes() {
  for (let i = 0; i < 3; i += 1) {
    const plane = new Plane();
    scene.add(plane.mesh);
    plane.mesh.position.x = getRandomInt(-75, 75);
    plane.mesh.position.z = getRandomInt(-2000, -700);

    planes.push(plane);
  }
}

kd.LEFT.down(function() {
  if (car.mesh.position.x > -75) car.mesh.position.x -= 2;
});

kd.RIGHT.down(function() {
  if (car.mesh.position.x < 75) car.mesh.position.x += 2;
});

function dispHealth() {
  let score_str = `Score: ${score}<br>`;

  for (let i = 0; i < health; i += 1) {
    score_str += `<i class="fa fa-heart fa-lg"></i> `;
  }

  scoreDiv.innerHTML = score_str;
}

function loop() {
  if (gameOverFlag) return;

  if (health === 0) gameOver();

  const limit = WIDTH / 4;

  trees.forEach(tree => {
    tree.mesh.position.z += speed;

    if (tree.mesh.position.z > 200) {
      tree.resetLocation(-limit, limit);
    }

    // collision
    let in_collision_range =
      Math.abs(tree.mesh.position.x - car.mesh.position.x) < 20 &&
      Math.abs(tree.mesh.position.z - car.mesh.position.z) < 40;

    if (in_collision_range && tree.mesh.visible) {
      health -= 1;
      tree.mesh.visible = false;
      explosion.explode(tree);
      tree.resetLocation(-limit, limit);
    }
  });

  clouds.forEach(cloud => {
    cloud.mesh.position.z += speed / 2;

    if (cloud.mesh.position.z > 400) cloud.mesh.position.z = -700;
  });

  birds.forEach(bird => {
    bird.flapWings();

    if (bird.moveRightLeft) bird.mesh.position.x += speed / 2;
    else bird.mesh.position.x -= speed / 2;

    bird.mesh.position.z += speed;

    if (bird.mesh.position.x > 600) bird.moveRightLeft = 0;
    else if (bird.mesh.position.x < -600) bird.moveRightLeft = 1;

    if (bird.mesh.position.z > 200) bird.mesh.position.z = -700;
  });

  collectibles.forEach(item => {
    item.rotate();
    item.mesh.position.z += speed;

    if (item.mesh.position.z > 200) item.mesh.position.z = -700;

    // collision
    let in_collision_range =
      Math.abs(item.mesh.position.x - car.mesh.position.x) < 20 &&
      Math.abs(item.mesh.position.z - car.mesh.position.z) < 40;

    if (in_collision_range) {
      score += 1;
      item.mesh.visible = false;
      item.resetLocation(75, -75);
    }
  });

  planes.forEach(plane => {
    plane.update();

    plane.mesh.position.z += 1.5 * speed;

    if (plane.mesh.position.z > 200) {
      plane.mesh.position.x = getRandomInt(-75, 75);
      plane.mesh.position.z = getRandomInt(-2000, -700);
    }

    // fire bomb
    let close = Math.abs(plane.mesh.position.z - car.mesh.position.z) < 100;
    let hit =
      Math.abs(plane.bomb.mesh.position.y - car.mesh.position.y) > 610 &&
      Math.abs(plane.mesh.position.x - car.mesh.position.x) < 20 &&
      Math.abs(plane.mesh.position.z - car.mesh.position.z) < 30;

    if (close && !plane.fired) {
      plane.firing = true;
    }
    if (!close && !plane.firing) {
      plane.fired = false;
    }

    if (plane.firing) {
      plane.bomb.mesh.visible = true;
      plane.bomb.mesh.position.y -= 7 * speed;
      plane.fired = true;

      if (hit && plane.bomb.mesh.visible) {
        explosion.explode(plane);
        plane.bomb.reset();
        health -= 1;
        plane.firing = false;
      }
    }

    if (plane.bomb.mesh.position.y <= -710) {
      plane.bomb.reset();
      plane.firing = false;
    }
  });

  speed += 0.001;

  dispHealth();
  car.update();
  explosion.logic();
  renderer.render(scene, camera);
  kd.tick();
  globalRenderID = requestAnimationFrame(loop);
}

function restart() {
  car.mesh.position.x = 0;
  gameOverFlag = false;
  score = 0;
  health = 5;
  speed = 4;

  const parent = document.getElementById('gameOverDiv').parentElement;
  parent.removeChild(document.getElementById('gameOverDiv'));

  dispHealth();
  loop();
}

function gameOver() {
  speed = 0;
  health = 0;
  gameOverFlag = true;

  const gameOverDiv = document.createElement('div');
  gameOverDiv.id = 'gameOverDiv';
  gameOverDiv.innerHTML = `<p id='gameOverText'> GAME OVER WITH SCORE OF: ${score} </p> <button id='restart'> Press space to restart</button>`;
  document.body.appendChild(gameOverDiv);

  dispHealth();
  cancelAnimationFrame(globalRenderID);
}

function handleKeyDown(keyEvent) {
  if (keyEvent.keyCode === 77) {
    // 'M' key
    const soundElement = document.getElementById('track');
    soundElement.muted = !soundElement.muted;
  }

  if (
    document.getElementById('instructionsDiv') !== null &&
    keyEvent.keyCode === 32
  ) {
    startGame();
  }

  if (
    document.getElementById('gameOverDiv') !== null &&
    keyEvent.keyCode === 32 &&
    gameOverFlag
  ) {
    restart();
  }
}

function gameInstructions() {
  const instructionsDiv = document.createElement('div');
  instructionsDiv.id = 'instructionsDiv';
  instructionsDiv.innerHTML =
    '<p id="instructionsText">How far can you go? <br/> Left/Right - Move <br/> Press "m" to un/mute sound</p><button id="start">Press space to start</button>';

  document.body.appendChild(instructionsDiv);
}

function startGame() {
  document.getElementById('instructionsDiv').remove();

  // call game loop
  loop();
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
