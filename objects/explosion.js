export class Explosion {
  constructor(scene, pCount) {
    this.particleCount = pCount;
    this.explosionPower = 1.06;

    this.particleGeometry = new THREE.Geometry();
    for (let i = 0; i < this.particleCount; i += 1) {
      const vertex = new THREE.Vector3();
      this.particleGeometry.vertices.push(vertex);
    }
    const pMaterial = new THREE.PointsMaterial({
      color: 0xfffafa,
      size: 10
    });
    this.particles = new THREE.Points(this.particleGeometry, pMaterial);
    scene.add(this.particles);
    this.particles.visible = false;
  }

  explode(obj) {
    this.particles.position.y = 70;
    this.particles.position.z = obj.mesh.position.z;
    this.particles.position.x = obj.mesh.position.x;
    for (let i = 0; i < this.particleCount; i += 1) {
      const vertex = new THREE.Vector3();
      vertex.x = -1.5 + Math.random() * 2.0;
      vertex.y = -1.5 + Math.random() * 2.0;
      vertex.z = -1.5 + Math.random() * 2.0;
      this.particleGeometry.vertices[i] = vertex;
    }
    this.explosionPower = 1.07;
    this.particles.visible = true;
  }

  logic() {
    if (!this.particles.visible) return;
    for (let i = 0; i < this.particleCount; i += 1) {
      this.particleGeometry.vertices[i].multiplyScalar(this.explosionPower);
    }
    if (this.explosionPower > 1.005) {
      this.explosionPower -= 0.001;
    } else {
      this.particles.visible = false;
    }
    this.particleGeometry.verticesNeedUpdate = true;
  }
}
