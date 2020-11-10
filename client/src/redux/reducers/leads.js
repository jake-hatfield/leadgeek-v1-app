import {
	GET_LEADS,
	REMOVE_LEADS,
	LIKE_LEAD,
	SET_LIKE,
	UNLIKE_LEAD,
	ARCHIVE_LEAD,
	UNARCHIVE_LEAD,
	SHOW_DETAILED_LEAD,
	CLEAR_DETAILED_LEAD,
} from '../actions/types';

const initialState = {
	feed: [],
	new: [],
	liked: [],
	archived: [],
	currentLead: null,
	loading: true,
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	const alreadyLiked = state.liked.find((lead) =>
		lead.id === payload.id ? true : false
	);
	switch (type) {
		case GET_LEADS:
			return {
				...state,
				feed: payload,
				loading: false,
			};
		case LIKE_LEAD:
			// get lead from the feed array
			const likedLead = state.feed.find((lead) => lead.id === payload.id);
			return {
				...state,
				liked: [...state.liked, likedLead],
				loading: false,
			};
		case SET_LIKE:
			const leadIndex = state.feed.findIndex((lead) => lead.id === payload.id);
			let newLikedArray = [...state.feed];
			newLikedArray[leadIndex] = {
				...newLikedArray[leadIndex],
				liked: !newLikedArray[leadIndex].feed,
			};
			return {
				...state,
				liked: alreadyLiked
					? [...state.liked]
					: [...state.liked, newLikedArray[leadIndex]],
				loading: false,
			};
		case UNLIKE_LEAD:
			// const alreadyLiked = state.liked.find((lead) =>
			// 	lead.id === payload.id ? true : false
			// );
			return {
				...state,
				liked: state.liked.filter((lead) => lead.id !== payload.id),
				loading: false,
			};
		case ARCHIVE_LEAD:
			const alreadyArchived = state.archived.find((lead) =>
				lead.id === payload.id ? true : false
			);
			return {
				...state,
				liked:
					!alreadyArchived &&
					state.archived.filter((lead) => lead.id !== payload.id),
				loading: false,
			};
		case REMOVE_LEADS:
			return {
				...state,
				feed: [],
				loading: false,
			};
		case SHOW_DETAILED_LEAD:
			return {
				...state,
				currentLead: state.feed.filter((lead) => lead.id === payload.id).pop(),
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
