import {TOGGLE_AUTOPILOT} from "../actionTypes";

const initialState = {
	status: true
};

export default function (state = initialState, action) {
	switch (action.type) {
		case TOGGLE_AUTOPILOT: {
			return {
				...state,
				status: !state.status
			}
		}
		default:
			return state;
	}
}
