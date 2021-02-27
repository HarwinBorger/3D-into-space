import React from "react";

import * as THREE from 'three';
import store from "../redux/store";
import {toggleAutoPilot} from "../redux/actions";

//globals
import {Scope, Objects} from './Globals';

//objects
import Sun from './Sun';
import SunParticles from './SunParticles';
import World from './World';
import Planet from './Planet';
import Ufo from './Ufo';
import SoundSun from './sounds/sun.mp3';
import {ColladaLoader} from "three/examples/jsm/loaders/ColladaLoader";
import LaserParticles from "./LaserParticles";

export default class SolarSystem {
	constructor(scene, cameras, renderer, controls, listener)
	{
		this.scene = Scope.scene;
		this.cameras = cameras;
		this.renderer = renderer;
		this.controls = controls;

		// SunGroup

		this.solarSystemGroup = new THREE.Group();
//		this.solarSystemGroup.add(sunLight);

		// Add sun
		this.sun = new Sun();
		this.solarSystemGroup.add(this.sun.object);

		// Add light sunParticles
		this.sunParticles = new SunParticles(300, 8000);
		this.solarSystemGroup.add(this.sunParticles.getObject());

		Scope.scene.add(this.solarSystemGroup);

		// Generate World
		var core = {};
		core.listener = listener;

		let worldPositionX = 3000;
		this.world = new World(core);
		this.worldPivot = new THREE.Object3D();
		this.world.object.position.x = worldPositionX;
		this.world.object.position.y = 0;
		this.worldPivot.add(this.world.object);
		this.solarSystemGroup.add(this.worldPivot);

		/**
		 * Planet
		 * @type {Object3D}
		 */
		this.planetPivot = new THREE.Object3D();
		let planet = new Planet();
		planet.object.position.x = 0;
		planet.object.position.z = -600;
		this.planetPivot.add(planet.object);
		this.solarSystemGroup.add(this.planetPivot);

		/**
		 * Planet 2
		 */
		this.planetPivot2 = new THREE.Object3D();
		let planet2 = new Planet('#353100', 80);
		planet2.object.position.x = -15000;
		planet2.object.position.z = 500;
		this.planetPivot2.add(planet2.object);
		this.solarSystemGroup.add(this.planetPivot2);


		/**
		 * Ufo's
		 */
		this.ufoPivot = new THREE.Object3D();

		this.ufo = new Ufo(Objects.ufo.clone());
		this.ufoPivot.add(this.ufo.object);
		this.solarSystemGroup.add(this.ufoPivot);

		//Follow up Ufo
		this.ufoFollower = new Ufo(Objects.ufo.clone(), '#a800ff');
		this.solarSystemGroup.add(this.ufoFollower.object);

		// Lasers
		this.lasers = new LaserParticles(listener,this.ufo.object, '#00ff52');
		this.lasersFollower = new LaserParticles(listener,this.ufoFollower.object, '#a800ff',1);
		this.solarSystemGroup.add(this.lasers.object);
		this.solarSystemGroup.add(this.lasersFollower.object);

		/**
		 * Update objects list
		 * @type {*[]}
		 */
		this.updateObjects = [
			this.world,
			this.sunParticles,
			this.sun,
		];

		/**
		 * Camera timing
		 * @type {{angleSpeed: number, minDistance: number, angle: number, y: number, radius: number, radiusMultiplier: number}}
		 */
		this.cam = {
			radius: 150000,
			radiusMultiplier: 0.005,
			angle: 90,
			angleSpeed: 0.011,
			y: 50000,
			minDistance: 100
		};


		/**
		 * SOUNDS
		 */
			// create the PositionalAudio object (passing in the listener)
		var sound = new THREE.PositionalAudio(listener);
		// load a sound and set it as the PositionalAudio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load(SoundSun, function (buffer) {
			sound.setBuffer(buffer);
			sound.setLoop(true);
			sound.setRefDistance(100);
			sound.setMaxDistance(500);
			sound.setVolume(.5);
			sound.play();
		});

//		this.world.object.add(sound);
		this.sun.object.add(sound);


		/**
		 * Sun
		 * Light all objects except the world. This done by setting a very large angle so it hit's all except the world.
		 * @type {number}
		 */
		let sunLightAngle = Math.PI / 1.0021;
		let sunLight = new THREE.SpotLight('#ffde63', 1, 100000, sunLightAngle, 0.002);
		sunLight.target.position.set(-100000, 0, 0);
		this.worldPivot.add(sunLight);
		this.worldPivot.add(sunLight.target);

		// SunLight specific for world
		let worldLightAngle = Math.PI / 360 * 150;
		const worldLight = new THREE.SpotLight('#ffde63', 1.3, 60, worldLightAngle, 1, 1);
		worldLight.target.position.set(worldPositionX, 0, 0);
		worldLight.position.x = 2950;
		this.worldPivot.add(worldLight);
		this.worldPivot.add(worldLight.target);
	}

	update(time)
	{
		this.worldPivot.rotation.y += 0.00001;
		this.planetPivot.rotation.y += 0.00005;
		this.planetPivot2.rotation.y += 0.00003;
		this.ufoPivot.rotation.y += 0.001;

		// When ufo is loaded
		if (this.ufo) {
			this.ufo.object.position.x = 3100 + Math.sin(time * 0.1) * 1500;
			this.ufo.object.position.z = Math.sin(time * 0.01) * 5000;
			this.ufo.object.position.y = Math.sin(time * 0.1) * 500;
			this.ufo.update(time);

			var ufoTarget = new THREE.Vector3();
			var ufoPosition = this.ufo.object.getWorldPosition(ufoTarget);
		}

		// When ufoFollower is loaded
		if (this.ufoFollower) {
			let modY = Math.sin(time * .1) * 500;
			let modX = Math.sin(time * .1) * 500;
			let modZ = Math.sin(time * .1) * 1000;
			var difX = this.ufoFollower.object.position.x - (ufoPosition.x + modX);
			var difY = this.ufoFollower.object.position.y - (ufoPosition.y + modY);
			var difZ = this.ufoFollower.object.position.z - (ufoPosition.z + modZ);
			this.ufoFollower.object.position.x += (difX / 250) * -1;
			this.ufoFollower.object.position.y += ((difY / 50) * -1);
			this.ufoFollower.object.position.z += (difZ / 80) * -1;
			this.ufoFollower.update(time);
			// Randomly shoot from the ufoFollower to the ufo.
			this.lasersFollower.update(time, this.ufoFollower.object.position.clone(), ufoPosition);
			this.lasers.update(time, ufoPosition,this.ufoFollower.object.position.clone());

			// Add position for ufo camera
//			this.cameras.ufo.position.set(this.ufoFollower.object.position.clone());
			this.cameras.ufo.lookAt(this.ufoFollower.object.position);
			this.controls.ufo.target = this.ufoFollower.object.position;
		}

		this.updateObjects.forEach(function (object) {
			object.update(time);
		});

		this.world.lookAtWorld(this.scene, this.cameras.world, this.controls.world);

		// Intro camera animation
		this.cameraSpiral();
	}

	/**
	 * Todo add cameraSpiral to update que, so function can be removed when animation is done.
	 */
	cameraSpiral()
	{
		if (store.getState().autoPilot.status === false) {
			return;
		}

		if (store.getState().lightSpeed === true) {
			this.cam.radiusMultiplier += 0.001;
			if (this.cam.y > 0) {
				this.cam.y -= this.cam.y * 0.03;
			}
		}

		// Continue animation as long as camera distance to world is larger then 1 or speed around world is above 0.002
		if (this.cam.radius > 1 || this.cam.angleSpeed > 0.0005) {
			var x = Math.cos(this.cam.angle) * (this.cam.radius + this.cam.minDistance);
			var z = Math.sin(this.cam.angle) * (this.cam.radius + this.cam.minDistance);

			// Convert position of world to scene position
			var worldPosition = new THREE.Vector3();
			let position = this.world.object.getWorldPosition(worldPosition);

			// Set new camera variables
			this.cameras.world.position.x = position.x + x;
			this.cameras.world.position.z = position.z + z;
			this.cameras.world.position.y = this.cam.y;

			// Set new calculation variables for next position
			this.cam.radius -= this.cam.radius * this.cam.radiusMultiplier;
			this.cam.angle -= this.cam.angleSpeed;
			this.cam.angleSpeed -= this.cam.angleSpeed * 0.001;
			this.cam.y -= this.cam.y * 0.01;
		} else {
			toggleAutoPilot();
		}
	}
}