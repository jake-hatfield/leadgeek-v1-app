import {
	GET_LEADS,
	GET_ALL_LEADS,
	GET_LIKED_LEADS,
	SET_CURRENT_LEAD,
	CLEAR_DETAILED_LEAD,
	SET_PAGE,
	LOGOUT,
	USER_LOADED,
	GET_ARCHIVED_LEADS,
	LOADING,
	FINISHED_LOADING,
	EXPORTING,
	FINISHED_EXPORTING,
	HANDLE_LIKE_LEAD,
} from '../actions/types';

const initialState = {
	feed: [],
	liked: [],
	archived: [],
	search: [],
	pagination: {
		feed: {
			active: [],
			totalItems: null,
			page: 1,
			hasNextPage: null,
			hasPreviousPage: false,
			nextPage: null,
			previousPage: null,
		},
		liked: {
			active: [],
			page: 1,
			hasNextPage: null,
			hasPreviousPage: false,
			nextPage: null,
			previousPage: null,
		},
		archived: {
			active: [],
			page: 1,
			hasNextPage: null,
			hasPreviousPage: false,
			nextPage: null,
			previousPage: null,
		},
	},
	lastUpdated: null,
	currentLead: null,
	exporting: false,
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
				pagination: {
					...state.pagination,
					feed: {
						...state.feed.pagination,
						active: feed,
						totalItems,
						page,
						hasNextPage,
						hasPreviousPage,
						nextPage,
						previousPage,
						lastPage,
					},
				},
			};
		case GET_ALL_LEADS:
			return {
				...state,
				feed: payload.data.feed,
			};
		case GET_LIKED_LEADS:
			return {
				...state,
				pagination: {
					...state.pagination,
					liked: {
						...state.liked.pagination,
						active: payload.likedLeads,
						page: payload.page,
						hasNextPage: payload.hasNextPage,
						hasPreviousPage: payload.hasPreviousPage,
						nextPage: payload.nextPage,
						previousPage: payload.previousPage,
					},
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
				pagination: {
					...state.pagination,
					archived: {
						...state.archived.pagination,
						active: payload.archivedLeads,
						page: payload.page,
						hasNextPage: payload.hasNextPage,
						hasPreviousPage: payload.hasPreviousPage,
						nextPage: payload.nextPage,
						previousPage: payload.previousPage,
					},
				},
			};
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
			const { type } = payload;
			switch (type) {
				case 'feed': {
					return {
						...state,
						pagination: {
							...state.pagination,
							feed: { ...state.pagination.feed, page: payload.page },
						},
					};
				}
				case 'liked': {
					return {
						...state,
						pagination: {
							...state.pagination,
							liked: { ...state.pagination.liked, page: payload.page },
						},
					};
				}
				case 'archived': {
					return {
						...state,
						pagination: {
							...state.pagination,
							archived: { ...state.pagination.archived, page: payload.page },
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
		case EXPORTING:
			return {
				...state,
				exporting: true,
			};
		case FINISHED_EXPORTING:
			return {
				...state,
				exporting: false,
			};
		default:
			return {
				...state,
			};
	}
}
