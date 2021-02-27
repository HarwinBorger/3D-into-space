import * as THREE from 'three';
import {manipulateIcosahedron} from '../Services';
import Atmosphere from "./Atmosphere";
import SoundMoon from './../sounds/moon.mp3';
import Glow from "../textures/glow.png";

export default class Moon {
	constructor(color = '#fff', size = 2, listener)
	{
		const lightMoon = new THREE.PointLight(color, 1, 100,2);

		var geometry = new THREE.IcosahedronGeometry(size, 3);

		// manipulate geometry
		geometry = manipulateIcosahedron(geometry, -.2,.2);
		
		var material = new THREE.MeshPhysicalMaterial(
			{color: "#cdf0ff", flatShading: THREE.FlatShading});

		this.object = new THREE.Mesh(geometry, material);
		this.object.add(new Atmosphere(size + (size*0.2)));
		this.object.add(lightMoon);

		var glowMaterial1 = new THREE.SpriteMaterial(
			{
				map: new THREE.TextureLoader().load(Glow),
				color: '#87dbff',
				transparent: true,
				opacity: .05,
				blending: THREE.AdditiveBlending,
				depthWrite: false
			});

		var moonGlow = new THREE.Sprite(glowMaterial1);
		moonGlow.scale.set(50, 50, 1.0);
		this.object.add(moonGlow); // this centers the glow at the mesh

		this.speed = 0.1;
		/**
		 * SOUNDS
		 */
		// create the PositionalAudio object (passing in the listener)
		var sound = new THREE.PositionalAudio( listener );
		// load a sound and set it as the PositionalAudio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( SoundMoon, function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setRefDistance( 10 );
			sound.setMaxDistance( 20 );
			sound.setVolume(0.5);
			sound.startTime = Math.random()*10;
			sound.play();
		});

		this.object.add(sound);
	}

	update(time)
	{
//		this.rocks.update(time);
	}
}