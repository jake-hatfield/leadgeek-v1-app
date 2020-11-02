import { GET_LEADS, REMOVE_LEADS } from '../actions/types';

const initialState = {
	leads: [],
	loading: true,
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case GET_LEADS:
			return {
				...state,
				leads: payload,
				loading: false,
			};
		case REMOVE_LEADS:
			return {
				...state,
				leads: [],
				loading: false,
			};
		default:
			return {
				...state,
			};
	}
}
