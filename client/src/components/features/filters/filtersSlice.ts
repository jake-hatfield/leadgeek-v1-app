import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type NumberOrNull = number | null;
interface FilterState {
	count: number;
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
	source: string[];
	prep: {
		unit: NumberOrNull;
		lb: NumberOrNull;
	};
	itemLimit: number;
	dateLimits: {
		min: string | null;
		max: string | null;
		selected: string | null;
	};
}

const initialState: any = {
	count: +localStorage.getItem('filterCount')! || 0,
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
	source: [],
	prep: {
		unit: +localStorage.getItem('unitFee')! || null,
		lb: +localStorage.getItem('lbFee')! || null,
	},
	itemLimit: +localStorage.getItem('leadsLimit')! || 15,
	dateLimits: { min: null, max: null, selected: null },
};

export const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		clearFilters: (state) => {
			state.count = 0;
			state.netProfit = {
				min: null,
				max: null,
			};
			state.buyPrice = {
				min: null,
				max: null,
			};
			state.sellPrice = {
				min: null,
				max: null,
			};
			state.roi = {
				min: null,
				max: null,
			};
			state.bsr = {
				min: null,
				max: null,
			};
			state.monthlySales = {
				min: null,
				max: null,
			};
			state.weight = {
				min: null,
				max: null,
			};
			state.category = [];
			state.source = [];
			state.prep = {
				unit: null,
				lb: null,
			};
			state.itemLimit = 15;
			state.dateLimits = { min: null, max: null, selected: null };
		},
		clearPrepFilter: (state) => {
			console.log(state);
		},
		createFilter: (
			state,
			action: PayloadAction<{
				type: string;
				operator: string;
				value: string | number;
			}>
		) => {
			const { type, operator, value } = action.payload;
			let processedValue;
			if (type === 'roi') {
				processedValue = +value / 100;
			} else {
				processedValue = value;
			}
			if (operator === 'gte') {
				state[type].min = processedValue;
			} else if (operator === 'lte') {
				state[type].max = processedValue;
			} else {
				state[type].push(processedValue);
			}
			localStorage.setItem(`${type}Min`, processedValue.toString());
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
			state.count = notNullable + state.category.length + state.source.length;
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
			state.dateLimits.max = action.payload.max;
			state.dateLimits.selected = action.payload.selected;
		},
		setItemLimit: (
			state,
			action: PayloadAction<{ type: string; itemLimit: number }>
		) => {
			const { itemLimit: newLimit } = action.payload;
			state.itemLimit = +newLimit;
		},
		setPrepFilter: (state, action: PayloadAction<string>) => {
			console.log(action.payload);
		},
	},
});

export const {
	clearFilters,
	clearPrepFilter,
	createFilter,
	setDateLimit,
	setItemLimit,
	setPrepFilter,
} = filtersSlice.actions;

export default filtersSlice.reducer;
