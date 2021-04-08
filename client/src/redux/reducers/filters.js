import {
	SET_NETPROFIT_FILTER,
	SET_BUYPRICE_FILTER,
	SET_SELLPRICE_FILTER,
	SET_ROI_FILTER,
	SET_BSR_FILTER,
	SET_MONTHLYSALES_FILTER,
	SET_WEIGHT_FILTER,
	SET_CATEGORY_FILTER,
	CLEAR_BUYPRICE_FILTER,
	CLEAR_SELLPRICE_FILTER,
	CLEAR_ROI_FILTER,
	CLEAR_BSR_FILTER,
	CLEAR_MONTHLYSALES_FILTER,
	CLEAR_WEIGHT_FILTER,
	CLEAR_CATEGORY_FILTER,
	CLEAR_NETPROFIT_FILTER,
	CLEAR_FILTERS,
} from '../actions/types';

const initialState = {
	count: null,
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
		unit: null,
		lb: null,
	},
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
				category: state.category.push(newCategory),
			};
		}
		case CLEAR_FILTERS: {
			return {
				count: null,
				netProfit: {
					min: null,
					max: null,
				},
				buyPrice: {
					min: null,
					max: null,
				},
				sellPrice: {
					min: null,
					max: null,
				},
				roi: {
					min: null,
					max: null,
				},
				bsr: {
					min: null,
					max: null,
				},
				monthlySales: {
					min: null,
					max: null,
				},
				weight: {
					min: null,
					max: null,
				},
				category: {
					min: null,
					max: null,
				},
			};
		}
		default:
			return {
				...state,
			};
	}
}
