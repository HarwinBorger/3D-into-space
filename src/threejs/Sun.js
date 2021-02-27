import * as THREE from 'three';
import Glow from "./textures/glow.png";


export default class Sun {
	constructor()
	{
		this.object = false;

		const sun = new THREE.Group();
		// Glow of sun
		// SUPER SIMPLE GLOW EFFECT
		// use sprite because it appears the same from all angles
		var glowMaterial1 = new THREE.SpriteMaterial(
			{
				map: new THREE.TextureLoader().load(Glow),
				color: '#f90',
				transparent: true,
				opacity: .5,
				blending: THREE.AdditiveBlending,
			});
		var glowMaterial2 = new THREE.SpriteMaterial(
			{
				map: new THREE.TextureLoader().load(Glow),
				color: '#f90',
				transparent: true,
				opacity: .3,
				blending: THREE.AdditiveBlending,
			});
		var glowMaterial3 = new THREE.SpriteMaterial(
			{
				map: new THREE.TextureLoader().load(Glow),
				color: '#ffe4a2',
				transparent: true,
				opacity: 1,
				blending: THREE.AdditiveBlending,
			});
		var glowMaterial4 = new THREE.SpriteMaterial(
			{
				map: new THREE.TextureLoader().load(Glow),
				color: '#ff5600',
				transparent: true,
				opacity: .2,
				blending: THREE.AdditiveBlending,
				depthWrite: false
			});

		var glowMaterial5 = new THREE.SpriteMaterial(
			{
				map: new THREE.TextureLoader().load(Glow),
				color: '#ff7200',
				transparent: true,
				opacity: .2,
				blending: THREE.AdditiveBlending,
				depthWrite: false
			});
		var sunGlow = new THREE.Sprite(glowMaterial3);
		sunGlow.scale.set(250, 250, 1.0);
		sun.add(sunGlow); // this centers the glow at the mesh

		var sunGlow1 = new THREE.Sprite(glowMaterial1);
		sunGlow.scale.set(250, 250, 1.0);
		sun.add(sunGlow1); // this centers the glow at the mesh
		var sunGlow2 = new THREE.Sprite(glowMaterial2);
		sunGlow2.scale.set(500, 500, 1.0);
		sun.add(sunGlow2); // this centers the glow at the mesh
		var sunGlow3 = new THREE.Sprite(glowMaterial2);
		sunGlow3.scale.set(750, 750, 1.0);
		sun.add(sunGlow3); // this centers the glow at the mesh
		this.sunGlow4 = new THREE.Sprite(glowMaterial4);
		this.sunGlow4.scale.set(1500, 1500, 1.0);
		sun.add(this.sunGlow4); // this centers the glow at the mesh

		this.sunGlow5 = new THREE.Sprite(glowMaterial5);
		this.sunGlow5.scale.set(250, 250, 1);
		sun.add(this.sunGlow5); // this centers the glow at the mesh

		this.object = sun;
	}

	update(time)
	{
		let speed = .2;
		let value = (Math.sin(time * speed) * 1000);
		this.sunGlow5.scale.set(value, value, 1);
		speed = .3;
		value = (Math.sin(time * speed) * 1000)+3000;
		this.sunGlow4.scale.set(value, value, 1);
	}
}