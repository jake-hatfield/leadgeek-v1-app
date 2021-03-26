import {
	SET_NETPROFIT_FILTER,
	SET_BUYPRICE_FILTER,
	SET_SELLPRICE_FILTER,
	SET_ROI_FILTER,
	SET_BSR_FILTER,
	SET_MONTHLYSALES_FILTER,
	SET_WEIGHT_FILTER,
	SET_CATEGORY_FILTER,
	CLEAR_NETPROFIT_FILTER,
	CLEAR_FILTERS,
} from '../actions/types';

const initialState = {
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
		case CLEAR_FILTERS: {
			console.log('hello');
			return {
				...initialState,
			};
		}
		default:
			return {
				...state,
			};
	}
}
