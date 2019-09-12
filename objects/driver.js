import { Colors } from './colors.js';

export class Driver {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'driver';
    this.angleHairs = 0;

    // body
    let bodyGeom = new THREE.BoxGeometry(15, 15, 15);
    let bodyMat = new THREE.MeshPhongMaterial({
      color: Colors.brown,
      flatShading: true
    });
    let body = new THREE.Mesh(bodyGeom, bodyMat);
    body.position.set(2, -12, 0);
    this.mesh.add(body);

    // face
    let headGeom = new THREE.BoxGeometry(10, 10, 10);
    let headMat = new THREE.MeshLambertMaterial({ color: Colors.pink });
    let head = new THREE.Mesh(headGeom, headMat);
    this.mesh.add(head);

    // hairs
    let hairGeom = new THREE.BoxGeometry(4, 4, 4);
    let hairMat = new THREE.MeshLambertMaterial({ color: Colors.brown });
    let hair = new THREE.Mesh(hairGeom, hairMat);
    hair.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 2, 0));
    let hairs = new THREE.Object3D();
    this.hairsTop = new THREE.Object3D();
    for (let i = 0; i < 12; i++) {
      let h = hair.clone();
      let col = i % 3;
      let row = Math.floor(i / 3);
      let startPosZ = -4;
      let startPosX = -4;
      h.position.set(startPosX + row * 4, 0, startPosZ + col * 4);
      h.geometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 1));
      this.hairsTop.add(h);
    }
    hairs.add(this.hairsTop);

    let hairBackGeom = new THREE.BoxGeometry(2, 8, 10);
    let hairBack = new THREE.Mesh(hairBackGeom, hairMat);
    hairBack.position.set(-1, -4, 0);
    hairs.add(hairBack);
    hairs.position.set(-5, 5, 0);
    this.mesh.add(hairs);

    // ears
    let earGeom = new THREE.BoxGeometry(2, 3, 2);
    let earL = new THREE.Mesh(earGeom, headMat);
    earL.position.set(0, 0, -6);
    let earR = earL.clone();
    earR.position.set(0, 0, 6);
    this.mesh.add(earL);
    this.mesh.add(earR);
  }

  updateHairs() {
    let hairs = this.hairsTop.children;
    for (let i = 0; i < hairs.length; i++) {
      let h = hairs[i];
      h.scale.y = 0.75 + Math.cos(this.angleHairs + i / 3) * 0.25;
    }
    this.angleHairs += 0.16;
  }
}
