import {
	GET_LEADS,
	REMOVE_LEADS,
	LIKE_LEAD,
	UNLIKE_LEAD,
} from '../actions/types';

const initialState = {
	feed: [],
	new: [],
	liked: [],
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
			const alreadyLiked = state.liked.find((lead) =>
				lead.id === payload.id ? true : false
			);
			console.log(alreadyLiked);
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
