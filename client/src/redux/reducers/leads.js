import {
	GET_LEADS,
	GET_ALL_LEADS,
	GET_LIKED_LEADS,
	GET_ALL_LIKED_LEADS,
	GET_ARCHIVED_LEADS,
	GET_ALL_ARCHIVED_LEADS,
	SET_SEARCH_RESULTS,
	SET_CURRENT_LEAD,
	CLEAR_CURRENT_LEAD,
	SET_PAGE,
	LOGOUT,
	USER_LOADED,
	LOADING,
	FINISHED_LOADING,
	HANDLE_LIKE_LEAD,
} from '../actions/types';

const initialState = {
	feed: {
		totalByIds: [],
		totalAllIds: [],
		pageByIds: [],
		totalItems: null,
		pagination: {
			page: 1,
			hasNextPage: null,
			hasPreviousPage: false,
			nextPage: null,
			previousPage: null,
			lastPage: null,
		},
	},
	liked: {
		totalByIds: [],
		totalAllIds: [],
		pageByIds: [],
		totalItems: null,
		pagination: {
			page: 1,
			hasNextPage: null,
			hasPreviousPage: false,
			nextPage: null,
			previousPage: null,
			lastPage: null,
		},
	},
	archived: {
		totalByIds: [],
		totalAllIds: [],
		pageByIds: [],
		totalItems: null,
		pagination: {
			page: 1,
			hasNextPage: null,
			hasPreviousPage: false,
			nextPage: null,
			previousPage: null,
			lastPage: null,
		},
	},
	search: {
		totalByIds: [],
		totalAllIds: [],
		pageByIds: [],
		totalItems: null,
		pagination: {
			page: 1,
			hasNextPage: null,
			hasPreviousPage: false,
			nextPage: null,
			previousPage: null,
			lastPage: null,
		},
	},
	lastUpdated: null,
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
				totalItems,
				page,
				hasNextPage,
				hasPreviousPage,
				nextPage,
				previousPage,
				lastPage,
				lastUpdated,
			} = payload.data;
			return {
				...state,
				lastUpdated,
				feed: {
					...state.feed,
					pageByIds: feed,
					totalItems,
					pagination: {
						page,
						hasNextPage,
						hasPreviousPage,
						nextPage,
						previousPage,
					},
				},
			};
		case GET_ALL_LEADS:
			return {
				...state,
				feed: { ...state.feed, totalByIds: payload.data.feed },
			};
		case GET_LIKED_LEADS:
			return {
				...state,
				liked: {
					...state.liked,
					pageByIds: payload.likedLeads,
					page: payload.page,
					hasNextPage: payload.hasNextPage,
					hasPreviousPage: payload.hasPreviousPage,
					nextPage: payload.nextPage,
					previousPage: payload.previousPage,
				},
			};
		case HANDLE_LIKE_LEAD:
			const newLiked = liked.filter((lead) => lead._id !== payload.leadId);
			return {
				...state,
				liked: newLiked,
			};
		case GET_ARCHIVED_LEADS:
			return {
				...state,
				archived: {
					...state.archived,
					pageByIds: payload.archivedLeads,
					page: payload.page,
					hasNextPage: payload.hasNextPage,
					hasPreviousPage: payload.hasPreviousPage,
					nextPage: payload.nextPage,
					previousPage: payload.previousPage,
				},
			};
		case SET_SEARCH_RESULTS: {
			return {
				...state,
				search: {
					pageByIds: payload,
				},
			};
		}
		case SET_CURRENT_LEAD:
			return {
				...state,
				currentLead: payload,
			};
		case CLEAR_CURRENT_LEAD:
			return {
				...state,
				currentLead: null,
				loading: false,
			};
		case SET_PAGE:
			const { type } = payload;
			switch (type) {
				case 'feed': {
					return {
						...state,
						feed: {
							...state.feed,
							pagination: { ...state.feed.pagination, page: payload.page },
						},
					};
				}
				case 'liked': {
					return {
						...state,
						liked: {
							...state.liked,
							pagination: { ...state.liked.pagination, page: payload.page },
						},
					};
				}
				case 'archived': {
					return {
						...state,
						archived: {
							...state.archived,
							pagination: { ...state.archived.pagination, page: payload.page },
						},
					};
				}
				default: {
					return {
						...state,
					};
				}
			}
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
