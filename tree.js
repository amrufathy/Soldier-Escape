// eslint-disable-next-line no-unused-vars
class Tree {
  constructor() {
    this.sides = 8;
    this.tiers = 6;
    this.scalarMultiplier = Math.random() * (0.25 - 0.1) + 0.05;

    this.geometry = new THREE.ConeGeometry(0.5, 1, this.sides, this.tiers);
    this.material = new THREE.MeshStandardMaterial({
      color: 0x33ff33,
      shading: THREE.FlatShading,
    });

    this.blowUpTree(0, this.scalarMultiplier);
    this.tightenTree(1);
    this.blowUpTree(2, this.scalarMultiplier * 1.1, true);
    this.tightenTree(3);
    this.blowUpTree(4, this.scalarMultiplier * 1.2);
    this.tightenTree(5);

    this.top = new THREE.Mesh(this.geometry, this.material);
    this.top.castShadow = true;
    this.top.receiveShadow = true;
    this.top.position.y = 0.9;
    this.top.rotation.y = Math.random() * Math.PI;

    this.trunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5);
    this.trunkMaterial = new THREE.MeshStandardMaterial({
      color: 0x886633,
      shading: THREE.FlatShading,
    });
    this.trunk = new THREE.Mesh(this.trunkGeometry, this.trunkMaterial);
    this.trunk.position.y = 0.25;

    this.body = new THREE.Object3D();
    this.body.add(this.trunk);
    this.body.add(this.top);
  }

  tightenTree(currentTier) {
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

  blowUpTree(currentTier, scalarMultiplier, odd) {
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
