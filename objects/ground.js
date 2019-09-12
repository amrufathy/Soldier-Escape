import { Colors } from './colors.js';

export class Ground {
  constructor(width) {
    const groundGeom = new THREE.PlaneGeometry(width, width, 1, 1);
    const groundMat = new THREE.MeshPhongMaterial({
      color: Colors.ground,
      flatShading: true
    });
    this.mesh = new THREE.Mesh(groundGeom, groundMat);
    this.mesh.name = 'ground';
    this.mesh.receiveShadow = true;
  }
}
