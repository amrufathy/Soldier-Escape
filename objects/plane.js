import { Bomb } from './bomb.js';
import { Colors } from './colors.js';
import { Driver } from './driver.js';

export class Plane {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'plane';

    // body
    let bodyGeom = new THREE.ConeGeometry(35, 80, 4, 1, 0);
    let bodyMat = new THREE.MeshPhongMaterial({
      color: Colors.red,
      flatShading: true
    });

    let body = new THREE.Mesh(bodyGeom, bodyMat);
    body.name = 'plane body';
    body.castShadow = true;
    body.receiveShadow = true;
    body.rotation.x = Math.PI * 0.25;
    body.rotation.z = Math.PI * 0.5;
    this.mesh.add(body);

    // engine
    let engineGeom = new THREE.BoxGeometry(20, 50, 50, 1, 1, 1);
    let engineMat = new THREE.MeshPhongMaterial({
      color: Colors.white,
      flatShading: true
    });
    let engine = new THREE.Mesh(engineGeom, engineMat);
    engine.name = 'engine';
    engine.position.x = 40;
    engine.castShadow = true;
    engine.receiveShadow = true;
    this.mesh.add(engine);

    // wing
    let wingGeom = new THREE.BoxGeometry(40, 8, 150, 1, 1, 1);
    let wingMat = new THREE.MeshPhongMaterial({
      color: Colors.red,
      flatShading: true
    });
    let wing = new THREE.Mesh(wingGeom, wingMat);
    wing.name = 'wing';
    wing.castShadow = true;
    wing.receiveShadow = true;
    this.mesh.add(wing);

    // axis
    let axisGeom = new THREE.BoxGeometry(20, 10, 10, 1, 1, 1);
    let axisMat = new THREE.MeshPhongMaterial({
      color: Colors.brown,
      flatShading: true
    });
    this.axis = new THREE.Mesh(axisGeom, axisMat);
    this.axis.name = 'axis';
    this.axis.castShadow = true;
    this.axis.receiveShadow = true;

    // blade
    let geomBlade = new THREE.BoxGeometry(1, 100, 20, 1, 1, 1);
    let matBlade = new THREE.MeshPhongMaterial({
      color: Colors.brownDark,
      flatShading: true
    });
    let blade = new THREE.Mesh(geomBlade, matBlade);
    blade.name = 'blade';
    blade.position.set(8, 0, 0);
    blade.castShadow = true;
    blade.receiveShadow = true;
    this.axis.add(blade);
    this.axis.position.set(50, 0, 0);
    this.mesh.add(this.axis);

    // pilot
    this.pilot = new Driver();
    this.pilot.mesh.position.set(-5, 25, 0);
    this.mesh.add(this.pilot.mesh);

    // bomb
    this.bomb = new Bomb();
    this.bomb.reset();
    this.mesh.add(this.bomb.mesh);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.mesh.position.y = 180;
    this.mesh.rotation.y = -Math.PI / 2;
    this.mesh.scale.set(0.2, 0.2, 0.2);

    this.firing = false;
    this.fired = false;
  }

  update() {
    this.axis.rotation.x += 0.3;

    this.pilot.updateHairs();
  }
}
