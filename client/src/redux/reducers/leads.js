import {
	GET_LEADS,
	GET_LIKED_LEADS,
	VIEW_LEAD,
	SHOW_DETAILED_LEAD,
	CLEAR_DETAILED_LEAD,
	SET_PAGE,
	LOGOUT,
	USER_LOADED,
	GET_ARCHIVED_LEADS,
} from '../actions/types';

const initialState = {
	active: [],
	feed: [],
	unviewed: [],
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
	const { type, payload } = action;
	const { feed, unviewed, liked, archived } = state;
	switch (type) {
		case USER_LOADED:
			return {
				...state,
				lastActive: payload.lastLoggedIn,
			};
		case GET_LEADS:
			const {
				feed,
				unviewedLeads,
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
				unviewed: unviewedLeads,
				pagination: {
					...state.pagination,
					page,
					hasNextPage,
					hasPreviousPage,
					nextPage,
					previousPage,
					lastPage,
				},
				loading: false,
			};
		case GET_LIKED_LEADS:
			return { ...state, liked: payload, loading: false };
		case GET_ARCHIVED_LEADS:
			return { ...state, archived: payload, loading: false };
		case VIEW_LEAD:
			const newUnviewedArray = unviewed.filter(
				(lead) => lead._id !== payload.id
			);
			return {
				...state,
				unviewed: newUnviewedArray,
				loading: false,
			};
		case SHOW_DETAILED_LEAD:
			let arrayType;
			const { array, id } = payload;
			if (array === '') {
				arrayType = feed;
			} else if (array === 'leads') {
				arrayType = liked;
			} else {
				arrayType = archived;
			}
			return {
				...state,
				currentLead: arrayType.filter((lead) => lead._id === id)[0],
				loading: false,
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
				feed: [],
				unviewed: [],
				liked: [],
				archived: [],
				currentLead: null,
				loading: true,
			};
		default:
			return {
				...state,
			};
	}
}
