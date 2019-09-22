import { Colors } from './colors.js';

export class Bomb {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'bomb';

    // head
    let headGeom = new THREE.ConeGeometry(35, 80, 64);
    let headMat = new THREE.MeshPhongMaterial({
      color: Colors.silver,
      flatShading: true
    });
    let head = new THREE.Mesh(headGeom, headMat);
    head.castShadow = true;
    head.receiveShadow = true;

    this.mesh.add(head);

    // body
    let bodyGeom = new THREE.CylinderGeometry(35, 35, 160, 64);
    let bodyMat = new THREE.MeshPhongMaterial({
      color: Colors.silver,
      flatShading: true
    });
    let body = new THREE.Mesh(bodyGeom, bodyMat);
    body.castShadow = true;
    body.receiveShadow = true;
    body.position.y = -120;

    this.mesh.add(body);

    this.mesh.scale.set(0.22, 0.22, 0.22);
    this.mesh.rotation.x = Math.PI;
  }

  reset() {
    this.mesh.position.y = 0;
    this.mesh.visible = false;
  }
}
