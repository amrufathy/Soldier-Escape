import { Colors } from './colors.js';

export class Cloud {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'cloud';

    // body
    const geom = new THREE.DodecahedronGeometry(20);
    const mat = new THREE.MeshPhongMaterial({ color: Colors.white });

    // each cloud consists of 3 or more blocks
    const nBlocs = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < nBlocs; i++) {
      const m = new THREE.Mesh(geom.clone(), mat);
      m.position.set(i * 15, Math.random() * 10, Math.random() * 10);
      m.rotation.z = Math.random() * Math.PI * 2;
      m.rotation.y = Math.random() * Math.PI * 2;
      const s = 0.1 + Math.random() * 0.9;
      m.scale.set(s, s, s);
      m.castShadow = true;
      this.mesh.add(m);
    }
  }

  rotate() {
    const l = this.mesh.children.length;
    for (let i = 0; i < l; i++) {
      const m = this.mesh.children[i];
      m.rotation.z += Math.random() * 0.005 * (i + 1);
      m.rotation.y += Math.random() * 0.002 * (i + 1);
    }
  }
}
