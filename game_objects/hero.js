// eslint-disable-next-line no-unused-vars
class Hero {
  constructor(scene) {
    this.radius = 0.2;
    this.baseY = 1.8;

    this.sphereGeometry = new THREE.DodecahedronGeometry(this.radius, 1);
    this.sphereMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5f2f2,
      shading: THREE.FlatShading,
    });

    // set the body to the actual hero mesh
    this.body = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial);
    this.body.receiveShadow = true;
    this.body.castShadow = true;
    scene.add(this.body);
    this.body.position.y = this.baseY;
    this.body.position.z = 4.8;
    // middle lane
    this.body.position.x = 0;
  }
}
