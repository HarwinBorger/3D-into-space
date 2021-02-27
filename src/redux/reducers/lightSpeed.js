import {TOGGLE_LIGHTSPEED} from "../actionTypes";

const initialState = false;

export default function (state = initialState, action) {
	switch (action.type) {
		case TOGGLE_LIGHTSPEED: {
			return action.payload.auto;
		}
		default:
			return state;
	}
}
