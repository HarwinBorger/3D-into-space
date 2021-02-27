import * as THREE from 'three';


export default class Cloud {
	constructor(color = '#fff', size = 3)
	{
		var geometry = new THREE.SphereGeometry( 1, 16, 16 );
		var material = new THREE.MeshPhongMaterial({
			color: "#fff",
			transparent: true,
			opacity: .3
		});

		this.object = new THREE.Mesh(geometry, material);
		this.object.scale.z = 0.2;
		this.object.scale.y = 2;
	}

	update(time)
	{

	}
}