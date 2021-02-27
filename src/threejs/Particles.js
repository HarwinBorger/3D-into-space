import * as THREE from 'three';

export default scene => {
	var particleGroup = new THREE.Group();

	var particleCount = 100;

	for (var p = 0; p < particleCount; p++) {
		particleGroup.add(new CreateParticle('lightMoon'));
	}

	// Set all particles
	scene.add(particleGroup);

	function CreateParticle(reference){
		reference = scene.getObjectByName(reference);
		var geometry = new THREE.IcosahedronGeometry(.5, 1);
		var material = new THREE.MeshPhongMaterial(
			{
				color: "#000",
				flatShading: THREE.FlatShading,
				transparent: true,
				opacity: .5
			});

		let sphere = new THREE.Mesh(geometry, material);


		return sphere
	}

	var currentParticle = 0;

	function update(time)
	{
		var reference = scene.getObjectByName('lightMoon');

		// add some rotation to the system
		currentParticle ++;

		if(currentParticle >= particleGroup.children.length ){
			currentParticle = 0;
		}

		particleGroup.children.forEach(function(particle){
			particle.scale.x -= 0.01;
		});

		particleGroup.children[currentParticle].position.x = reference.position.x;
		particleGroup.children[currentParticle].position.y = reference.position.y;
		particleGroup.children[currentParticle].position.z = reference.position.z;
		particleGroup.children[currentParticle].scale.x = 1;

	}

	return {update}
}