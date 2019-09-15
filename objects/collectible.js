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

    this.mesh.position.y = 55;

    this.level = 0;
  }

  resetLocation(max, min) {
    this.mesh.position.x = Math.floor(Math.random() * (max - min + 1)) + min;
    this.mesh.position.z = -700;
    this.mesh.visible = true;
  }

  rotate() {
    this.level += 0.1;
    this.mesh.position.y += Math.cos(this.level) * 0.25;
    this.mesh.rotation.y += (3 * Math.PI) / 180;
  }
}
