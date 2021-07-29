import {
	GET_ALL_USERS,
	SET_PAGE,
	SET_PLAN,
	SET_BILLING_PAYMENTS,
	SET_AFFILIATE_PAYMENTS,
	SET_PAYPAL_EMAIL,
	LOADING,
	FINISHED_LOADING,
	FINISHED_PLAN_LOADING,
	FINISHED_BILLING_PAYMENTS_LOADING,
	FINISHED_AFFILIATE_PAYMENTS_LOADING,
	LOGOUT,
} from '../actions/types';

const initialState = {
	allUsers: [],
	loading: false,
	pagination: {
		page: 1,
		hasNextPage: null,
		hasPreviousPage: false,
		nextPage: null,
		previousPage: null,
		lastPage: null,
		totalItems: null,
	},
	userSettings: {
		billing: {
			plan: {
				loading: true,
				id: null,
				created: null,
				cancelAt: null,
				cancelAtPeriod: null,
				currentPeriodEnd: null,
				plan: {
					id: null,
					amount: null,
				},
			},
			paymentHistory: {
				loading: true,
				payments: [],
			},
		},
		affiliates: {
			paypalEmail: '',
			paymentHistory: {
				loading: true,
				payments: [],
			},
		},
	},
};
export default function userReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case GET_ALL_USERS: {
			const {
				users,
				page,
				hasNextPage,
				hasPreviousPage,
				nextPage,
				previousPage,
				totalItems,
			} = payload.data;
			return {
				...state,
				allUsers: users,
				pagination: {
					...state.pagination,
					page,
					hasNextPage,
					hasPreviousPage,
					nextPage,
					previousPage,
					totalItems,
				},
			};
		}
		case SET_PAGE: {
			const { type } = payload;
			switch (type) {
				case 'users': {
					return {
						...state,
						pagination: { ...state.pagination, page: payload.page },
					};
				}
				default: {
					return {
						...state,
					};
				}
			}
		}
		case SET_PLAN: {
			const {
				id,
				created,
				cancelAt,
				cancelAtPeriodEnd,
				currentPeriodEnd,
				plan: { planId, amount },
			} = payload;
			return {
				...state,
				userSettings: {
					...state.userSettings,
					billing: {
						...state.userSettings.billing,
						plan: {
							...state.userSettings.billing.plan,
							loading: false,
							id,
							created,
							cancelAt,
							cancelAtPeriodEnd,
							currentPeriodEnd,
							plan: {
								id: planId,
								amount,
							},
						},
					},
				},
			};
		}
		case SET_BILLING_PAYMENTS: {
			return {
				...state,
				userSettings: {
					...state.userSettings,
					billing: {
						...state.userSettings.billing,
						paymentHistory: {
							...state.userSettings.billing.paymentHistory,
							loading: false,
							payments: payload,
						},
					},
				},
				loading: false,
			};
		}
		case SET_AFFILIATE_PAYMENTS: {
			return {
				...state,
				userSettings: {
					...state.userSettings,
					affiliates: {
						...state.userSettings.affiliates,
						paymentHistory: {
							...state.userSettings.affiliates.paymentHistory,
							loading: false,
							payments: payload,
						},
					},
				},
				loading: false,
			};
		}
		case SET_PAYPAL_EMAIL: {
			return {
				...state,
				userSettings: {
					...state.userSettings,
					affiliates: {
						...state.userSettings.affiliates,
						paypalEmail: payload,
					},
				},
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
		case FINISHED_PLAN_LOADING: {
			return {
				...state,
				userSettings: {
					...state.userSettings,
					billing: {
						...state.userSettings.billing,
						plan: {
							...state.userSettings.billing.plan,
							loading: false,
						},
					},
				},
			};
		}
		case FINISHED_BILLING_PAYMENTS_LOADING: {
			return {
				...state,
				userSettings: {
					...state.userSettings,
					billing: {
						...state.userSettings.billing,
						paymentHistory: {
							...state.userSettings.billing.paymentHistory,
							loading: false,
						},
					},
				},
			};
		}
		case FINISHED_AFFILIATE_PAYMENTS_LOADING: {
			return {
				...state,
				userSettings: {
					...state.userSettings,
					affiliates: {
						...state.userSettings.affiliates,
						paymentHistory: {
							...state.userSettings.affiliates.paymentHistory,
							loading: false,
						},
					},
				},
			};
		}
		case LOGOUT: {
			return {
				...initialState,
			};
		}
		default:
			return state;
	}
}
