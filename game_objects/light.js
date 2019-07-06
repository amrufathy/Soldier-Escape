// eslint-disable-next-line no-unused-vars
class Light {
  constructor(scene) {
    this.hemisphereLight = new THREE.HemisphereLight(0xfffafa, 0x000000, 0.9);
    scene.add(this.hemisphereLight);

    this.sun = new THREE.DirectionalLight(0xcdc1c5, 0.9);
    this.sun.position.set(12, 6, -7);
    this.sun.castShadow = true;
    scene.add(this.sun);

    // Set up shadow properties for the sun light
    this.sun.shadow.mapSize.width = 256;
    this.sun.shadow.mapSize.height = 256;
    this.sun.shadow.camera.near = 0.5;
    this.sun.shadow.camera.far = 50;
  }
}
