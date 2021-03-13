import {
	GET_LEADS,
	GET_LIKED_LEADS,
	SET_CURRENT_LEAD,
	CLEAR_DETAILED_LEAD,
	SET_PAGE,
	LOGOUT,
	USER_LOADED,
	GET_ARCHIVED_LEADS,
	LOADING,
	FINISHED_LOADING,
	HANDLE_LIKE_LEAD,
} from '../actions/types';

const initialState = {
	feed: [],
	liked: [],
	archived: [],
	pagination: {
		page: 1,
		hasNextPage: null,
		hasPreviousPage: false,
		nextPage: null,
		previousPage: null,
		lastPage: null,
	},
	lastActive: null,
	currentLead: null,
	loading: true,
};

export default function (state = initialState, action) {
	const { liked } = state;
	const { type, payload } = action;
	switch (type) {
		case USER_LOADED:
			return {
				...state,
				lastActive: payload.lastLoggedIn,
				loading: false,
			};
		case GET_LEADS:
			const {
				feed,
				page,
				hasNextPage,
				hasPreviousPage,
				nextPage,
				previousPage,
				lastPage,
			} = payload.data;
			return {
				...state,
				feed,
				pagination: {
					...state.pagination,
					page,
					hasNextPage,
					hasPreviousPage,
					nextPage,
					previousPage,
					lastPage,
				},
			};
		case GET_LIKED_LEADS:
			return { ...state, liked: payload };
		case HANDLE_LIKE_LEAD:
			const newLiked = liked.filter((lead) => lead._id !== payload.leadId);
			return {
				...state,
				liked: newLiked,
			};
		case GET_ARCHIVED_LEADS:
			return { ...state, archived: payload };
		case SET_CURRENT_LEAD:
			return {
				...state,
				currentLead: payload,
			};
		case CLEAR_DETAILED_LEAD:
			return {
				...state,
				currentLead: null,
				loading: false,
			};
		case SET_PAGE:
			return {
				...state,
				pagination: { ...state.pagination, page: payload },
			};
		case LOGOUT:
			return {
				...initialState,
			};
		case LOADING:
			return {
				...state,
				loading: true,
			};
		case FINISHED_LOADING:
			return {
				...state,
				loading: false,
			};

		default:
			return {
				...state,
			};
	}
}
