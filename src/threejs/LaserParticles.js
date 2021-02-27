import * as THREE from 'three'
import ParticleTexture from './textures/hart.png';
import Laser1Sound from './sounds/laser-1.mp3';
import Laser2Sound from './sounds/laser-2.mp3';
import {getRandomInt, getRandomRange, loop} from "./Services";

export default class LaserParticles {
	current = 0;
	particlePositions = [];
	particleCount = 30;
	speed = 0.02;
	shotChange = 50; // How often will there be a shot
	luckyRange = 1.5; // How precise will the shot be
	sound = [];

	constructor(listener, target,color = '#a800ff',soundNumber=0)
	{
//		var particleCount = 10,
		let	particles = new THREE.Geometry();

		// create the particle variables
		var pMaterial = new THREE.PointsMaterial({
			color: color,
			size: 100,
			map: new THREE.TextureLoader().load(ParticleTexture),
			blending: THREE.AdditiveBlending,
			transparent: true,
			opacity:.6,
			depthWrite: false
		});// create the particle variables

		// now create the individual particles
		loop(this.particleCount)((p) => {
			var particle = new THREE.Vector3(0,0,0);

			// add it to the geometry
			particles.vertices.push(particle);
		});

		// create the particle system
		var particleSystem = new THREE.Points(particles, pMaterial);
		particleSystem.sortParticles = true;

		this.object = particleSystem;

		/**
		 * SOUNDS
		 */
			// create the PositionalAudio object (passing in the listener)
		loop(this.particleCount)((index)=>{
			this.sound[index] = new THREE.PositionalAudio( listener );
		});

		// load a sound and set it as the PositionalAudio object's buffer
		let laserSound = [Laser1Sound,Laser2Sound];
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( laserSound[soundNumber], ( buffer ) =>{
			loop(this.particleCount)((index)=>{
				this.sound[index].setBuffer( buffer );
				this.sound[index].setRefDistance( 50 );
				this.sound[index].setMaxDistance( 100 );
				this.sound[index].setVolume(1);

				target.add(this.sound[index]);
			});
		});


	}

	update(time, startPosition, targetPosition)
	{
		if(getRandomInt(0,this.shotChange)===0){
			// Calculate speed
			let speed = {'x':0,'y':0,'z':0};

			for (const [key, value] of Object.entries(speed)) {
				speed[key] = (targetPosition[key] - startPosition[key]) * this.speed + getRandomRange(-this.luckyRange,this.luckyRange);
			}

			// Safe current shot data
			let currentShot = this.particlePositions[this.current] = {
				'start': startPosition,
				'target': targetPosition,
				'speed': speed
			};
			// Set shot
			this.object.geometry.vertices[this.current] = currentShot.start;

			// Play sound
			this.sound[this.current].startTime = 0;
			this.sound[this.current].play();

			// Next
			this.current++;

			if(this.current >= this.particleCount){
				this.current = 0;
			}
		}

		this.particlePositions.forEach((info, index)=>{
			this.object.geometry.vertices[index].x += info.speed.x;
			this.object.geometry.vertices[index].y += info.speed.y;
			this.object.geometry.vertices[index].z += info.speed.z;
		});

		// Update particles
		this.object.geometry.verticesNeedUpdate = true;
		this.object.geometry.computeBoundingSphere();
	}
}