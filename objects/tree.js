import { Colors } from './colors.js';

export class Tree {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'tree';

    // upper part
    this.sides = 13;
    let tiers = 10;
    let scalarMultiplier = Math.random() * (1.25 - 1.1) + 10.05;
    this.bushGeom = new THREE.ConeGeometry(17.5, 70, this.sides, tiers);
    let bushMat = new THREE.MeshStandardMaterial({
      color: Colors.treeGreen,
      flatShading: true
    });

    this.blowUpTree(0, scalarMultiplier);
    this.tightenTree(1);
    this.blowUpTree(2, scalarMultiplier * 1.1, true);
    this.tightenTree(3);
    this.blowUpTree(4, scalarMultiplier * 1.2);
    this.tightenTree(5);
    this.blowUpTree(6, scalarMultiplier * 1.2);
    this.tightenTree(7);
    this.blowUpTree(8, scalarMultiplier * 1.2);

    let bush = new THREE.Mesh(this.bushGeom, bushMat);
    bush.castShadow = true;
    bush.receiveShadow = true;
    bush.position.y = 90;
    bush.rotation.y = Math.random() * Math.PI;

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
    trunk.position.y = 35;

    this.mesh.add(trunk);
    this.mesh.add(bush);
  }

  resetLocation(min, max) {
    this.mesh.position.z = -700;
    this.mesh.position.x = Math.floor(Math.random() * (max - min + 1)) + min;
    this.mesh.visible = true;
  }

  tightenTree(currentTier) {
    let vertexIndex;
    let vertexVector = new THREE.Vector3();
    const midPointVector = this.bushGeom.vertices[0].clone();
    let offset;
    for (let i = 0; i < this.sides; i += 1) {
      vertexIndex = currentTier * this.sides + 1;
      vertexVector = this.bushGeom.vertices[i + vertexIndex].clone();
      midPointVector.y = vertexVector.y;
      offset = vertexVector.sub(midPointVector);
      offset.normalize().multiplyScalar(0.06);
      this.bushGeom.vertices[i + vertexIndex].sub(offset);
    }
  }

  blowUpTree(currentTier, scalarMultiplier, odd) {
    let vertexIndex;
    let vertexVector = new THREE.Vector3();
    const midPointVector = this.bushGeom.vertices[0].clone();
    let offset;
    for (let i = 0; i < this.sides; i += 1) {
      vertexIndex = currentTier * this.sides + 1;
      vertexVector = this.bushGeom.vertices[i + vertexIndex].clone();
      midPointVector.y = vertexVector.y;
      offset = vertexVector.sub(midPointVector);
      if (odd) {
        if (i % 2 === 0) {
          offset.normalize().multiplyScalar(scalarMultiplier / 6);
          this.bushGeom.vertices[i + vertexIndex].add(offset);
        } else {
          offset.normalize().multiplyScalar(scalarMultiplier);
          this.bushGeom.vertices[i + vertexIndex].add(offset);
          this.bushGeom.vertices[i + vertexIndex].y =
            this.bushGeom.vertices[i + vertexIndex + this.sides].y + 0.05;
        }
      } else if (i % 2 !== 0) {
        offset.normalize().multiplyScalar(scalarMultiplier / 6);
        this.bushGeom.vertices[i + vertexIndex].add(offset);
      } else {
        offset.normalize().multiplyScalar(scalarMultiplier);
        this.bushGeom.vertices[i + vertexIndex].add(offset);
        this.bushGeom.vertices[i + vertexIndex].y =
          this.bushGeom.vertices[i + vertexIndex + this.sides].y + 0.05;
      }
    }
  }
}
