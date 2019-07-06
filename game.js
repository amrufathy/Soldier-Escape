// global game constants
const worldRadius = 26;
const heroRadius = 0.2;
const heroBaseY = 1.8;
const middleLane = 0;
const particleCount = 20;
const initRollingSpeed = 0.005;

let sceneWidth;
let sceneHeight;
let camera;
let scene;
let renderer;
let rollingGroundSphere;
let heroSphere;
let rollingSpeed = initRollingSpeed;
let heroRollingSpeed;
let sphericalHelper;
let pathAngleValues;
let bounceValue = 0.1;
let currentLane;
let treeClock;
let levelClock;
let jumping;
let treesInPath;
let treesPool;
let particleGeometry;
let explosionPower = 1.06;
let particles;
let scoreText;
let score;
let hasCollided;
let gameOverFlag;
let distanceCounter;
let distanceMeter;
let isPaused;
let globalRenderID;
let levelCounter;
let scheduler;

init();

function init() {
  // set up the scene
  createScene();

  // call game loop
  update();
}

function createScene() {
  distanceCounter = 0;
  isPaused = false;
  gameOverFlag = false;
  hasCollided = false;
  score = 0;
  levelCounter = 1;
  treesInPath = [];
  treesPool = [];
  treeClock = new THREE.Clock();
  treeClock.start();
  levelClock = new THREE.Clock();
  levelClock.start();
  scheduler = new Scheduler();
  heroRollingSpeed = (rollingSpeed * worldRadius) / heroRadius / 5;
  sphericalHelper = new THREE.Spherical();
  pathAngleValues = [1.52, 1.57, 1.62];
  // Set width and height of the canvas
  sceneWidth = window.innerWidth;
  sceneHeight = Math.round(window.innerHeight * 0.99);
  scene = new THREE.Scene(); // the 3d scene
  scene.fog = new THREE.FogExp2(0xf0fff0, 0.14);
  // perspective camera
  camera = new THREE.PerspectiveCamera(60, sceneWidth / sceneHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({
    alpha: true,
  }); // renderer with transparent backdrop
  renderer.setClearColor(0xfffafa, 1);
  renderer.shadowMap.enabled = true; // enable shadow
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(sceneWidth, sceneHeight);
  const dom = document.getElementById('TutContainer');
  dom.appendChild(renderer.domElement);

  createTreesPool();
  addWorld();
  addHero();
  addLight();
  addExplosion();

  camera.position.z = 6.5;
  camera.position.y = 3.5;
  // helper to rotate around in scene
  const orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
  orbitControl.addEventListener('change', render);
  orbitControl.enableKeys = false;
  orbitControl.enablePan = true;
  orbitControl.enableZoom = true;
  orbitControl.minPolarAngle = 1.1;
  orbitControl.maxPolarAngle = 1.1;
  orbitControl.minAzimuthAngle = -0.2;
  orbitControl.maxAzimuthAngle = 0.2;

  window.addEventListener('resize', onWindowResize, false); // resize callback

  document.onkeydown = handleKeyDown;

  scoreText = document.createElement('div');
  scoreText.setAttribute('id', 'scoreBoard');
  scoreText.innerHTML = score.toString();
  document.body.appendChild(scoreText);

  const infoText = document.createElement('div');
  infoText.setAttribute('id', 'infoBoard');
  infoText.innerHTML = 'UP - Jump, Left/Right - Move';
  document.body.appendChild(infoText);

  distanceMeter = document.createElement('div');
  distanceMeter.setAttribute('id', 'distanceBoard');
  distanceMeter.innerHTML = '0m';
  document.body.appendChild(distanceMeter);
}

function addExplosion() {
  particleGeometry = new THREE.Geometry();
  for (let i = 0; i < particleCount; i += 1) {
    const vertex = new THREE.Vector3();
    particleGeometry.vertices.push(vertex);
  }
  const pMaterial = new THREE.PointsMaterial({
    color: 0xfffafa,
    size: 0.2,
  });
  particles = new THREE.Points(particleGeometry, pMaterial);
  scene.add(particles);
  particles.visible = false;
}

function createTreesPool() {
  const maxTreesInPool = 10;
  let newTree;
  for (let i = 0; i < maxTreesInPool; i += 1) {
    newTree = new Tree().body;
    treesPool.push(newTree);
  }
}

function handleKeyDown(keyEvent) {
  const leftLane = -1;
  const rightLane = 1;

  if (jumping) return;
  let validMove = true;
  // if (keyEvent.keyCode === 80) pause();
  if (keyEvent.keyCode === 37) {
    // left
    if (currentLane === middleLane) {
      currentLane = leftLane;
    } else if (currentLane === rightLane) {
      currentLane = middleLane;
    } else {
      validMove = false;
    }
  } else if (keyEvent.keyCode === 39) {
    // right
    if (currentLane === middleLane) {
      currentLane = rightLane;
    } else if (currentLane === leftLane) {
      currentLane = middleLane;
    } else {
      validMove = false;
    }
  } else {
    if (keyEvent.keyCode === 38) {
      // up, jump
      bounceValue = 0.1;
      jumping = true;
    }
    validMove = false;
  }
  // heroSphere.position.x = currentLane;
  if (validMove) {
    jumping = true;
    bounceValue = 0.06;
  }
}

function addHero() {
  const sphereGeometry = new THREE.DodecahedronGeometry(heroRadius, 1);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xe5f2f2,
    shading: THREE.FlatShading,
  });
  jumping = false;
  heroSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  heroSphere.receiveShadow = true;
  heroSphere.castShadow = true;
  scene.add(heroSphere);
  heroSphere.position.y = heroBaseY;
  heroSphere.position.z = 4.8;
  currentLane = middleLane;
  heroSphere.position.x = currentLane;
}

function addWorld() {
  const sides = 40;
  const tiers = 40;
  const sphereGeometry = new THREE.SphereGeometry(worldRadius, sides, tiers);
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xfffafa,
    shading: THREE.FlatShading,
  });

  let vertexIndex;
  let vertexVector = new THREE.Vector3();
  let nextVertexVector = new THREE.Vector3();
  let firstVertexVector = new THREE.Vector3();
  let offset = new THREE.Vector3();
  let currentTier = 1;
  let lerpValue = 0.5;
  let heightValue;
  const maxHeight = 0.07;
  for (let j = 1; j < tiers - 2; j += 1) {
    currentTier = j;
    for (let i = 0; i < sides; i += 1) {
      vertexIndex = currentTier * sides + 1;
      vertexVector = sphereGeometry.vertices[i + vertexIndex].clone();
      if (j % 2 !== 0) {
        if (i === 0) {
          firstVertexVector = vertexVector.clone();
        }
        nextVertexVector = sphereGeometry.vertices[i + vertexIndex + 1].clone();
        if (i === sides - 1) {
          nextVertexVector = firstVertexVector;
        }
        lerpValue = Math.random() * (0.75 - 0.25) + 0.25;
        vertexVector.lerp(nextVertexVector, lerpValue);
      }
      heightValue = Math.random() * maxHeight - maxHeight / 2;
      offset = vertexVector
        .clone()
        .normalize()
        .multiplyScalar(heightValue);
      sphereGeometry.vertices[i + vertexIndex] = vertexVector.add(offset);
    }
  }
  rollingGroundSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  rollingGroundSphere.receiveShadow = true;
  rollingGroundSphere.castShadow = false;
  rollingGroundSphere.rotation.z = -Math.PI / 2;
  scene.add(rollingGroundSphere);
  rollingGroundSphere.position.y = -24;
  rollingGroundSphere.position.z = 2;
  addWorldTrees();
}

function addLight() {
  const hemisphereLight = new THREE.HemisphereLight(0xfffafa, 0x000000, 0.9);
  scene.add(hemisphereLight);
  const sun = new THREE.DirectionalLight(0xcdc1c5, 0.9);
  sun.position.set(12, 6, -7);
  sun.castShadow = true;
  scene.add(sun);
  // Set up shadow properties for the sun light
  sun.shadow.mapSize.width = 256;
  sun.shadow.mapSize.height = 256;
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 50;
}

function addPathTree() {
  const options = [0, 1, 2];
  let lane = Math.floor(Math.random() * 3);
  addTree(true, lane);
  options.splice(lane, 1);
  if (Math.random() > 0.5) {
    lane = Math.floor(Math.random() * 2);
    addTree(true, options[lane]);
  }
}

function addWorldTrees() {
  const numTrees = 36;
  const gap = 6.28 / 36;
  for (let i = 0; i < numTrees; i += 1) {
    addTree(false, i * gap, true);
    addTree(false, i * gap, false);
  }
}

function addTree(inPath, row, isLeft) {
  let newTree;
  if (inPath) {
    if (treesPool.length === 0) return;
    newTree = treesPool.pop();
    newTree.visible = true;
    treesInPath.push(newTree);
    sphericalHelper.set(
      worldRadius - 0.3,
      pathAngleValues[row],
      -rollingGroundSphere.rotation.x + 4,
    );
  } else {
    newTree = new Tree().body;
    let forestAreaAngle = 0; // [1.52,1.57,1.62];
    if (isLeft) {
      forestAreaAngle = 1.68 + Math.random() * 0.1;
    } else {
      forestAreaAngle = 1.46 - Math.random() * 0.1;
    }
    sphericalHelper.set(worldRadius - 0.3, forestAreaAngle, row);
  }
  newTree.position.setFromSpherical(sphericalHelper);
  const rollingGroundVector = rollingGroundSphere.position.clone().normalize();
  const treeVector = newTree.position.clone().normalize();
  newTree.quaternion.setFromUnitVectors(treeVector, rollingGroundVector);
  newTree.rotation.x += Math.random() * ((2 * Math.PI) / 10) + -Math.PI / 10;

  rollingGroundSphere.add(newTree);
}

function update() {
  const gravity = 0.005;
  const treeReleaseInterval = 0.5;
  const levelUpdateInterval = 30;

  if (gameOverFlag) return;

  if (levelClock.getElapsedTime() > levelUpdateInterval) {
    // update level & game speed
    levelClock.start();
    rollingSpeed += 0.001;
    levelCounter += 1;
    // update ground color using scheduler
    rollingGroundSphere.material.color.setHex(scheduler.getNextColor());
    notifyLevel(levelCounter);
  }
  rollingGroundSphere.rotation.x += rollingSpeed;
  heroSphere.rotation.x -= heroRollingSpeed;
  if (heroSphere.position.y <= heroBaseY) {
    jumping = false;
    bounceValue = Math.random() * 0.04 + 0.005;
  }
  heroSphere.position.y += bounceValue;
  heroSphere.position.x = THREE.Math.lerp(
    heroSphere.position.x,
    currentLane,
    2 * treeClock.getDelta(),
    treeClock.getElapsedTime(),
  );
  bounceValue -= gravity;
  if (treeClock.getElapsedTime() > treeReleaseInterval) {
    treeClock.start();
    addPathTree();
    distanceCounter += 1;
    if (!hasCollided) {
      score += 2 * treeReleaseInterval;
      scoreText.innerHTML = score.toString();
      distanceMeter.innerHTML = `Completed: ${distanceCounter}m<br>Highest: 
        ${localStorage.getItem('newscore')}m`;
      if (distanceCounter > localStorage.getItem('newscore')) {
        localStorage.setItem('newscore', distanceCounter);
      }
    } else {
      gameOver();
    }
  }
  doTreeLogic();
  doExplosionLogic();
  render();
  globalRenderID = requestAnimationFrame(update); // request next update
}

function doTreeLogic() {
  let oneTree;
  const treePos = new THREE.Vector3();
  const treesToRemove = [];
  treesInPath.forEach((element, index) => {
    oneTree = treesInPath[index];
    treePos.setFromMatrixPosition(oneTree.matrixWorld);
    if (treePos.z > 6 && oneTree.visible) {
      // gone out of our view zone
      treesToRemove.push(oneTree);
    } else if (treePos.distanceTo(heroSphere.position) <= 0.6) {
      hasCollided = true;
      explode();
    }
  });
  let fromWhere;
  treesToRemove.forEach((element, index) => {
    oneTree = treesToRemove[index];
    fromWhere = treesInPath.indexOf(oneTree);
    treesInPath.splice(fromWhere, 1);
    treesPool.push(oneTree);
    oneTree.visible = false;
  });
}

function doExplosionLogic() {
  if (!particles.visible) return;
  for (let i = 0; i < particleCount; i += 1) {
    particleGeometry.vertices[i].multiplyScalar(explosionPower);
  }
  if (explosionPower > 1.005) {
    explosionPower -= 0.001;
  } else {
    particles.visible = false;
  }
  particleGeometry.verticesNeedUpdate = true;
}

function explode() {
  particles.position.y = 2;
  particles.position.z = 4.8;
  particles.position.x = heroSphere.position.x;
  for (let i = 0; i < particleCount; i += 1) {
    const vertex = new THREE.Vector3();
    vertex.x = -0.2 + Math.random() * 0.4;
    vertex.y = -0.2 + Math.random() * 0.4;
    vertex.z = -0.2 + Math.random() * 0.4;
    particleGeometry.vertices[i] = vertex;
  }
  explosionPower = 1.07;
  particles.visible = true;
}

function render() {
  renderer.render(scene, camera);
}

function gameOver() {
  const gameOverDiv = document.createElement('div');
  gameOverDiv.id = 'gameOverDiv';
  gameOverDiv.innerHTML = `<p id='gameOverText'> GAME OVER WITH SCORE OF: ${score} </p> <button id='restart' onClick='restart()'>Restart Game</button>`;
  document.body.appendChild(gameOverDiv);

  score = 0;
  scoreText.innerHTML = score.toString();

  distanceCounter = 0;
  heroRollingSpeed = 0;
  rollingGroundSphere.rotation.x = 0;
  rollingSpeed = 0;
  gameOverFlag = true;

  cancelAnimationFrame(globalRenderID);
}

function restart() {
  gameOverFlag = false;
  hasCollided = false;
  score = 0;
  const parent = document.getElementById('gameOverDiv').parentElement;
  parent.removeChild(document.getElementById('gameOverDiv'));
  rollingSpeed = initRollingSpeed;
  levelCounter = 1;
  heroRollingSpeed = (rollingSpeed * worldRadius) / heroRadius / 5;
  update();
}

function pause() {
  isPaused = !isPaused;
  if (isPaused) {
    heroRollingSpeed = 0;
    rollingGroundSphere.rotation.x = 0;
    rollingSpeed = 0;
  } else {
    rollingSpeed = initRollingSpeed;
    heroRollingSpeed = (rollingSpeed * worldRadius) / heroRadius / 5;
    update();
  }
}

function notifyLevel(level) {
  const levelUpDiv = document.createElement('div');
  levelUpDiv.id = 'levelUpDiv';
  levelUpDiv.innerHTML = `<p id='levelUpText'> Level ${level} </p>`;
  document.body.appendChild(levelUpDiv);
  window.setTimeout(() => {
    document.getElementById('levelUpDiv').remove();
  }, 500);
}

function onWindowResize() {
  // resize & align
  sceneHeight = window.innerHeight;
  sceneWidth = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();
}
