// ThreeJS
import * as THREE from 'three';
// Redux
import {getCamera} from "../redux/selectors";
import store from "../redux/store";

// Globals
import {Scope, Shaders, Objects} from './Globals';

// Controls
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {BalloonControls} from "./controls/BalloonControls"
//import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js';

// Helpers
import Axes from './helpers/Axes';

// Internal models
import SolarSystem from './SolarSystem';
import Stars from './Stars';
import GeneralLights from './GeneralLights';

// External shaders
import FShader from "./shaders/rainbow/shader.frag";
import VShader from "./shaders/rainbow/shader.vert";

// External model loader
import {ColladaLoader} from "three/examples/jsm/loaders/ColladaLoader";
// External models
import TreeObjectUrl from './models/treeEpic.dae';
import CloudObject1Url from './models/cloud-v2.dae';
import CloudObject2Url from './models/cloud-1.dae';
import DinosaurObjectUrl from "./models/dinosaur.dae";
import BalloonObjectUrl from './models/air-balloon-v2.dae';
import UfoObjectUrl from "./models/ufo.dae";

export default class sceneManager {
	objectUrls = {
		'tree': TreeObjectUrl,
		'cloud1': CloudObject1Url,
		'cloud2': CloudObject2Url,
		'dinosaur': DinosaurObjectUrl,
		'balloon': BalloonObjectUrl,
		'ufo': UfoObjectUrl,
	};

	loadingManager;
	cameras = {};

	constructor()
	{
		this.canvas = Scope.canvas;
		this.clock = new THREE.Clock();
		this.origin = new THREE.Vector3(0, 0, 0);

		this.screenDimensions = {
			width: this.canvas.width,
			height: this.canvas.height
		};

		this.mousePosition = {
			x: 0,
			y: 0
		};

		/* Setup Scope.scene */
		Scope.scene = this.buildScene();

		/* Setup Renderer */
		this.renderer = this.buildRender(this.screenDimensions);

		/* Setup Listener */
		Scope.listener = new THREE.AudioListener(); 	// create an AudioListener and add it to the camera

		this.setupCameras();

		this.setupControls();

		this.setupLoadingManager();
		this.loadObjects();

		this.setDefaultCamera();
	}

	setupCameras()
	{
		/* Setup Camera */
		Scope.cameras.world = this.buildCamera(10, 150000, 50);
		Scope.cameras.ufo = this.buildCamera();
		Scope.cameras.ufo.position.set(1500, 1500, 1500);
		Scope.cameras.balloon = this.buildCamera(.1, 50000, 90);
		Scope.cameras.tree = this.buildCamera(.01, 50000, 120);

		Scope.scene.add(Scope.cameras.world);
		Scope.scene.add(Scope.cameras.ufo);
//		Scope.scene.add(Scope.cameras.balloon);
		// Set default camera
		this.camera = Scope.cameras.world;
		this.camera.add(Scope.listener);
	}

	setupControls()
	{
		let controls = {};
		controls.world = this.addControls(Scope.cameras.world);
		controls.ufo = this.addControls(Scope.cameras.ufo);
		controls.balloon = this.addBalloonControls(Scope.cameras.balloon);
		controls.tree = this.addBalloonControls(Scope.cameras.tree);
		// Set global controls
		this.controls = controls;
	}

	setupLoadingManager()
	{
		/* Setup this.scene objects */
		this.loadingManager = new THREE.LoadingManager;

		this.loadingManager.onLoad = () => {
			console.log('Loading complete!');
			// actions
			this.sceneSubjects = this.createSceneSubjects();
		};

		this.loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
//			console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
			console.log('Loading object ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
		};

		this.loadingManager.onError = function (url) {
			console.log('There was an error loading ' + url);
		};
	}

	loadObjects()
	{
		// Setup loaders
		let fileLoader = new THREE.FileLoader(this.loadingManager);
		let colladaLoader = new ColladaLoader(this.loadingManager);

		// Loop through objects url and load them to global Objects variable
		Object.keys(this.objectUrls).forEach(key=>{
			colladaLoader.load(this.objectUrls[key], (collada) => {
				Objects[key] = collada.scene; // Write back to global
			});
		});

		// Load shaders
		fileLoader.load(FShader, (data) => {
			Shaders.rainbow.fShader = data;
		});
		fileLoader.load(VShader, (data) => {
			Shaders.rainbow.vShader = data;
		});
	}

	/**
	 * Set Default camera
	 */
	setDefaultCamera()
	{
		this.switchCamera("world");
	}

	/**
	 * Switch camera
	 * @param name
	 */
	switchCamera(name = "world")
	{
		// Switch camera
		this.camera = Scope.cameras[name];
		//Reset audio
		this.camera.add(Scope.listener);
		// Reset view
		this.onWindowResize();

		// Set correct controls
		this.controls.world.enabled = false;
		this.controls.ufo.enabled = false;
		this.controls.balloon.dispose();
		this.controls.tree.dispose();


		if (name === 'balloon') {
			this.controls.balloon = this.addBalloonControls(Scope.cameras.balloon);
		} else if (name === 'tree') {
			this.controls.tree = this.addBalloonControls(Scope.cameras.tree);
		} else {
			this.controls[name].enabled = true;
		}
	}

	addControls(camera)
	{
		let controls = new OrbitControls(camera, this.renderer.domElement);
		controls.zoomSpeed = 0.5;
		controls.minDistance = 30;
		controls.maxDistance = 200000;
		controls.keys = {
			LEFT: 37, //left arrow
			UP: 38, // up arrow
			RIGHT: 39, // right arrow
			BOTTOM: 40 // down arrow
		};

		return controls;
	}

	addBalloonControls(camera)
	{
		let controls = new BalloonControls(camera, this.renderer.domElement);
		controls.movementSpeed = .1;
		controls.rollSpeed = Math.PI / 24;
		controls.autoForward = false;
		controls.dragToLook = false;

		return controls;
	}

	buildScene()
	{
		const scene = new THREE.Scene();
		scene.background = new THREE.Color("#000");

		return scene;
	}

	buildRender({width, height})
	{
		const renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true, alpha: true});

		const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
		renderer.setPixelRatio(DPR);
		renderer.setSize(width, height);

		renderer.gammaInput = true;
		renderer.gammaOutput = true;

		return renderer;
	}

	buildCamera(near = 10, far = 50000, fieldOfView = 50)
	{
		let {width, height} = this.screenDimensions;
		const aspectRatio = width / height;

		return new THREE.PerspectiveCamera(fieldOfView, aspectRatio, near, far);
	}

	createSceneSubjects()
	{
		const sceneSubjects = [
			new GeneralLights(Scope.scene),
			new SolarSystem(Scope.scene, Scope.cameras, this.renderer, this.controls, Scope.listener),
			new Stars(Scope.scene),
//			new Axes(this.scene),
		];

		return sceneSubjects;
	}

	update()
	{
		const elapsedTime = this.clock.getElapsedTime();

		// When sceneObjects are ready
		if (this.sceneSubjects) {
			for (let i = 0; i < this.sceneSubjects.length; i++) {
				this.sceneSubjects[i].update(elapsedTime);
			}
		}

		this.renderer.render(Scope.scene, this.camera);

		// If balloon camera is active
		if (getCamera(store.getState()).name === 'balloon') {
			this.controls.balloon.update(0.05);
		}

		// If balloon camera is active
		if (getCamera(store.getState()).name === 'tree') {
			this.controls.tree.update(0.05);
		}

//		console.log(`triangles: ${this.renderer.info.render.triangles}, lines: ${this.renderer.info.render.lines}`);
	}


	onWindowResize()
	{
		const {width, height} = this.canvas;

		this.screenDimensions.width = width;
		this.screenDimensions.height = height;

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(width, height);
	}

	onMouseMove(x, y)
	{
		this.mousePosition.x = x;
		this.mousePosition.y = y;
	}
}