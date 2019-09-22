import { Colors } from './colors.js';

export class Bird {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'bird';

    // wing geometry & material
    const wingGeom = new THREE.BoxGeometry(5, 30, 20);
    const wingMat = new THREE.MeshPhongMaterial({
      color: Colors.brownDark,
      flatShading: true
    });

    const wing = new THREE.Mesh(wingGeom, wingMat);
    wingGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 15, 10));

    // create both wings
    const wingL = wing.clone();
    this.mesh.add(wingL);
    wingL.rotation.z = -Math.PI / 4;

    const wingR = wing.clone();
    this.mesh.add(wingR);
    wingR.rotation.z = Math.PI / 4;

    this.wingAngle = 0;

    this.mesh.position.y = 300;
    this.mesh.rotation.y = Math.PI / 2;
    this.mesh.scale.set(0.35, 0.35, 0.35);
  }

  flapWings() {
    this.wingAngle += 0.1;
    this.mesh.children[0].rotation.z =
      -Math.PI / 4 + (Math.cos(this.wingAngle) * Math.PI) / 8;
    this.mesh.children[1].rotation.z =
      Math.PI / 4 - (Math.cos(this.wingAngle) * Math.PI) / 8;
  }
}
