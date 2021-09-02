import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
	count: +localStorage.getItem('filterCount')! || null,
	netProfit: {
		min: +localStorage.getItem('netProfitMin')! || null,
		max: +localStorage.getItem('netProfitMax')! || null,
	},
	buyPrice: {
		min: +localStorage.getItem('buyPriceMin')! || null,
		max: +localStorage.getItem('buyPriceMax')! || null,
	},
	sellPrice: {
		min: +localStorage.getItem('sellPriceMin')! || null,
		max: +localStorage.getItem('sellPriceMax')! || null,
	},
	roi: {
		min: +localStorage.getItem('roiMin')! || null,
		max: +localStorage.getItem('roiMax')! || null,
	},
	bsr: {
		min: +localStorage.getItem('bsrMin')! || null,
		max: +localStorage.getItem('bsrMax')! || null,
	},
	monthlySales: {
		min: +localStorage.getItem('monthlySalesMin')! || null,
		max: +localStorage.getItem('monthlySalesMax')! || null,
	},
	weight: {
		min: +localStorage.getItem('weightMin')! || null,
		max: +localStorage.getItem('weightMax')! || null,
	},
	category: [],
	prep: {
		unit: +localStorage.getItem('unitFee')! || null,
		lb: +localStorage.getItem('lbFee')! || null,
	},
	itemLimits: {
		leadsLimit: +localStorage.getItem('leadsLimit')! || 15,
		searchLimit: +localStorage.getItem('searchLimit')! || 15,
		usersLimit: +localStorage.getItem('usersLimit')! || 10,
	},
	dateLimits: { min: null, max: null, selected: null },
};

// export const setItemLimit = (type, itemLimit) => async (dispatch) => {
// 	try {
// 		if (itemLimit) {
// 			let typeFilter;
// 			if (type === 'feed' || type === 'liked' || type === 'archived') {
// 				typeFilter = 'leadsLimit';
// 			} else {
// 				typeFilter = `${type}Limit`;
// 			}
// 			localStorage.setItem(typeFilter, itemLimit);
// 			return dispatch({
// 				type: SET_ITEM_LIMIT,
// 				payload: { typeFilter, itemLimit },
// 			});
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

// export const setDateLimit = (min, max, selected) => async (dispatch) => {
// 	try {
// 		if (min || max) {
// 			return dispatch({
// 				type: `SET_DATE_FILTER`,
// 				payload: {
// 					min,
// 					max,
// 					selected,
// 				},
// 			});
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

export const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		clearPrepFilter: (state) => {
			console.log(state);
		},
		setDateLimit: (state, action: PayloadAction<string>) => {
			console.log(action.payload);
		},
		setFilterCount: (state) => {
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
			localStorage.setItem('filterCount', notNullable.toString());
			state.count = notNullable;
		},
		setItemLimit: (state, action) => {
			console.log(action.payload);
		},
		setPrepFilter: (state, action: PayloadAction<string>) => {
			console.log(action.payload);
		},
	},
});

export const {
	clearPrepFilter,
	setDateLimit,
	setFilterCount,
	setItemLimit,
	setPrepFilter,
} = filtersSlice.actions;

export default filtersSlice.reducer;
