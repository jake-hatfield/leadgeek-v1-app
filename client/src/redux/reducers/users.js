import { GET_ALL_USERS, LOGOUT } from '../actions/types';

const initialState = {
	allUsers: [],
	loading: false,
	pagination: {
		page: 1,
		hasNextPage: null,
		hasPreviousPage: false,
		nextPage: null,
		previousPage: null,
		lastPage: null,
		totalItems: null,
	},
};
export default function userReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case GET_ALL_USERS: {
			const {
				users,
				page,
				hasNextPage,
				hasPreviousPage,
				nextPage,
				previousPage,
				totalItems,
			} = payload.data;
			return {
				...state,
				allUsers: users,
				loading: false,
				pagination: {
					page,
					hasNextPage,
					hasPreviousPage,
					nextPage,
					previousPage,
					totalItems,
				},
			};
		}
		case LOGOUT: {
			return {
				...initialState,
			};
		}
		default:
			return state;
	}
}
