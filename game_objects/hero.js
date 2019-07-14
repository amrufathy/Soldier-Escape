// eslint-disable-next-line no-unused-vars
class Hero {
  constructor(scene) {
    this.depth = 0.05;

    this.radius = 0.2;
    this.baseY = 1.8;
    // Character defaults that don't change throughout the game.
    this.skinColor = colors.pink;
    this.hairColor = colors.black;
    this.shirtColor = colors.yellow;
    this.shortsColor = colors.navy;

    this.angleHairs = 0;

    this.runningStartTime = new Date() / 1000;
    this.pauseStartTime = new Date() / 1000;
    this.stepFreq = 1.4;

    // Build the character.
    // createBox (dimension of the box, color, position relative to the world )
    this.face = Hero.createBox(0.07, 0.08, this.depth, this.skinColor, -1.0, 0.5, 0, 'Face');
    // position relative to the world
    this.hair = Hero.createBox(0.075, 0.01, this.depth, this.hairColor, -1.0, 0.547, 0, 'TopHair');
    this.backhair = Hero.createBox(0.075, 0.065, 0.01, this.hairColor, -1.0, 0.52, 0.03, 'BackHair');
    this.sidehair = Hero.createBox(0.005, 0.065, 0.024, this.hairColor, -1.04, 0.52, 0.02, 'sideHair');
    this.sidehair2 = Hero.createBox(0.005, 0.065, 0.024, this.hairColor, -0.96, 0.52, 0.02, 'sideHair2');

    // Move the face & hair (left, up, depth) relative to world coordinates
    this.head = Hero.createGroup(1.0, -0.15, 0, 'Head');
    this.head.add(this.face);
    this.head.add(this.hair);
    this.head.add(this.backhair);
    this.head.add(this.sidehair);
    this.head.add(this.sidehair2);

    // createBox (dimension of the box, color, position relative to world coordinates )
    // width, height, depth
    this.torso = Hero.createBox(0.1, 0.2, 0.1, this.shirtColor, 0, 0.23, 0, 'Torso');
    var texture = new THREE.TextureLoader().load( 'assets/img/pattern.png' );
    this.torso.receiveShadow = true ;
    this.torso.castShadow = true ;
    this.torso.material.map = texture ;

    // createBox (width, lenth, depth, color, (left, up, depth) position relative to world coordinates )
    // ( +ve is right, +ve is up, +ve is closer to the screen / camera)
    //  position relative to upper arm )
    this.leftLowerArm = Hero.createLimb(0.04, 0.09, this.depth, this.skinColor, 0.0, -0.11, 0, 'leftLowerArm');
    //  position relative to world )
    this.leftArm = Hero.createLimb(0.04, 0.1, this.depth, this.skinColor, -0.08, 0.3, 0, 'leftArm');
    this.leftArm.add(this.leftLowerArm);

    // position of the lower arm is relative to the upper arm
    this.rightLowerArm = Hero.createLimb(0.04, 0.09, this.depth, this.skinColor, 0.0, -0.11, 0, 'rightLowerArm');
    this.rightArm = Hero.createLimb(0.04, 0.1, this.depth, this.skinColor, 0.08, 0.3, 0, 'rightArm');
    this.rightArm.add(this.rightLowerArm);

    this.leftLowerLeg = Hero.createLimb(0.04, 0.09, this.depth, this.skinColor, 0, -0.1, 0, 'leftLowerLeg');
    this.leftLeg = Hero.createLimb(0.04, 0.1, this.depth, this.shortsColor, -0.05, 0.15, 0, 'leftLeg');
    this.leftLeg.add(this.leftLowerLeg);

    this.rightLowerLeg = Hero.createLimb(0.04, 0.09, this.depth, this.skinColor, 0, -0.1, 0, 'rightLowerLeg');
    this.rightLeg = Hero.createLimb(0.04, 0.1, this.depth, this.shortsColor, 0.06, 0.15, 0, 'rightLeg');
    this.rightLeg.add(this.rightLowerLeg);

    // This specifies the position of my entire character in the world
    // set the body to the actual hero mesh
    this.body = Hero.createGroup(0.0, 2.0, 4.8, 'Hero');
    this.body.add(this.head); // 0
    this.body.add(this.torso); // 1
    this.body.add(this.leftArm); // 2
    this.body.add(this.rightArm); // 3
    this.body.add(this.leftLeg); // 4
    this.body.add(this.rightLeg); // 5

    this.body.receiveShadow = true;
    this.body.castShadow = true;
    this.body.position.y = this.baseY;
    this.body.position.z = 4.8;
    // middle lane
    this.body.position.x = 0;
    scene.add(this.body);
  }

  static createBox(dx, dy, dz, color, x, y, z, str) {
    const geom = new THREE.BoxGeometry(dx, dy, dz);
    const mat = new THREE.MeshPhongMaterial({
      color,
      shading: THREE.FlatShading,
    });
    const box = new THREE.Mesh(geom, mat);
    box.name = str;
    box.castShadow = true;
    box.receiveShadow = true;
    box.position.set(x, y, z);
    return box;
  }

  static createGroup(x, y, z, str) {
    const group = new THREE.Group();
    group.name = str;
    // position relative to the camera / world
    group.position.set(x, y, z);
    return group;
  }

  static createLimb(dx, dy, dz, color, x, y, z, str) {
    const limb = Hero.createGroup(x, y, z, str);
    const offset = -1 * (Math.max(dx, dz) / 2 + dy / 2);
    const limbBox = Hero.createBox(dx, dy, dz, color, 0, offset, 0);
    limb.add(limbBox);
    return limb;
  }

  static sinusoid(frequency, minimum, maximum, phase, time) {
    const amplitude = 0.5 * (maximum - minimum);
    const angularFrequency = 2.0 * Math.PI * frequency;
    const phaseRadians = (phase * Math.PI) / 180;
    const offset = amplitude * Math.sin(angularFrequency * time + phaseRadians);
    const average = (minimum + maximum) / 2.0;
    return average + offset;
  }

  update() {
    const currentTime = new Date() / 1000;
    const runningClock = currentTime - this.runningStartTime;
    const deg2Rad = Math.PI / 180;

    this.leftArm.rotation.x = Hero.sinusoid(this.stepFreq, -70, 40, 180, runningClock) * deg2Rad;
    this.rightArm.rotation.x = Hero.sinusoid(this.stepFreq, -70, 40, 0, runningClock) * deg2Rad;

    this.leftLowerArm.rotation.x = Hero.sinusoid(this.stepFreq, 70, 100, 180, runningClock) * deg2Rad;
    this.rightLowerArm.rotation.x = Hero.sinusoid(this.stepFreq, 70, 100, 0, runningClock) * deg2Rad;

    this.leftLeg.rotation.x = Hero.sinusoid(this.stepFreq, -20, 80, 0, runningClock) * deg2Rad;
    this.rightLeg.rotation.x = Hero.sinusoid(this.stepFreq, -20, 80, 180, runningClock) * deg2Rad;

    this.leftLowerLeg.rotation.x = Hero.sinusoid(this.stepFreq, -130, 5, 210, runningClock) * deg2Rad;
    this.rightLowerLeg.rotation.x = Hero.sinusoid(this.stepFreq, -130, 5, 30, runningClock) * deg2Rad;
  }
}
