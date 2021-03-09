import {
	GET_LEADS,
	GET_LIKED_LEADS,
	VIEW_LEAD,
	ARCHIVE_LEAD,
	SHOW_DETAILED_LEAD,
	CLEAR_DETAILED_LEAD,
	LOGOUT,
	USER_LOADED,
} from '../actions/types';

const initialState = {
	feed: [],
	unviewed: [],
	liked: [],
	archived: [],
	lastActive: null,
	currentLead: null,
	loading: true,
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	const { feed, unviewed, liked, archived } = state;
	const likedLeads = [];
	switch (type) {
		case USER_LOADED:
			return {
				...state,
				lastActive: payload.lastLoggedIn,
			};
		case GET_LEADS:
			return {
				...state,
				feed: payload.feedArray,
				unviewed: payload.unviewed,
				loading: false,
			};
		case GET_LIKED_LEADS:
			return { ...state, liked: payload, loading: false };
		case VIEW_LEAD:
			const newUnviewedArray = unviewed.filter(
				(lead) => lead._id !== payload.id
			);
			return {
				...state,
				unviewed: newUnviewedArray,
				loading: false,
			};
		case ARCHIVE_LEAD:
			const alreadyArchived = archived.find((lead) =>
				lead.id === payload.id ? true : false
			);
			return {
				...state,
				liked:
					!alreadyArchived && archived.filter((lead) => lead.id !== payload.id),
				loading: false,
			};
		case SHOW_DETAILED_LEAD:
			return {
				...state,
				currentLead: feed.filter((lead) => lead._id === payload.id)[0],
				loading: false,
			};
		case CLEAR_DETAILED_LEAD:
			return {
				...state,
				currentLead: null,
				loading: false,
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
