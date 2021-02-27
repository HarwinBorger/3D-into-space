import * as THREE from 'three';

export default class Atmosphere {
	constructor(radius, color ='#fff')
	{
		var geometry = new THREE.SphereGeometry(radius, 24,24);
		var material = new THREE.MeshPhongMaterial({
			color: color,
			vertexColors: THREE.VertexColors,
			transparent: true,
			opacity: .05,
			depthWrite: false
		});

		this.object = new THREE.Mesh(geometry, material);

		return this.object;
	}

	update(time)
	{
	}
}