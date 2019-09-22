import { Colors } from './colors.js';

export class Tree {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'tree';

    this.sides = 13;
    this.tiers = 9;
    this.scalarMultiplier = Math.random() * (1.25 - 1.1) + 10.05;

    this.geometry = new THREE.ConeGeometry(17.5, 41, this.sides, this.tiers);
    this.material = new THREE.MeshStandardMaterial({
      color: 0x33ff33,
      shading: THREE.FlatShading,
    });

    this.blowUpTree1(0, this.scalarMultiplier);
    this.tightenTree1(1);
    this.blowUpTree1(2, this.scalarMultiplier * 1.1, true);
    this.tightenTree1(3);
    this.blowUpTree1(4, this.scalarMultiplier * 1.2);
    this.tightenTree1(5);
    this.blowUpTree1(6, this.scalarMultiplier * 1.2);
    this.tightenTree1(7);

    this.top = new THREE.Mesh(this.geometry, this.material);
    this.top.castShadow = true;
    this.top.receiveShadow = true;
    this.top.position.y = 90;
    this.top.rotation.y = Math.random() * Math.PI;

    this.trunkGeometry = new THREE.CylinderGeometry(
      Math.abs(Math.random() * 3) + 1,
      Math.abs(Math.random() * 5) + 3,
      100
    );
    this.trunkMaterial = new THREE.MeshPhongMaterial({
      color: Colors.brown,
      flatShading: true
    });
    this.trunk = new THREE.Mesh(this.trunkGeometry, this.trunkMaterial);
    this.trunk.position.y = 35;

    this.mesh.add(this.trunk);
    this.mesh.add(this.top);
  }

  resetLocation(min, max) {
    this.mesh.position.z = -700;
    this.mesh.position.x = Math.floor(Math.random() * (max - min + 1)) + min;
    this.mesh.visible = true;
  }

  tightenTree1(currentTier) {
    let vertexIndex;
    let vertexVector = new THREE.Vector3();
    const midPointVector = this.geometry.vertices[0].clone();
    let offset;
    for (let i = 0; i < this.sides; i += 1) {
      vertexIndex = currentTier * this.sides + 1;
      vertexVector = this.geometry.vertices[i + vertexIndex].clone();
      midPointVector.y = vertexVector.y;
      offset = vertexVector.sub(midPointVector);
      offset.normalize().multiplyScalar(0.06);
      this.geometry.vertices[i + vertexIndex].sub(offset);
    }
  }

  blowUpTree1(currentTier, scalarMultiplier, odd) {
    let vertexIndex;
    let vertexVector = new THREE.Vector3();
    const midPointVector = this.geometry.vertices[0].clone();
    let offset;
    for (let i = 0; i < this.sides; i += 1) {
      vertexIndex = currentTier * this.sides + 1;
      vertexVector = this.geometry.vertices[i + vertexIndex].clone();
      midPointVector.y = vertexVector.y;
      offset = vertexVector.sub(midPointVector);
      if (odd) {
        if (i % 2 === 0) {
          offset.normalize().multiplyScalar(scalarMultiplier / 6);
          this.geometry.vertices[i + vertexIndex].add(offset);
        } else {
          offset.normalize().multiplyScalar(scalarMultiplier);
          this.geometry.vertices[i + vertexIndex].add(offset);
          this.geometry.vertices[i + vertexIndex].y = this.geometry.vertices[i + vertexIndex + this.sides].y + 0.05;
        }
      } else if (i % 2 !== 0) {
        offset.normalize().multiplyScalar(scalarMultiplier / 6);
        this.geometry.vertices[i + vertexIndex].add(offset);
      } else {
        offset.normalize().multiplyScalar(scalarMultiplier);
        this.geometry.vertices[i + vertexIndex].add(offset);
        this.geometry.vertices[i + vertexIndex].y = this.geometry.vertices[i + vertexIndex + this.sides].y + 0.05;
      }
    }
  }
}
