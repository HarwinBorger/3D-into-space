import * as THREE from 'three';
import {manipulateIcosahedron} from './Services';
import Atmosphere from "./world/Atmosphere";
import Glow from "./textures/glow.png";

export default class Planet {
	constructor(color = '#61150a', size = 30)
	{
		var geometry = new THREE.IcosahedronGeometry(size, 3);

		// manipulate geometry
		geometry = manipulateIcosahedron(geometry, -.5,.5);
		
		var material = new THREE.MeshPhysicalMaterial(
			{color: color,flatShading: THREE.FlatShading});

		this.object = new THREE.Mesh(geometry, material);
		this.object.add(new Atmosphere(size + (size*0.5),'#ff5a00'));

		var glowMaterial = new THREE.SpriteMaterial(
			{
				map: new THREE.TextureLoader().load(Glow),
				color: '#ff6b00',
				transparent: true,
				opacity: .1,
				blending: THREE.AdditiveBlending,
				depthWrite: false
			});

		var planetGlow = new THREE.Sprite(glowMaterial);
		planetGlow.scale.set(size*5, size*5, 1.0);

		this.object.add(planetGlow); // this centers the glow at the mesh
	}

	update(time)
	{
//		this.rocks.update(time);
	}
}