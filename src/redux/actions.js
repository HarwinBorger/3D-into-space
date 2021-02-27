import {SET_CAMERA, TOGGLE_AUTOPILOT, TOGGLE_LIGHTSPEED} from "./actionTypes";

export const toggleAutoPilot = auto => ({
	type: TOGGLE_AUTOPILOT,
	payload: {auto: auto}
});


export const toggleLightSpeed = auto => ({
	type: TOGGLE_LIGHTSPEED,
	payload: {auto: auto}
});

export const setCamera = camera => ({
	type: SET_CAMERA,
	payload: {camera: camera}
});