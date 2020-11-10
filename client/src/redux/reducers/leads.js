import {
	GET_LEADS,
	VIEW_LEAD,
	LIKE_LEAD,
	UNLIKE_LEAD,
	ARCHIVE_LEAD,
	UNARCHIVE_LEAD,
	SHOW_DETAILED_LEAD,
	CLEAR_DETAILED_LEAD,
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
	const { feed, unviewed, liked, archived, currentLead, loading } = state;
	const alreadyLiked = liked.find((lead) =>
		lead.id === payload.id ? true : false
	);
	switch (type) {
		case GET_LEADS:
			return {
				...state,
				feed: payload.feed,
				unviewed: payload.unviewed,
				loading: false,
			};
		case VIEW_LEAD:
			const updatedNew = unviewed.filter((lead) => lead.id !== payload.id);
			let selectedLead = feed.find((lead) => lead.id === payload.id);
			selectedLead.viewed = true;
			return {
				...state,
				unviewed: updatedNew,
				loading: false,
			};
		case LIKE_LEAD:
			const leadIndex = feed.findIndex((lead) => lead.id === payload.id);
			let newLikedArray = [...feed];
			newLikedArray[leadIndex] = {
				...newLikedArray[leadIndex],
				liked: !newLikedArray[leadIndex].feed,
			};
			return {
				...state,
				liked: alreadyLiked ? [...liked] : [...liked, newLikedArray[leadIndex]],
				loading: false,
			};
		case UNLIKE_LEAD:
			return {
				...state,
				liked: liked.filter((lead) => lead.id !== payload.id),
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
				currentLead: feed.filter((lead) => lead.id === payload.id).pop(),
				loading: false,
			};
		case CLEAR_DETAILED_LEAD:
			return {
				...state,
				currentLead: null,
				loading: false,
			};
		default:
			return {
				...state,
			};
	}
}
