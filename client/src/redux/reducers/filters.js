import {
	SET_NETPROFIT_FILTER,
	SET_BUYPRICE_FILTER,
	SET_SELLPRICE_FILTER,
	SET_ROI_FILTER,
	SET_BSR_FILTER,
	SET_MONTHLYSALES_FILTER,
	SET_WEIGHT_FILTER,
	SET_CATEGORY_FILTER,
	SET_FILTER_COUNT,
	SET_PREP_FILTER,
	SET_ITEM_LIMIT,
	SET_DATE_FILTER,
	CLEAR_NETPROFIT_FILTER,
	CLEAR_BUYPRICE_FILTER,
	CLEAR_SELLPRICE_FILTER,
	CLEAR_ROI_FILTER,
	CLEAR_BSR_FILTER,
	CLEAR_MONTHLYSALES_FILTER,
	CLEAR_WEIGHT_FILTER,
	CLEAR_PREP_FILTER,
	CLEAR_FILTERS,
} from '../actions/types';

const initialState = {
	count: +localStorage.getItem('filterCount') || null,
	netProfit: {
		min: +localStorage.getItem('netProfitMin') || null,
		max: +localStorage.getItem('netProfitMax') || null,
	},
	buyPrice: {
		min: +localStorage.getItem('buyPriceMin') || null,
		max: +localStorage.getItem('buyPriceMax') || null,
	},
	sellPrice: {
		min: +localStorage.getItem('sellPriceMin') || null,
		max: +localStorage.getItem('sellPriceMax') || null,
	},
	roi: {
		min: +localStorage.getItem('roiMin') || null,
		max: +localStorage.getItem('roiMax') || null,
	},
	bsr: {
		min: +localStorage.getItem('bsrMin') || null,
		max: +localStorage.getItem('bsrMax') || null,
	},
	monthlySales: {
		min: +localStorage.getItem('monthlySalesMin') || null,
		max: +localStorage.getItem('monthlySalesMax') || null,
	},
	weight: {
		min: +localStorage.getItem('weightMin') || null,
		max: +localStorage.getItem('weightMax') || null,
	},
	category: [],
	prep: {
		unit: +localStorage.getItem('unitFee') || null,
		lb: +localStorage.getItem('lbFee') || null,
	},
	itemLimits: {
		leadsLimit: +localStorage.getItem('leadsLimit') || 15,
		searchLimit: +localStorage.getItem('searchLimit') || 15,
		usersLimit: +localStorage.getItem('usersLimit') || 10,
	},
	dateLimits: { min: null, max: null, selected: null },
};

export default function filterReducer(state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case SET_NETPROFIT_FILTER:
		case CLEAR_NETPROFIT_FILTER: {
			const { min, max } = payload;
			return {
				...state,
				netProfit: {
					min: min ? min : null,
					max: max ? max : null,
				},
			};
		}
		case SET_BUYPRICE_FILTER:
		case CLEAR_BUYPRICE_FILTER: {
			const { min, max } = payload;
			return {
				...state,
				buyPrice: {
					min: min ? min : null,
					max: max ? max : null,
				},
			};
		}
		case SET_SELLPRICE_FILTER:
		case CLEAR_SELLPRICE_FILTER: {
			const { min, max } = payload;
			return {
				...state,
				sellPrice: {
					min: min ? min : null,
					max: max ? max : null,
				},
			};
		}
		case SET_ROI_FILTER:
		case CLEAR_ROI_FILTER: {
			const { min, max } = payload;
			return {
				...state,
				roi: {
					min: min ? min : null,
					max: max ? max : null,
				},
			};
		}
		case SET_BSR_FILTER:
		case CLEAR_BSR_FILTER: {
			const { min, max } = payload;
			return {
				...state,
				bsr: {
					min: min ? min : null,
					max: max ? max : null,
				},
			};
		}
		case SET_MONTHLYSALES_FILTER:
		case CLEAR_MONTHLYSALES_FILTER: {
			const { min, max } = payload;
			return {
				...state,
				monthlySales: {
					min: min ? min : null,
					max: max ? max : null,
				},
			};
		}
		case SET_WEIGHT_FILTER:
		case CLEAR_WEIGHT_FILTER: {
			const { min, max } = payload;
			return {
				...state,
				weight: {
					min: min ? min : null,
					max: max ? max : null,
				},
			};
		}
		case SET_CATEGORY_FILTER: {
			const { newCategory } = payload;
			return {
				...state,
				category: [...state.category, newCategory],
			};
		}
		case SET_FILTER_COUNT: {
			const { netProfit, buyPrice, sellPrice, roi, bsr, monthlySales, weight } =
				state;
			const allFilters = [
				netProfit.min,
				netProfit.max,
				buyPrice.min,
				buyPrice.max,
				sellPrice.min,
				sellPrice.max,
				roi.min,
				roi.max,
				bsr.min,
				bsr.max,
				monthlySales.min,
				monthlySales.max,
				weight.min,
				weight.max,
			];
			const notNullable = allFilters.filter((f) => f !== null).length;
			localStorage.setItem('filterCount', notNullable);
			return {
				...state,
				count: notNullable,
			};
		}
		case SET_PREP_FILTER: {
			const { key, value } = payload;
			if (key === 'unit') {
				return {
					...state,
					prep: {
						unit: +value,
						lb: null,
					},
				};
			} else {
				return {
					...state,
					prep: {
						unit: null,
						lb: +value,
					},
				};
			}
		}
		case SET_ITEM_LIMIT: {
			const { typeFilter, itemLimit: newLimit } = payload;
			switch (typeFilter) {
				case 'leadsLimit': {
					return {
						...state,
						itemLimits: {
							...state.itemLimits,
							leadsLimit: +newLimit,
						},
					};
				}
				case 'searchLimit': {
					return {
						...state,
						itemLimits: {
							...state.itemLimits,
							searchLimit: +newLimit,
						},
					};
				}
				case 'usersLimit': {
					console.log('usersLimit');
					return {
						...state,
						itemLimits: {
							...state.itemLimits,
							usersLimit: +newLimit,
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
		case SET_DATE_FILTER: {
			const { min, max, selected } = payload;
			return {
				...state,
				dateLimits: {
					min,
					max,
					selected,
				},
			};
		}
		case CLEAR_PREP_FILTER: {
			return {
				...state,
				prep: {
					unit: null,
					lb: null,
				},
			};
		}
		case CLEAR_FILTERS: {
			return {
				...initialState,
				count: null,
			};
		}
		default:
			return {
				...state,
			};
	}
}
