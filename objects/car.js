import { Colors } from './colors.js';
import { Driver } from './driver.js';

export class Car {
  constructor() {
    this.mesh = new THREE.Object3D();
    this.mesh.name = 'car';

    // car frame
    this.carframe = new THREE.Object3D();
    this.carframe.name = 'frame';
    
    // frame main body
    let bodyGeom = new THREE.BoxGeometry(50, 30, 80, 1, 1, 1);
    let bodyMat = new THREE.MeshPhongMaterial({
      color: Colors.red,
      flatShading: true
    });
    this.body = new THREE.Mesh(bodyGeom, bodyMat);
    this.body.name = 'car body';
    this.body.castShadow = true;
    this.body.receiveShadow = true;
    this.carframe.add(this.body);

    // tires
    let tireGeom = new THREE.CylinderGeometry(10, 10, 4);
    let tireMat = new THREE.MeshPhongMaterial({
      color: Colors.brownDark,
      flatShading: true
    });
    let tire = new THREE.Mesh(tireGeom, tireMat);
    tire.castShadow = true;
    tire.rotation.z = Math.PI / 2;
    this.tireFL = tire.clone();
    this.tireFL.name = "FL Tire"
    this.tireFL.position.set(25, -18, 20);
    this.mesh.add(this.tireFL);
    this.tireFR = tire.clone();
    this.tireFR.name = "FR Tire"
    this.tireFR.position.set(-25, -18, 20);
    this.mesh.add(this.tireFR);
    this.tireBL = tire.clone();
    this.tireBL.name = "BL Tire"
    this.tireBL.position.set(25, -18, -20);
    this.mesh.add(this.tireBL);
    this.tireBR = tire.clone();
    this.tireBR.name = "BR Tire"
    this.tireBR.position.set(-25, -18, -20);
    this.mesh.add(this.tireBR);

    // windshield
    let geomWindshield = new THREE.BoxGeometry(3, 20, 45, 1, 1, 1);
    let matWindshield = new THREE.MeshPhongMaterial({
      color: Colors.white,
      transparent: true,
      opacity: 0.3,
      flatShading: true
    });
    let windshield = new THREE.Mesh(geomWindshield, matWindshield);
    windshield.name = 'windshield'
    windshield.position.set(0, 20, 30);
    windshield.rotation.y = Math.PI / 2;
    windshield.castShadow = true;
    windshield.receiveShadow = true;
    this.carframe.add(windshield);

    // bumper
    let bumperGeom = new THREE.BoxGeometry(55, 6, 6);
    let bumperMat = new THREE.MeshPhongMaterial({
      color: Colors.white,
      flatShading: true
    });
    let bumper = new THREE.Mesh(bumperGeom, bumperMat);
    bumper.receiveShadow = true;
    let frontBumper = bumper.clone();
    frontBumper.name = 'front bumper';
    frontBumper.position.set(0, -14, 40);
    this.carframe.add(frontBumper);
    let backBumper = bumper.clone();
    backBumper.name = 'back bumper';
    backBumper.position.set(0, -14, -40);
    this.carframe.add(backBumper);

    // number Plate
    let numberPlateGeom = new THREE.BoxGeometry(12, 10, 2);
    let numberPlateMat = new THREE.MeshPhongMaterial({
      color: Colors.white,
      flatShading: true
    });
    let numberPlate = new THREE.Mesh(numberPlateGeom, numberPlateMat);
    numberPlate.name = 'number plate';
    numberPlate.receiveShadow = true;
    this.carframe.add(numberPlate);
    numberPlate.position.set(0, -5, -40);

    // tail lights
    let lightsGeom = new THREE.BoxGeometry(6, 8, 2);
    let lightsMat = new THREE.MeshPhongMaterial({
      color: Colors.pink,
      flatShading: true
    });
    let lights = new THREE.Mesh(lightsGeom, lightsMat);
    lights.receiveShadow = true;
    let backLightsL = lights.clone();
    backLightsL.position.set(-20, 10, -40);
    backLightsL.name = 'left b light';
    this.carframe.add(backLightsL);
    let backLightsR = lights.clone();
    backLightsR.position.set(20, 10, -40);
    backLightsR.name = 'right b light';
    this.carframe.add(backLightsR);

    // driver
    this.driver = new Driver();
    this.driver.mesh.position.set(-10, 27, 10);
    this.driver.mesh.rotation.y = -Math.PI / 2;
    this.carframe.add(this.driver.mesh);
    this.mesh.add(this.carframe);
    

    this.mesh.position.x = 0;
    this.mesh.position.y = 50;
    this.mesh.rotation.y = Math.PI;
    this.mesh.scale.set(0.5, 0.5, 0.5);

    this.level = 0;
  }

  update() {
    this.level += 0.16;
    // this.mesh.position.y = 50 + Math.cos(this.level) * 1.25;
    this.carframe.position.y =  2.25 * Math.cos(this.level);
    this.tireFL.rotation.x += 0.1
    this.tireFR.rotation.x += 0.1
    this.tireBL.rotation.x += 0.1
    this.tireBR.rotation.x += 0.1
    this.driver.updateHairs();
  }
}
