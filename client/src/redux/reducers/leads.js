import {
	GET_LEADS,
	GET_ALL_LEADS,
	GET_LIKED_LEADS,
	SET_NETPROFIT_FILTER,
	SET_BUYPRICE_FILTER,
	SET_SELLPRICE_FILTER,
	SET_ROI_FILTER,
	SET_BSR_FILTER,
	SET_MONTHLYSALES_FILTER,
	SET_WEIGHT_FILTER,
	SET_CATEGORY_FILTER,
	CLEAR_NETPROFIT_FILTER,
	CLEAR_FILTER,
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
	filters: {
		netProfit: {
			min: localStorage.getItem('netProfitMin') || null,
			max: localStorage.getItem('netProfitMax') || null,
		},
		buyPrice: {
			min: localStorage.getItem('buyPriceMin') || null,
			max: localStorage.getItem('buyPriceMax') || null,
		},
		sellPrice: {
			min: localStorage.getItem('sellPriceMin') || null,
			max: localStorage.getItem('sellPriceMax') || null,
		},
		roi: {
			min: localStorage.getItem('roiMin') || null,
			max: localStorage.getItem('roiMax') || null,
		},
		bsr: {
			min: localStorage.getItem('bsrMin') || null,
			max: localStorage.getItem('bsrMax') || null,
		},
		monthlySales: {
			min: localStorage.getItem('monthlySalesMin') || null,
			max: localStorage.getItem('monthlySalesMax') || null,
		},
		weight: {
			min: localStorage.getItem('weightMin') || null,
			max: localStorage.getItem('weightMax') || null,
		},
		category: {
			min: null,
			max: null,
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
		case SET_NETPROFIT_FILTER: {
			const { min, max } = payload;
			return {
				...state,
				filters: {
					...state.filters,
					netProfit: {
						min,
						max,
					},
				},
			};
		}
		case SET_BUYPRICE_FILTER: {
			const { min, max } = payload;
			return {
				...state,
				filters: {
					...state.filters,
					buyPrice: {
						min,
						max,
					},
				},
			};
		}
		case SET_SELLPRICE_FILTER: {
			const { min, max } = payload;
			return {
				...state,
				filters: {
					...state.filters,
					sellPrice: {
						min,
						max,
					},
				},
			};
		}
		case SET_ROI_FILTER: {
			const { min, max } = payload;
			return {
				...state,
				filters: {
					...state.filters,
					roi: {
						min,
						max,
					},
				},
			};
		}
		case SET_BSR_FILTER: {
			const { min, max } = payload;
			return {
				...state,
				filters: {
					...state.filters,
					bsr: {
						min,
						max,
					},
				},
			};
		}
		case SET_MONTHLYSALES_FILTER: {
			const { min, max } = payload;
			return {
				...state,
				filters: {
					...state.filters,
					netProfit: {
						min,
						max,
					},
				},
			};
		}
		case SET_WEIGHT_FILTER: {
			const { min, max } = payload;
			return {
				...state,
				filters: {
					...state.filters,
					weight: {
						min,
						max,
					},
				},
			};
		}
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
