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
    let wheelTireGeom = new THREE.CylinderGeometry(10, 10, 4);
    let wheelTireMat = new THREE.MeshPhongMaterial({
      color: Colors.brownDark,
      shading: THREE.FlatShading
    });
    let wheelTire = new THREE.Mesh(wheelTireGeom, wheelTireMat);
    wheelTire.castShadow = true;
    wheelTire.rotation.z = Math.PI / 2;
    let wheelTireFL = wheelTire.clone();
    wheelTireFL.position.set(25, -18, 20);
    this.mesh.add(wheelTireFL);
    let wheelTireFR = wheelTire.clone();
    wheelTireFR.position.set(-25, -18, 20);
    this.mesh.add(wheelTireFR);
    let wheelTireBL = wheelTire.clone();
    wheelTireBL.position.set(25, -18, -20);
    this.mesh.add(wheelTireBL);
    let wheelTireBR = wheelTire.clone();
    wheelTireBR.position.set(-25, -18, -20);
    this.mesh.add(wheelTireBR);

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

    let frontLightsL = lights.clone();
    frontLightsL.position.set(-20, 10, 40);
    this.mesh.add(frontLightsL);

    let frontLightsR = lights.clone();
    frontLightsR.position.set(20, 10, 40);
    this.mesh.add(frontLightsR);

    // engine vent
    let engineVentGeom = new THREE.BoxGeometry(40, 2, 1);
    let engineVentMat = new THREE.MeshPhongMaterial({
      color: Colors.white,
      shading: THREE.FlatShading
    });
    let engineVent = new THREE.Mesh(engineVentGeom, engineVentMat);
    let engineVentT = engineVent.clone();
    this.mesh.add(engineVentT);
    engineVentT.position.set(0, 0, 40);
    let engineVentM = engineVent.clone();
    this.mesh.add(engineVentM);
    engineVentM.position.set(0, -3, 40);
    let engineVentB = engineVent.clone();
    this.mesh.add(engineVentB);
    engineVentB.position.set(0, -6, 40);

    // driver
    this.driver = new Driver();
    this.driver.mesh.position.set(-10, 27, 10);
    this.driver.mesh.rotation.y = -Math.PI / 2;
    this.mesh.add(this.driver.mesh);
  }
}
