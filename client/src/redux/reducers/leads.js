import {
	GET_LEADS,
	VIEW_LEAD,
	HANDLE_LIKE_LEAD,
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
				liked: payload.likedLeads,
			};
		case GET_LEADS:
			return {
				...state,
				feed: payload.feedArray,
				unviewed: payload.unviewed,
				loading: false,
			};
		case VIEW_LEAD:
			const updatedNew = unviewed.filter((lead) => lead.id !== payload.id);
			let selectedLead = feed.find((lead) => lead.id === payload.id);
			return {
				...state,
				unviewed: updatedNew,
				loading: false,
			};
		case HANDLE_LIKE_LEAD:
			return {
				...state,
				liked: payload,
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
