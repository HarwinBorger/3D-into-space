import * as THREE from 'three';
import Glow from "./textures/glow.png";


export default class Ufo {
	object = false;
	ufoGlow = false;

	constructor(ufoObject, lightColor = '#00ff52')
	{
		this.object = ufoObject;

		let light = new THREE.PointLight(lightColor,1,100,1);

		var ufoGlowMaterial = new THREE.SpriteMaterial(
			{
				map: new THREE.TextureLoader().load(Glow),
				color: lightColor,
				transparent: true,
				opacity: .3,
				blending: THREE.AdditiveBlending,
				depthWrite: false
			});


		// Set positions and size
		this.object.position.x = 1500;
		this.object.position.y = 300;
		this.object.scale.set(10,10,10);

		// Add lights
		light.position.set(0,0,-5);
		this.object.add(light);

		// Add glow
		this.ufoGlow = new THREE.Sprite(ufoGlowMaterial);
		this.ufoGlow.scale.set(5, 5, 1.0);
		this.ufoGlow.position.z = 1;
		this.object.add(this.ufoGlow); // this centers the glow at the mesh
	}

	update(time){
		let rotation =  Math.sin(time*0.5)*(Math.PI/360*30);
		this.object.rotation.x = (Math.PI/360*-160)-rotation;
		this.object.rotation.y = rotation*1.3;
	}
}