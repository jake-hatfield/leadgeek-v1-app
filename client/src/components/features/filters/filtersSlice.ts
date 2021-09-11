import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

import {
	Filter,
	FilterOperators,
	FilterState,
	FilterTitles,
	FilterTypes,
} from '@utils/interfaces/Filter';

const initialState: FilterState = {
	count: +localStorage.getItem('filterCount')! || 0,
	filters: [],
	prep: {
		unit: +localStorage.getItem('unitFee')! || null,
		lb: +localStorage.getItem('lbFee')! || null,
	},
	itemLimit: +localStorage.getItem('itemLimit')! || 15,
	dateLimits: { min: null, max: null, selected: null },
};

export const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		clearFilter: (
			state,
			action: PayloadAction<{
				id: string;
			}>
		) => {
			state.filters = state.filters.filter(
				(filter) => filter.id !== action.payload.id
			);
			state.count = state.filters.length;
		},

		clearFilters: (state) => {
			state.count = 0;
			state.filters = [];
		},
		clearPrepFilter: (state) => {
			console.log(state);
		},
		createFilter: {
			reducer: (
				state,
				action: PayloadAction<{
					id: string;
					type: FilterTypes;
					title: FilterTitles;
					operator: FilterOperators;
					value: string | number;
				}>
			) => {
				const { id, type, title, operator, value } = action.payload;

				// perform actions to the input value to make it able to processed the same way for all types
				let processedValue;
				if (type === 'roi') {
					processedValue = +value / 100;
				} else {
					processedValue = value;
				}

				// create a new filter object
				const newFilter: Filter = {
					id,
					type,
					title,
					operator,
					value: processedValue,
				};

				// see if a filter already exists and return the index if it does
				const index = state.filters.findIndex(
					(filter: Filter) =>
						filter.type === newFilter.type &&
						filter.operator === newFilter.operator
				);
				if (index < 0) {
					// create a new filter
					state.filters.push(newFilter);
				} else {
					// update already existing filter
					state.filters[index] = newFilter;
				}
				// update the count to the current number of applied filters
				state.count = state.filters.length;
			},
			prepare: (
				type: FilterTypes,
				title: FilterTitles,
				operator: FilterOperators,
				value: string | number
			) => {
				const id = nanoid();

				return {
					payload: {
						id,
						type,
						title,
						operator,
						value,
					},
				};
			},
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
			localStorage.setItem('itemLimit', action.payload.itemLimit.toString());
			state.itemLimit = +action.payload.itemLimit;
		},
		setPrepFilter: (state, action: PayloadAction<string>) => {
			console.log(action.payload);
		},
	},
});

export const {
	clearFilter,
	clearFilters,
	clearPrepFilter,
	createFilter,
	setDateLimit,
	setItemLimit,
	setPrepFilter,
} = filtersSlice.actions;

export default filtersSlice.reducer;
