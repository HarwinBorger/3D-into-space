import * as THREE from 'three';
import RainbowParticles from '../RainbowParticles';

export default class Rainbow {
	object; // contains rainbowObject

	rainbowStripes = [
		{color: '#ee82ee', opacity: 0.10},
		{color: '#4b0082', opacity: 0.15},
		{color: '#0000ff', opacity: 0.20},
		{color: '#008000', opacity: 0.25},
		{color: '#ffff00', opacity: 0.30},
		{color: '#ffa500', opacity: 0.25},
		{color: '#ff0000', opacity: 0.20}
	];

	constructor(size=11)
	{
		let rainbowObject = new THREE.Group();

		this.size = size;

		// Loop through rainbow colors
		this.rainbowStripes.forEach((stripe) => {
			// Create rainbow stripes
			rainbowObject.add(this.createRainbowColor(size, stripe.color, stripe.opacity));
			size += 0.5;
		});

		// Write rainbowObject to global
		this.object = rainbowObject;
		this.rainbowParticles = new RainbowParticles(this.size,350);

		// Get particles
		this.object.add(this.rainbowParticles.object);
	}

	/**
	 * Create Rainbow Color
	 * @param inner
	 * @param color
	 * @param opacity
	 * @returns {Mesh}
	 */
	createRainbowColor = function (inner, color, opacity) {
		opacity = opacity * .7;
		var geometry = new THREE.TorusGeometry(inner, .5, 6, 64);
		var material = new THREE.MeshBasicMaterial({
			color: color,
			transparent: true,
			opacity: opacity,
			depthWrite: true,
		});

		return new THREE.Mesh(geometry, material);
	};

	/**
	 * Update
	 * @param time
	 */
	update(time)
	{
		this.rainbowParticles.update(time);
		this.rainbowParticles.object.rotation.z -= 0.0015;
	}
}