// eslint-disable-next-line no-unused-vars
class Explosion {
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
      size: 0.2,
    });
    this.particles = new THREE.Points(this.particleGeometry, pMaterial);
    scene.add(this.particles);
    this.particles.visible = false;
  }

  explode(heroSphere) {
    this.particles.position.y = 2;
    this.particles.position.z = 4.8;
    this.particles.position.x = heroSphere.position.x;
    for (let i = 0; i < this.particleCount; i += 1) {
      const vertex = new THREE.Vector3();
      vertex.x = -0.2 + Math.random() * 0.4;
      vertex.y = -0.2 + Math.random() * 0.4;
      vertex.z = -0.2 + Math.random() * 0.4;
      this.particleGeometry.vertices[i] = vertex;
    }
    this.explosionPower = 1.06;
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
