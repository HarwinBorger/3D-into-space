import * as THREE from 'three';
import {Scope, Objects} from "../Globals";
import Atmosphere from "./Atmosphere";
import {getRandomRange} from "../Services";
import SoundBalloon from './../sounds/sun.mp3';
import Glow from "../textures/glow.png";


export default class Balloon {
	object;

	constructor()
	{
		var self = this;
		this.light = new THREE.PointLight('#f90', 1, 5);
		const atmosphere = new Atmosphere(10);

		//glow
		var glowMaterial = new THREE.SpriteMaterial(
			{
				map: new THREE.TextureLoader().load(Glow),
				color: '#ff4300',
				transparent: true,
				opacity: .3,
				blending: THREE.AdditiveBlending,
				depthWrite: false
			});

		self.balloonGlow = new THREE.Sprite(glowMaterial);
		self.balloonGlow.scale.set(10, 10, 1.0);
		self.balloonGlow.position.z = 2.5;

		const object = Objects.balloon.clone();
		object.scale.set(0.5,0.5,0.5);
		object.position.y = 35;

		self.light.position.z = 12;
		object.add(self.light);

		atmosphere.position.z = 5;
		object.add(atmosphere);

		/**
		 * SOUNDS
		 */
			// create the PositionalAudio object (passing in the listener)
		var sound = new THREE.PositionalAudio( Scope.listener );
		// load a sound and set it as the PositionalAudio object's buffer
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load( SoundBalloon, function( buffer ) {
			sound.setBuffer( buffer );
			sound.setLoop( true );
			sound.setRefDistance( 5 );
			sound.setMaxDistance( 30 );
			sound.setVolume(0.5);
			sound.play();
		});

		object.add(sound);
		object.add(self.balloonGlow); // this centers the glow at the mesh

		// Write back to object;
		this.object = object;
	}

	update(time)
	{
		this.light.intensity = getRandomRange(0.5,1);

		let speed = .2;
		let value = (Math.sin(time * speed) * 15);
		this.balloonGlow.scale.set(value, value, 1);
//		this.object.lookAt(this.world.position);
	}
}