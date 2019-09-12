export class Collectible {
  constructor() {
    this.mesh = new THREE.Object3D();

    const mat = new THREE.MeshPhongMaterial({
      color: 0x33ff33,
      specular: 0x2aff5a,
      emissive: 0x009900,
      shininess: 70,
      flatShading: true,
      blending: THREE.NormalBlending
    });
    const geom = new THREE.IcosahedronGeometry(7, 0);
    let body = new THREE.Mesh(geom, mat);
    this.mesh.add(body);
  }

  resetLocation(max, min) {
    this.mesh.position.x = Math.floor(Math.random() * (max - min + 1)) + min;
    this.mesh.position.z = -700;
    this.mesh.visible = true;
  }
}
