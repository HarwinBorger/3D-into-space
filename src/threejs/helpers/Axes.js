import * as THREE from "three";

/***** HELPERS *****/
export default scene => {

	scene.add(BuildAxes());

	function BuildAxes()
	{
		var axes = new THREE.Object3D();

		axes.add(BuildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(20000, 0, 0), 0xFF0000, false)); // +X
		axes.add(BuildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-20000, 0, 0), 0x800000, true)); // -X
		axes.add(BuildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 20000, 0), 0x00FF00, false)); // +Y
		axes.add(BuildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -20000, 0), 0x008000, true)); // -Y
		axes.add(BuildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 20000), 0x0000FF, false)); // +Z
		axes.add(BuildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -20000), 0x000080, true)); // -Z

		return axes;
	}

	function BuildAxis(src, dst, colorHex, dashed)
	{
		var geom = new THREE.Geometry(),
			mat;

		if (dashed) {
			mat = new THREE.LineDashedMaterial({linewidth: 1, color: colorHex, dashSize: 5, gapSize: 5});
		} else {
			mat = new THREE.LineBasicMaterial({linewidth: 1, color: colorHex});
		}

		geom.vertices.push(src.clone());
		geom.vertices.push(dst.clone());

		var axis = new THREE.Line(geom, mat);

		return axis;

	}

	function update(){

	}

	return {update};
}
