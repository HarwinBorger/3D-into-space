import {SET_CAMERA} from "../actionTypes";

const initialState = {
	name: 'world'
};

export default function (state = initialState, action) {
	switch (action.type) {
		case SET_CAMERA: {
			return {
				...state,
				name: action.payload.camera
			}
		}
		default:
			return state;
	}
}
