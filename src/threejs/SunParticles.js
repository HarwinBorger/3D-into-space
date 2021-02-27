import * as THREE from 'three'
import ParticleTexture from './textures/particle.png';
import {getRandomRange} from "./Services";

export default class SunParticles {
	constructor(sizeMin = 8, sizeMax = 10)
	{
		var particleCount = 1000,
			particles = new THREE.Geometry();

		// create the particle variables
		var pMaterial = new THREE.PointsMaterial({
			color: '#ff592b',
			size: 10,
			map: new THREE.TextureLoader().load(ParticleTexture),
			blending: THREE.AdditiveBlending,
			transparent: true,
			depthWrite: false
		});// create the particle variables

		// now create the individual particles
		for (var p = 0; p < particleCount; p++) {
			let r = getRandomRange(sizeMin, sizeMax);
			let a = getRandomRange(0, 360);

			let x = r * Math.cos(a);
			let y = getRandomRange(-100, 100);
			let z = r * Math.sin(a);

			var particle = new THREE.Vector3(x, y, z);

			// add it to the geometry
			particles.vertices.push(particle);
		}

		// create the particle system
		var particleSystem = new THREE.Points(
			particles,
			pMaterial);

		particleSystem.sortParticles = true;

		this.particles = particleSystem;
	}

	getObject()
	{
		return this.particles;
	}

	update(time)
	{
		this.particles.rotation.y += 0.0001;
		var scale = 1 + Math.sin(time / 7) / 10;
		this.particles.scale.set(scale, scale, scale);
	}
}