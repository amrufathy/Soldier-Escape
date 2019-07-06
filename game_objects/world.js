// eslint-disable-next-line no-unused-vars
class World {
  constructor(scene) {
    this.sides = 40;
    this.tiers = 40;
    this.radius = 26;

    this.sphereGeometry = new THREE.SphereGeometry(this.radius, this.sides, this.tiers);
    this.sphereMaterial = new THREE.MeshStandardMaterial({
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

    for (let j = 1; j < this.tiers - 2; j += 1) {
      currentTier = j;
      for (let i = 0; i < this.sides; i += 1) {
        vertexIndex = currentTier * this.sides + 1;
        vertexVector = this.sphereGeometry.vertices[i + vertexIndex].clone();
        if (j % 2 !== 0) {
          if (i === 0) {
            firstVertexVector = vertexVector.clone();
          }
          nextVertexVector = this.sphereGeometry.vertices[i + vertexIndex + 1].clone();
          if (i === this.sides - 1) {
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
        this.sphereGeometry.vertices[i + vertexIndex] = vertexVector.add(offset);
      }
    }

    this.body = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
    this.body.receiveShadow = true;
    this.body.castShadow = false;
    this.body.rotation.z = -Math.PI / 2;
    scene.add(this.body);
    this.body.position.y = -24;
    this.body.position.z = 2;
  }
}
