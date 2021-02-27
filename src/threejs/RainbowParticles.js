import * as THREE from 'three';
import {getRandomInt, getRandomRange, loop} from "./Services";
import {Shaders} from "./Globals";
// Textures
import TwinkleTexture from './textures/twinkle.png';


export default class RainbowParticles{
	object;
	particlesObject;
	/* particle settings*/
	particleCount = 250;
	vShader;
	fShader;

	rainbowParticles = [
		{color: '#ffd0f3'},
		{color: '#d9b3ff'},
		{color: '#a297ff'},
		{color: '#bdffb7'},
		{color: '#fff3a0'},
		{color: '#ffd49e'},
		{color: '#ffb9ba'}
	];

	particleMaterials = [];

	constructor(radius, particleCount = 250, size=1, height=1.5, width=1){
		this.radius = radius;
		this.size = size;
		this.height = height;
		this.width = width;
		this.particleCount = particleCount;

		this.rainbowParticles.forEach((stripe) => {
			// Create material for particles
			this.particleMaterials.push(this.createParticleMaterial(stripe.color));
		});

		this.object = this.createRainbowParticles();
	}


	/**
	 * Create Particle Material
	 * @param color
	 * @returns {PointsMaterial}
	 */
	createParticleMaterial = function (color) {
		return new THREE.PointsMaterial({
			color: color,
			size: this.size,
			map: new THREE.TextureLoader().load(TwinkleTexture),
			blending: THREE.AdditiveBlending,
			transparent: true,
			depthWrite: false
		});// create the particle variables;
	};

	/**
	 *
	 * @returns {Points}
	 */
	createRainbowParticles()
	{
		const PARTICLE_SIZE = this.size;
		var positions = new Float32Array(this.particleCount * 3);
		var colors = new Float32Array(this.particleCount * 3);
		var sizes = new Float32Array(this.particleCount);
		var opacity = new Float32Array(this.particleCount);

		var vertex;
		var color = new THREE.Color();

		/* NEW WAY*/
		// create the particle variables
		// now create the individual particles
		let sizeMin = this.radius - this.width;
		let sizeMax = this.radius + this.width*4;

		loop(this.particleCount)((i) => {
			let r = getRandomRange(sizeMin, sizeMax);
			let rW = getRandomRange(0-this.height, this.height);
			let a = getRandomRange(0, 180);

			let angle = Math.PI * (360 / a);

			let x = r * Math.cos(angle);
			let y = r * Math.sin(angle);
			let z = rW;


			let randomColor = getRandomInt(0, this.rainbowParticles.length);

			vertex = new THREE.Vector3(x, y, z);
			vertex.toArray(positions, i * 3);
			color.set(this.rainbowParticles[randomColor].color);
			color.toArray(colors, i * 3);
			sizes[i] = PARTICLE_SIZE;
			opacity[i] = getRandomRange(0,1);
		});

		var geometry = new THREE.BufferGeometry();
		geometry.addAttribute('position', new THREE.BufferAttribute(positions, 3));
		geometry.addAttribute('customColor', new THREE.BufferAttribute(colors, 3));
		geometry.addAttribute('size', new THREE.BufferAttribute(sizes, 1));
		geometry.addAttribute('opacity', new THREE.BufferAttribute(sizes, 1));
		//
		let vShader = Shaders.rainbow.vShader;
		let fShader = Shaders.rainbow.fShader;

		var material = new THREE.ShaderMaterial({
			uniforms: {
				color: {value: new THREE.Color(0xffffff)},
				pointTexture: {value: new THREE.TextureLoader().load(TwinkleTexture)}
			},
			blending: THREE.AdditiveBlending,
			transparent: true,
			opacity: 1,
			depthWrite: false,
			vertexShader: vShader,
			fragmentShader: fShader,
			alphaTest: 0.9
		});
		//
		let particles = new THREE.Points(geometry, material);
		return particles;
	}

	/**
	 * Update
	 * @param time
	 */
	update(time)
	{
		if (this.object) {
			var geometry = this.object.geometry;
			var attributes = geometry.attributes;
			for (var i = 0; i < attributes.size.array.length; i++) {
				attributes.size.array[i] = (this.size/2) + (this.size*2) * Math.sin(0.11 * i + time);
			}

			attributes.size.needsUpdate = true;
		}
	}
}