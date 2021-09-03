import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type NumberOrNull = number | null;
interface FilterState {
	count: NumberOrNull;
	netProfit: {
		min: NumberOrNull;
		max: NumberOrNull;
	};
	buyPrice: {
		min: NumberOrNull;
		max: NumberOrNull;
	};
	sellPrice: {
		min: NumberOrNull;
		max: NumberOrNull;
	};
	roi: {
		min: NumberOrNull;
		max: NumberOrNull;
	};
	bsr: {
		min: NumberOrNull;
		max: NumberOrNull;
	};
	monthlySales: {
		min: NumberOrNull;
		max: NumberOrNull;
	};
	weight: {
		min: NumberOrNull;
		max: NumberOrNull;
	};
	category: string[];
	prep: {
		unit: NumberOrNull;
		lb: NumberOrNull;
	};
	itemLimits: {
		leadsLimit: number;
		searchLimit: number;
		usersLimit: number;
	};
	dateLimits: {
		min: string | null;
		max: string | null;
		selected: string | null;
	};
}

const initialState: FilterState = {
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
		setDateLimit: (
			state,
			action: PayloadAction<{
				min: string;
				max: string | null;
				selected: string;
			}>
		) => {
			state.dateLimits.min = action.payload.min;
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
		setItemLimit: (
			state,
			action: PayloadAction<{ type: string; itemLimit: number }>
		) => {
			const { type, itemLimit: newLimit } = action.payload;
			state.itemLimits.leadsLimit = +newLimit;
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
