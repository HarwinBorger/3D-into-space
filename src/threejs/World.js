import * as THREE from 'three';

// Global
import {Scope, Objects} from './Globals';

//Calcs
import {getRandomRange, getRandomInt, loop, manipulateIcosahedron} from "./Services";

// Internal models
import Moon from "./world/Moon";
import Balloon from "./world/Balloon"
import Dinosaur from "./world/Dinosaur"
import Rainbow from "./world/Rainbow"
import Atmosphere from "./world/Atmosphere";

// External Textures
import GlowTextureUrl from "./textures/glow.png";
import FireTextureUrl from "./textures/fire.png";

// External sound
import BgSoundUrl from './sounds/bg-2.mp3';


export default class World {
	object;

	// World
	#worldRotationSpeed = .05;
	// Clouds
	#cloudPivots = [];
	// Trees
	#treeCount = 100;
	#treeStatus = [];
	treePivots = [];

	constructor(core)
	{
		const SELF = this;
		/**
		 * Variables
		 * @type {number}
		 */
		// WorldCenter
		this.worldCenter = new THREE.Group();

		/**
		 * Create world
		 * @type {MeshPhongMaterial}
		 */

			// Setup world geometry
		let geometry = new THREE.IcosahedronGeometry(20, 3);
		geometry = manipulateIcosahedron(geometry, -.5, .5);

		let material = new THREE.MeshPhongMaterial({
			color: "#0f1f09",
			flatShading: THREE.FlatShading,
			vertexColors: THREE.VertexColors,
			fog: true
		});

		this.world = new THREE.Mesh(geometry, material);
		this.world.name = "world";

		/**
		 * SOUNDS
		 */
			// create the PositionalAudio object (passing in the listener)
		let sound = new THREE.PositionalAudio(core.listener);
		// load a sound and set it as the PositionalAudio object's buffer
		let audioLoader = new THREE.AudioLoader();
		audioLoader.load(BgSoundUrl, function (buffer) {
			sound.setBuffer(buffer);
			sound.setLoop(true);
			sound.setRefDistance(150);
			sound.setMaxDistance(500);
			sound.play();
		});

		this.worldCenter.add(sound);

		let glowMaterial = new THREE.SpriteMaterial(
			{
				map: new THREE.TextureLoader().load(GlowTextureUrl),
				color: '#00ceff',
				transparent: true,
				opacity: .05,
				blending: THREE.AdditiveBlending,
				depthWrite: false,
			});

		let worldGlow = new THREE.Sprite(glowMaterial);
		worldGlow.scale.set(200, 200, 1.0);
		this.worldCenter.add(worldGlow); // this centers the glow at the mesh

		let atmosphere = new Atmosphere(30, '#c1e9ff');
		this.worldCenter.add(atmosphere);

		/**
		 * Water
		 * @type {IcosahedronGeometry}
		 */
			//World water
		let waterGeometry = new THREE.IcosahedronGeometry(19.75, 3);
		let waterMaterial = new THREE.MeshPhysicalMaterial({
			color: "#2196F3",
			reflectivity: 1
		});

		let water = new THREE.Mesh(waterGeometry, waterMaterial);
		this.world.add(water);

		/**
		 * Balloon
		 */
		this.balloonPivot = new THREE.Object3D();
		this.balloonPivot.add(Scope.cameras.balloon);
		Scope.cameras.balloon.position.y = 36.3;

		this.balloon = new Balloon();
		this.balloonPivot.add(this.balloon.object);

		this.world.add(this.balloonPivot);

		/**
		 * Clouds
		 * @type {number}
		 */
		this.cloudCount = 15;
		this.cloudObjects = [
			Objects.cloud1,
			Objects.cloud2,
		];

		this.addCloudsToWorld();

		/**
		 * Trees
		 */
		this.addTreesToWorld();

		/**
		 * Dinosaur
		 */
		let dinosaurPivot = new THREE.Object3D();
		let dinosaur = new Dinosaur();
		dinosaurPivot.add(dinosaur.object);
		this.world.add(dinosaurPivot);

		/**
		 * Rainbow
		 */
		let rainbowPivot = new THREE.Object3D();
		this.rainbow = new Rainbow(40);
		rainbowPivot.add(this.rainbow.object);
		this.world.add(rainbowPivot);

		/**
		 * Moons
		 * @type {Moon}
		 */
		// Moon One
		this.moonOnePivot = new THREE.Object3D();
		this.moonOne = new Moon('#00b5ff', 10, core.listener);
		this.moonOne.object.position.setX(180);

		this.moonOnePivot.add(this.moonOne.object);
		this.worldCenter.add(this.moonOnePivot);

		// Moon Two
		this.moonTwoPivot = new THREE.Object3D();
		this.moonTwo = new Moon('#2196F3', 8, core.listener);
		this.moonTwo.object.position.setX(250);

		this.moonTwoPivot.add(this.moonTwo.object);
		this.worldCenter.add(this.moonTwoPivot);

		/**
		 * Show world
		 */
		this.worldCenter.add(this.world);

		this.object = this.worldCenter;

		this.updateObjects = [
			this.moonOne,
			this.moonTwo,
			this.balloon,
			this.rainbow,
		];
	}

	addCloudsToWorld()
	{
		const SELF = this;
		// Generate Clouds
		for (let i = 0; i < this.cloudCount; i++) {
			// Objects
			let random = getRandomInt(0, this.cloudObjects.length);
			let cloud = this.cloudObjects[random].clone();
			let cloudPivot = new THREE.Object3D();
			// Variables
			let scale = getRandomRange(.5, 4);

			cloud.position.x = getRandomRange(26, 29);
			cloud.scale.set(scale, scale, scale * 0.5);
			cloud.lookAt(this.world.position);

			cloudPivot.add(cloud);

			this.#cloudPivots.push(cloudPivot);
		}

		// Add Clouds to the World
		this.#cloudPivots.forEach(function (cloudPivot) {
			SELF.world.add(cloudPivot);
			cloudPivot.rotation.x += getRandomRange(0, 360);
			cloudPivot.rotation.y += getRandomRange(0, 360);
			cloudPivot.rotation.z += getRandomRange(0, 360);
		});
	}

	addTreesToWorld()
	{
		const SELF = this;

		var fireGeometry = new THREE.Geometry();
		fireGeometry.vertices.push(new THREE.Vector3( 0, 0, 0));
		let fireMaterial = new THREE.PointsMaterial({
			map: new THREE.TextureLoader().load(FireTextureUrl),
			color: '#9ff',
			transparent: true,
			opacity: 1,
			blending: THREE.AdditiveBlending,
			size: 10,
			side: THREE.DoubleSide,
			depthWrite: false
		});
		let fireBallObject = new THREE.Points(fireGeometry, fireMaterial);

		// Generate Trees
		for (let i = 0; i < this.#treeCount; i++) {
			// Create object of animation stats
			this.#treeStatus[i] = {};
			this.#treeStatus[i].shoot = true;
			// Make new pivot
			let treePivot = new THREE.Object3D();

			let tree = Objects.tree.clone();

			// Add fireball
			let fireBall = new THREE.Points(fireGeometry, fireMaterial.clone());
			fireBall.lookAt(this.world.position);
			tree.position.y = 20;
			fireBall.position.z = -0.1;
			tree.add(fireBall);
			treePivot.add(tree);

			treePivot.lookAt(this.world.position);
			treePivot.rotation.x += getRandomRange(0, 360);
			treePivot.rotation.y += getRandomRange(0, 360);
			treePivot.rotation.z += getRandomRange(0, 360);

			// Add tree camera to first tree
			if(i===5){
				tree.add(Scope.cameras.tree);
				Scope.cameras.tree.position.z = 10;
			}

			this.treePivots.push(treePivot);
			SELF.world.add(treePivot);
		}

		// Add Trees to the World
		this.treePivots.forEach(function (treePivot) {

		});
	}

	/* PUBLIC FUNCTIONS */
	lockCameraToWorld(camera)
	{
		this.worldCenter.add(camera);
	}

	lookAtWorld(scene, object, controls)
	{
		let wpVector = new THREE.Vector3();
		let position = this.worldCenter.getWorldPosition(wpVector);
		controls.target = position;
		object.lookAt(position);
	}

	update(time)
	{
		const worldAngle = time * this.#worldRotationSpeed;

		// world rotation
		this.world.rotation.x = worldAngle;
		this.world.rotation.z = worldAngle;

		// moon rotation
		this.moonOnePivot.rotation.z -= .0001;
		this.moonOnePivot.rotation.y -= .001;

		this.moonTwoPivot.rotation.z += .00008;
		this.moonTwoPivot.rotation.y += .0015;

		// Moons should look to World
		let wpVector = new THREE.Vector3();
		let position = this.worldCenter.getWorldPosition(wpVector);
		this.moonOne.object.lookAt(position);
		this.moonTwo.object.lookAt(position);

		// Move clouds
		this.#cloudPivots.forEach(function (cloudPivot) {
			cloudPivot.rotation.z += 0.0002;
			cloudPivot.rotation.x += 0.0002;
		});

		// Update all objects
		this.updateObjects.forEach(function (object) {
			object.update(time);
		});

		// Rotate balloon
		this.balloonPivot.rotation.x += 0.001;
		this.balloonPivot.rotation.y += 0.001;
		this.balloonPivot.rotation.z += 0.001;

		// Tree grows
		let newTime = time * 0.025;
		this.treePivots.forEach((tree, i) => {
			let scale = (Math.sin(newTime + i) + 1) / 1.5;

			if (scale > 1.3) {
				this.#treeStatus[i].scale = false;
			} else if (scale < 0.01) {
				this.#treeStatus[i].scale = true;
				this.#treeStatus[i].shoot = false;
				this.#treeStatus[i].speed = 0;
				tree.children[0].children[2].material.size = 0;

				tree.children[0].position.y = 20
			} else if (scale < 0.1) {
				this.#treeStatus[i].shoot = true;
			}
//			console.log(tree);
			if (this.#treeStatus[i].scale === true) {
				tree.children[0].scale.set(scale, scale, scale);
			} else if (this.#treeStatus[i].shoot === true) {
				this.#treeStatus[i].speed += 0.07;
				tree.children[0].position.y += this.#treeStatus[i].speed;
				tree.children[0].children[2].material.size += .1;
			}
		});
	}
}