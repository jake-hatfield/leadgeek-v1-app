import {
	GET_LEADS,
	GET_ALL_LEADS,
	GET_LIKED_LEADS,
	GET_ARCHIVED_LEADS,
	SET_SEARCH_RESULTS,
	NO_LEAD_RESULTS,
	SET_CURRENT_LEAD,
	CLEAR_CURRENT_LEAD,
	SET_PAGE,
	SURROGATE_USER,
	LOGOUT,
	USER_LOADED,
	LOADING,
	FINISHED_LOADING,
	HANDLE_LIKE_LEAD,
	HANDLE_ARCHIVE_LEAD,
	CLEAR_CURRENT_SEARCH,
} from '../actions/types';

const initialState = {
	feed: {
		totalByIds: [],
		totalAllIds: [],
		pageByIds: [],
		pagination: {
			page: 1,
			hasNextPage: null,
			hasPreviousPage: false,
			nextPage: null,
			previousPage: null,
			lastPage: null,
			totalItems: null,
		},
	},
	liked: {
		totalByIds: [],
		totalAllIds: [],
		pageByIds: [],
		pagination: {
			page: 1,
			hasNextPage: null,
			hasPreviousPage: false,
			nextPage: null,
			previousPage: null,
			lastPage: null,
			totalItems: null,
		},
	},
	archived: {
		totalByIds: [],
		totalAllIds: [],
		pageByIds: [],
		pagination: {
			page: 1,
			hasNextPage: null,
			hasPreviousPage: false,
			nextPage: null,
			previousPage: null,
			lastPage: null,
			totalItems: null,
		},
	},
	search: {
		totalByIds: [],
		totalAllIds: [],
		pageByIds: [],
		pagination: {
			page: 1,
			hasNextPage: null,
			hasPreviousPage: false,
			nextPage: null,
			previousPage: null,
			lastPage: null,
			totalItems: null,
		},
		searchValue: null,
	},
};

export default function leadsReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case USER_LOADED: {
			return {
				...state,
				lastActive: payload.lastLoggedIn,
				loading: false,
			};
		}
		case GET_LEADS: {
			const {
				feed,
				page,
				hasNextPage,
				hasPreviousPage,
				nextPage,
				previousPage,
				totalItems,
				lastUpdated,
			} = payload.data;
			return {
				...state,
				lastUpdated,
				feed: {
					...state.feed,
					pageByIds: feed,
					pagination: {
						page,
						hasNextPage,
						hasPreviousPage,
						nextPage,
						previousPage,
						totalItems,
					},
				},
			};
		}
		case GET_ALL_LEADS: {
			return {
				...state,
				feed: { ...state.feed, totalByIds: payload.data.feed },
			};
		}
		case GET_LIKED_LEADS: {
			const {
				likedLeads,
				page,
				hasNextPage,
				hasPreviousPage,
				nextPage,
				previousPage,
				totalItems,
			} = payload.data;
			return {
				...state,
				liked: {
					...state.liked,
					pageByIds: likedLeads,
					pagination: {
						page,
						hasNextPage,
						hasPreviousPage,
						nextPage,
						previousPage,
						totalItems,
					},
				},
			};
		}
		case GET_ARCHIVED_LEADS: {
			const {
				archivedLeads,
				page,
				hasNextPage,
				hasPreviousPage,
				nextPage,
				previousPage,
				totalItems,
			} = payload.data;
			return {
				...state,
				archived: {
					...state.archived,
					pageByIds: archivedLeads,
					pagination: {
						page,
						hasNextPage,
						hasPreviousPage,
						nextPage,
						previousPage,
						totalItems,
					},
				},
			};
		}
		case NO_LEAD_RESULTS: {
			return {
				...state,
				feed: {
					...state.feed,
					pageByIds: [],
				},
			};
		}
		case HANDLE_LIKE_LEAD: {
			const newLiked = state.liked.pageByIds.filter(
				(lead) => lead._id !== payload.leadId
			);
			return {
				...state,
				liked: {
					...state.liked,
					pageByIds: newLiked,
				},
			};
		}
		case HANDLE_ARCHIVE_LEAD: {
			const newArchived = state.archived.pageByIds.filter(
				(lead) => lead._id !== payload.leadId
			);
			return {
				...state,
				archived: {
					...state.archived,
					pageByIds: newArchived,
				},
			};
		}
		case SET_SEARCH_RESULTS: {
			const {
				leads,
				page,
				hasNextPage,
				hasPreviousPage,
				nextPage,
				previousPage,
				totalItems,
			} = payload.data;
			return {
				...state,
				search: {
					...state.search,
					pageByIds: leads,
					pagination: {
						page,
						hasNextPage,
						hasPreviousPage,
						nextPage,
						previousPage,
						totalItems,
					},
					searchValue: payload.q,
				},
			};
		}
		case CLEAR_CURRENT_SEARCH: {
			return {
				...state,
				search: {
					...state.search,
					pageByIds: [],
					pagination: {
						page: 1,
						...initialState,
					},
				},
			};
		}
		case SET_CURRENT_LEAD: {
			return {
				...state,
				currentLead: payload,
			};
		}
		case CLEAR_CURRENT_LEAD: {
			return {
				...state,
				currentLead: null,
				loading: false,
			};
		}
		case SET_PAGE: {
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
				case 'search': {
					return {
						...state,
						search: {
							...state.search,
							pagination: { ...state.search.pagination, page: payload.page },
						},
					};
				}
				default: {
					return {
						...state,
					};
				}
			}
		}

		case SURROGATE_USER:
		case LOGOUT: {
			return {
				...initialState,
			};
		}
		case LOADING: {
			return {
				...state,
				loading: true,
			};
		}
		case FINISHED_LOADING: {
			return {
				...state,
				loading: false,
			};
		}
		default: {
			return {
				...state,
			};
		}
	}
}
