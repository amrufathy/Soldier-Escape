import { Colors } from './colors.js';
import { Driver } from './driver.js';

export class Car {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'car';

    // car body
    let bodyMat = new THREE.MeshPhongMaterial({
      color: Colors.red,
      shading: THREE.FlatShading
    });
    let bodyGeom = new THREE.BoxGeometry(50, 30, 80, 1, 1, 1);
    let body = new THREE.Mesh(bodyGeom, bodyMat);
    body.castShadow = true;
    body.receiveShadow = true;
    this.mesh.add(body);

    // tires
    let tireGeom = new THREE.CylinderGeometry(10, 10, 4);
    let tireMat = new THREE.MeshPhongMaterial({
      color: Colors.brownDark,
      shading: THREE.FlatShading
    });
    let tire = new THREE.Mesh(tireGeom, tireMat);
    tire.castShadow = true;
    tire.rotation.z = Math.PI / 2;
    let tireFL = tire.clone();
    tireFL.position.set(25, -18, 20);
    this.mesh.add(tireFL);
    let tireFR = tire.clone();
    tireFR.position.set(-25, -18, 20);
    this.mesh.add(tireFR);
    let tireBL = tire.clone();
    tireBL.position.set(25, -18, -20);
    this.mesh.add(tireBL);
    let tireBR = tire.clone();
    tireBR.position.set(-25, -18, -20);
    this.mesh.add(tireBR);

    // windshield
    let geomWindshield = new THREE.BoxGeometry(3, 20, 45, 1, 1, 1);
    let matWindshield = new THREE.MeshPhongMaterial({
      color: Colors.white,
      transparent: true,
      opacity: 0.3,
      shading: THREE.FlatShading
    });
    let windshield = new THREE.Mesh(geomWindshield, matWindshield);
    windshield.position.set(0, 20, 30);
    windshield.rotation.y = Math.PI / 2;
    windshield.castShadow = true;
    windshield.receiveShadow = true;
    this.mesh.add(windshield);

    // bumper
    let bumperGeom = new THREE.BoxGeometry(55, 6, 6);
    let bumperMat = new THREE.MeshPhongMaterial({
      color: Colors.white,
      shading: THREE.FlatShading
    });
    let bumper = new THREE.Mesh(bumperGeom, bumperMat);
    bumper.receiveShadow = true;
    let frontBumper = bumper.clone();
    frontBumper.position.set(0, -14, 40);
    this.mesh.add(frontBumper);
    let backBumper = bumper.clone();
    backBumper.position.set(0, -14, -40);
    this.mesh.add(backBumper);

    // number Plate
    let numberPlateGeom = new THREE.BoxGeometry(12, 10, 2);
    let numberPlateMat = new THREE.MeshPhongMaterial({
      color: Colors.white,
      shading: THREE.FlatShading
    });
    let numberPlate = new THREE.Mesh(numberPlateGeom, numberPlateMat);
    numberPlate.receiveShadow = true;
    this.mesh.add(numberPlate);
    numberPlate.position.set(0, -5, -40);

    // tail lights
    let lightsGeom = new THREE.BoxGeometry(6, 8, 2);
    let lightsMat = new THREE.MeshPhongMaterial({
      color: Colors.pink,
      shading: THREE.FlatShading
    });
    let lights = new THREE.Mesh(lightsGeom, lightsMat);
    lights.receiveShadow = true;
    let backLightsL = lights.clone();
    backLightsL.position.set(-20, 10, -40);
    this.mesh.add(backLightsL);
    let backLightsR = lights.clone();
    backLightsR.position.set(20, 10, -40);
    this.mesh.add(backLightsR);

    // driver
    this.driver = new Driver();
    this.driver.mesh.position.set(-10, 27, 10);
    this.driver.mesh.rotation.y = -Math.PI / 2;
    this.mesh.add(this.driver.mesh);
  }
}
