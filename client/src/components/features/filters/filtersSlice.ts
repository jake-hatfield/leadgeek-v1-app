import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

import {
	Filter,
	FilterOperators,
	FilterState,
	FilterTitles,
	FilterTypes,
} from '@utils/interfaces/Filter';

const getLSFilters = () => {
	const lsFilters = localStorage.getItem('filters');
	return lsFilters ? JSON.parse(lsFilters) : [];
};

const lsFilters = getLSFilters();

const initialState: FilterState = {
	count: lsFilters.length || 0,
	filters: lsFilters,
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
			// state
			state.filters = state.filters.filter(
				(filter) => filter.id !== action.payload.id
			);
			state.count = state.filters.length;

			// local storage

			// get any existing filters
			const existingFilters = getLSFilters();
			// if they exist, filter out all that aren't being deleted
			if (existingFilters.length > 0) {
				const newFilters = existingFilters.filter(
					(filter: Filter) => filter.id !== action.payload.id
				);
				// if there are remaining filters, add them
				if (newFilters.length > 0) {
					localStorage.setItem('filters', JSON.stringify(newFilters));
				} else {
					// otherwise get rid of the item in local storage
					localStorage.removeItem('filters');
				}
			}
		},
		clearFilters: (state) => {
			// state
			state.count = 0;
			state.filters = [];

			// local storage
			localStorage.removeItem('filters');
		},
		createFilter: {
			reducer: (
				state,
				action: PayloadAction<{
					id: string;
					format: 'numeric' | 'text';
					type: FilterTypes;
					title: FilterTitles;
					operator: FilterOperators;
					value: string | number;
				}>
			) => {
				// destructure necessary items from action payload
				const { id, format, type, title, operator, value } = action.payload;

				// state

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
					format,
					type,
					title,
					operator,
					value: processedValue,
				};

				if (format === 'numeric') {
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
				} else {
					// it's a text filter, so just add a new one
					state.filters.push(newFilter);
				}
				// update the count to the current number of applied filters
				state.count = state.filters.length;

				// local storage

				// add filter to local storage
				const existingFilters = getLSFilters();

				// see if a filter already exists and return the index if it does
				const index = existingFilters.findIndex(
					(filter: Filter) =>
						filter.type === newFilter.type &&
						filter.operator === newFilter.operator
				);
				if (index < 0) {
					// create a new filter
					return localStorage.setItem(
						'filters',
						JSON.stringify([...existingFilters, newFilter])
					);
				} else {
					// update already existing filter
					existingFilters[index] = newFilter;
					return localStorage.setItem(
						'filters',
						JSON.stringify(existingFilters)
					);
				}
			},
			prepare: (
				format: 'numeric' | 'text',
				type: FilterTypes,
				title: FilterTitles,
				operator: FilterOperators,
				value: string | number
			) => {
				const id = nanoid();

				return {
					payload: {
						id,
						format,
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
	},
});

export const {
	clearFilter,
	clearFilters,
	createFilter,
	setDateLimit,
	setItemLimit,
} = filtersSlice.actions;

export default filtersSlice.reducer;
