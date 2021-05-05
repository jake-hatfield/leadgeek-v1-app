import { SET_ALERT, REMOVE_ALERT, TIMEOUT_ALERT } from '../actions/types';

const initialState = [];
export default function alertReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case SET_ALERT: {
			return [...state, payload];
		}
		case TIMEOUT_ALERT: {
			return state.filter((alert) => alert.id !== payload);
		}
		case REMOVE_ALERT: {
			const { id } = payload;
			return state.filter((alert) => alert.id !== id);
		}

		default:
			return state;
	}
}
