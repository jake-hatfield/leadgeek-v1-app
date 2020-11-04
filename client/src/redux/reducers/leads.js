import {
	GET_LEADS,
	REMOVE_LEADS,
	LIKE_LEAD,
	UNLIKE_LEAD,
	ARCHIVE_LEAD,
	UNARCHIVE_LEAD,
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
		case UNLIKE_LEAD:
			// const alreadyLiked = state.liked.find((lead) =>
			// 	lead.id === payload.id ? true : false
			// );
			return {
				...state,
				liked: state.liked.filter((lead) => lead.id !== payload.id),
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
			};
		case REMOVE_LEADS:
			return {
				...state,
				feed: [],
				loading: false,
			};
		default:
			return {
				...state,
			};
	}
}
