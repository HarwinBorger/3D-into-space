import * as THREE from 'three'
import Star from './textures/particle.png';

export default scene => {
	// create the particle variables
	var particleCount = 5000,
		particles = new THREE.Geometry();

	// create the particle variables
	var pMaterial = new THREE.PointsMaterial({
		color: '#bcf1ff',
		size: 300,
		map: new THREE.TextureLoader().load(Star),
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthWrite: false
	});// create the particle variables
	// also update the particle system to
// sort the particles which enables
// the behaviour we want

// now create the individual particles
	for (var p = 0; p < particleCount; p++) {

		// create a particle with random
		// position values, -250 -> 250
//		var theta = 2 * Math.PI * p;
//		var phi = Math.PI * p / 180;
//		var minMaxRange = getRandomArbitrary(-150, 150);
//
//		var pY = Math.cos(phi) * getRandomArbitrary(-150, 150);
//		var pX = Math.cos(theta) * Math.sin(phi) * minMaxRange * Math.cos(pY / 45);
//		var pZ = Math.cos(phi) * (minMaxRange - 150) * Math.cos(pY / 45);
		let r = getRandomArbitrary(20000, 100000);
		let a = getRandomArbitrary(0, 360);
		let x = r * Math.sin(p) * Math.cos(a);
		let y = r * Math.sin(p) * Math.sin(a);
		let z = r * Math.cos(p);

		var particle = new THREE.Vector3(x,y,z);

		// add it to the geometry
		particles.vertices.push(particle);
	}

// create the particle system
	var particleSystem = new THREE.Points(
		particles,
		pMaterial);

	particleSystem.sortParticles = true;

// add it to the scene
//	console.log(particleSystem);
	scene.add(particleSystem);

	/**
	 * Returns a random number between min (inclusive) and max (exclusive)
	 */
	function getRandomArbitrary(min, max)
	{
		return Math.random() * (max - min) + min;
	}

	function update(time)
	{
//		particleSystem.rotation.y += 0.0005;
	}

	return {
		update
	}
}