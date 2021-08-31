import { createSlice } from '@reduxjs/toolkit';

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

export const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {},
});

export const {} = filtersSlice.actions;

export default filtersSlice.reducer;
