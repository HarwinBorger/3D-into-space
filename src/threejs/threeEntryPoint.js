import SceneManager from './SceneManager';
import store from "../redux/store";
import {Scope} from './Globals';

export default container => {
	Scope.canvas = createCanvas(document, container);

	const sceneManager = new SceneManager();

	let canvasHalfWidth;
	let canvasHalfHeight;

	bindEventListeners();
	render();

	// Camera actions
	let currentCamera = 'default';
	store.subscribe(switchCamera);

	function switchCamera(){
		// Todo add https://github.com/ReactiveX/RxJS and https://github.com/redux-observable/redux-observable for specific state observations
		let newCamera = store.getState().camera.name;
		if(currentCamera!==newCamera){
			sceneManager.switchCamera(newCamera);
			currentCamera = newCamera;
		}
	}

	function createCanvas(document, container)
	{
		const canvas = document.createElement('canvas');
		container.appendChild(canvas);
		return canvas;
	}

	function bindEventListeners()
	{
		window.onresize = resizeCanvas;
		window.onmousemove = mouseMove;
		resizeCanvas();
	}

	function resizeCanvas()
	{
		Scope.canvas.style.width = '100%';
		Scope.canvas.style.height = '100%';

		Scope.canvas.width = Scope.canvas.offsetWidth;
		Scope.canvas.height = Scope.canvas.offsetHeight;

		canvasHalfWidth = Math.round(Scope.canvas.offsetWidth / 2);
		canvasHalfHeight = Math.round(Scope.canvas.offsetHeight / 2);

		sceneManager.onWindowResize()
	}

	function mouseMove({screenX, screenY})
	{
		sceneManager.onMouseMove(screenX - canvasHalfWidth, screenY - canvasHalfHeight);
	}

	function render(time)
	{
		requestAnimationFrame(render);
		sceneManager.update();
	}
}