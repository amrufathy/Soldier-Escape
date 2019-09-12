import { Colors } from './colors.js';

export class Tree {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'tree';

    // upper part
    let bushGeom = new THREE.DodecahedronGeometry(20);
    let bushMat = new THREE.MeshPhongMaterial({
      color: Colors.green,
      flatShading: true
    });
    let bush = new THREE.Mesh(bushGeom, bushMat);
    this.mesh.add(bush);
    bush.position.y = 60;
    bush.rotation.y = Math.random() * Math.PI;
    bush.castShadow = true;

    // trunk
    let trunkGeom = new THREE.CylinderGeometry(
      Math.abs(Math.random() * 3) + 1,
      Math.abs(Math.random() * 5) + 3,
      100
    );
    let trunkMat = new THREE.MeshPhongMaterial({
      color: Colors.brown,
      flatShading: true
    });
    let trunk = new THREE.Mesh(trunkGeom, trunkMat);
    trunk.castShadow = true;

    this.mesh.add(trunk);
  }

  resetLocation(max, min) {
    this.mesh.position.z = -700;
    this.mesh.position.x = Math.floor(Math.random() * (max - min + 1)) + min;
    this.mesh.visible = true;
  }
}
