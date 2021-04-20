import { GET_ALL_USERS, LOGOUT } from '../actions/types';

const initialState = {
	allUsers: [],
};
export default function userReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case GET_ALL_USERS:
			return { ...state, allUsers: payload };
		case LOGOUT: {
			return {
				...initialState,
			};
		}
		default:
			return state;
	}
}
