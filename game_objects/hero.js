// eslint-disable-next-line no-unused-vars
// eslint-disable-next-line no-unused-vars
class Hero {
  constructor(scene) {

  this.depth = 0.05;


  this.radius = 0.2;
  this.baseY = 1.8;
  // Character defaults that don't change throughout the game.
  this.skinColor = Colors.pink;
  this.hairColor = Colors.black;
  this.shirtColor = Colors.yellow;
  this.shortsColor = Colors.olive;

  this.angleHairs=0;

  this.runningStartTime = new Date() / 1000;
	this.pauseStartTime = new Date() / 1000;
  this.stepFreq = 1.4;


  // Build the character.
    // createBox (dimension of the box, color, position relative to the world )
		this.face = this.createBox(0.07, 0.08, this.depth, this.skinColor, -1.0, 0.5, 0, "Face");
                                          // position relative to the world
		this.hair = this.createBox(0.075, 0.01, this.depth, this.hairColor, -1.0, 0.547, 0, "TopHair");
		this.backhair = this.createBox(0.075, 0.065, 0.01, this.hairColor, -1.0, 0.52, 0.03, "BackHair");
		this.sidehair = this.createBox(0.005, 0.065, 0.024, this.hairColor, -1.04, 0.52, 0.02, "sideHair");
		this.sidehair2 = this.createBox(0.005, 0.065, 0.024, this.hairColor, -0.96, 0.52, 0.02, "sideHair2");

    // Move the face & hair (left, up, depth) relative to world coordinates
		this.head = this.createGroup(1.0, -0.15, 0, "Head");
		this.head.add(this.face);
		this.head.add(this.hair);
		this.head.add(this.backhair);
		this.head.add(this.sidehair);
		this.head.add(this.sidehair2);

    // createBox (dimension of the box, color, position relative to world coordinates )
                           // width, height, depth
		this.torso = this.createBox(0.1, 0.2, 0.1, this.shirtColor, 0, 0.23, 0, "Torso");

    // createBox (width, lenth, depth, color, (left, up, depth) position relative to world coordinates )
                               // ( +ve is right, +ve is up, +ve is closer to the screen / camera)
                               //  position relative to upper arm )
    this.leftLowerArm = this.createLimb(0.04, 0.09, this.depth, this.skinColor, 0.0, -0.11, 0, "leftLowerArm");
                                                  //  position relative to world )
    this.leftArm = this.createLimb(0.04, 0.10, this.depth, this.skinColor, -0.08 , 0.3, 0, "leftArm");
		this.leftArm.add(this.leftLowerArm);

                                            // position of the lower arm is relative to the upper arm
		this.rightLowerArm = this.createLimb(0.04, 0.09, this.depth, this.skinColor, 0.0, -0.11, 0, "rightLowerArm");
		this.rightArm = this.createLimb(0.04, 0.10, this.depth, this.skinColor, 0.08, 0.3, 0, "rightArm");
		this.rightArm.add(this.rightLowerArm);

		this.leftLowerLeg = this.createLimb(0.04, 0.09, this.depth, this.skinColor, 0, -0.1, 0, "leftLowerLeg");
		this.leftLeg = this.createLimb(0.04, 0.10, this.depth, this.shortsColor, -0.05, 0.15, 0, "leftLeg");
		this.leftLeg.add(this.leftLowerLeg);

		this.rightLowerLeg = this.createLimb(0.04, 0.09, this.depth, this.skinColor, 0, -0.1, 0, "rightLowerLeg");
		this.rightLeg = this.createLimb(0.04, 0.10, this.depth, this.shortsColor, 0.06, 0.15, 0, "rightLeg");
		this.rightLeg.add(this.rightLowerLeg);

  // This specifies the position of my entire character in the world
  this.body = this.createGroup(0.0, 2.0, 4.8, "Hero");
  this.body.add(this.head); //0
  this.body.add(this.torso); //1
  this.body.add(this.leftArm); //2
  this.body.add(this.rightArm); // 3
  this.body.add(this.leftLeg); // 4
  this.body.add(this.rightLeg); // 5

  // set the body to the actual hero mesh
  this.body.receiveShadow = true;
  this.body.castShadow = true;
  this.body.position.y = this.baseY;
  this.body.position.z = 4.8;
  // middle lane
  this.body.position.x = 0;
  scene.add(this.body);
  // }

  }

  createBox(dx, dy, dz, color, x, y, z, str) {
      var geom = new THREE.BoxGeometry(dx, dy, dz);
      var mat = new THREE.MeshPhongMaterial({
  		color:color,
      shading: THREE.FlatShading,
      });
      var box = new THREE.Mesh(geom, mat);
      box.name = str
      box.castShadow = true;
      box.receiveShadow = true;
      box.position.set(x, y, z);
      return box;
  }

  createGroup(x, y, z, str) {
  	var group = new THREE.Group();
    group.name = str;
    // position relative to the camera / world
  	group.position.set(x, y, z);
  	return group;
  }


  createLimb(dx, dy, dz, color, x, y, z, str) {
      var limb = this.createGroup(x, y, z, str);
      var offset = -1 * (Math.max(dx, dz) / 2 + dy / 2);
    var limbBox = this.createBox(dx, dy, dz, color, 0, offset, 0);
    limb.add(limbBox);
    return limb;
  }

  sinusoid(frequency, minimum, maximum, phase, time) {
  	var amplitude = 0.5 * (maximum - minimum);
  	var angularFrequency = 2.0 * Math.PI * frequency;
  	var phaseRadians = phase * Math.PI / 180;
  	var offset = amplitude * Math.sin(angularFrequency * time + phaseRadians);
  	var average = (minimum + maximum) / 2.0;
  	return average + offset;
  }

  update_hero() {


    var currentTime = new Date() / 1000;
    var runningClock = currentTime - this.runningStartTime;
    var deg2Rad = Math.PI / 180;

      this.leftArm.rotation.x = this.sinusoid(
        this.stepFreq, -70, 40, 180, runningClock) * deg2Rad;
      this.rightArm.rotation.x = this.sinusoid(
        this.stepFreq, -70, 40, 0, runningClock) * deg2Rad;

      this.leftLowerArm.rotation.x = this.sinusoid(
        this.stepFreq, 70, 100, 180, runningClock) * deg2Rad;
      this.rightLowerArm.rotation.x = this.sinusoid(
        this.stepFreq, 70, 100, 0, runningClock) * deg2Rad;

      this.leftLeg.rotation.x = this.sinusoid(
        this.stepFreq, -20, 80, 0, runningClock) * deg2Rad;
      this.rightLeg.rotation.x = this.sinusoid(
        this.stepFreq, -20, 80, 180, runningClock) * deg2Rad;

      this.leftLowerLeg.rotation.x = this.sinusoid(
        this.stepFreq, -130, 5, 210, runningClock) * deg2Rad;
      this.rightLowerLeg.rotation.x = this.sinusoid(
        this.stepFreq, -130, 5, 30, runningClock) * deg2Rad;
  }

  }
