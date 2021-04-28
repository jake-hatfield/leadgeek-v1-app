import {
	GET_ALL_USERS,
	SET_PAGE,
	LOADING,
	FINISHED_LOADING,
	LOGOUT,
} from '../actions/types';

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
		case SET_PAGE: {
			const { type } = payload;
			switch (type) {
				case 'users': {
					return {
						...state,
						pagination: { ...state.pagination, page: payload.page },
					};
				}
				default: {
					return {
						...state,
					};
				}
			}
		}
		case LOADING: {
			return {
				...state,
				loading: true,
			};
		}
		case FINISHED_LOADING: {
			return {
				...state,
				loading: false,
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
