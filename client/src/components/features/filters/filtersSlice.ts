import {
	createAsyncThunk,
	createSlice,
	nanoid,
	PayloadAction,
} from '@reduxjs/toolkit';

import {
	Filter,
	FilterOperators,
	FilterState,
	FilterTitles,
	FilterTypes,
	SortCriterion,
	SortTitles,
	SortTypes,
	SortValues,
} from '@utils/interfaces/Filter';
import { LeadTypes } from '@utils/interfaces/Lead';

const getLSFilters = () => {
	const lsFilters = localStorage.getItem('filters');
	return lsFilters ? JSON.parse(lsFilters) : [];
};

const getLSSortCriteria = (): SortCriterion[] | [] => {
	const lsSortCriteria = localStorage.getItem('sortCriteria');
	return lsSortCriteria ? JSON.parse(lsSortCriteria) : [];
};

const lsFilters = getLSFilters();
const lsSortCriteria = getLSSortCriteria();

export const setItemLimit = createAsyncThunk(
	'filters/setItemLimit',
	async (options: { type: LeadTypes; itemLimit: number }) => {
		return options;
	}
);

const initialState: FilterState = {
	count: lsFilters.length || 0,
	filters: lsFilters,
	sortCriteria: lsSortCriteria,
	prep: {
		unit: +localStorage.getItem('unitFee')! || null,
		lb: +localStorage.getItem('lbFee')! || null,
	},
	itemLimit: +localStorage.getItem('itemLimit')! || 20,
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
		clearSortCriterion: (
			state,
			action: PayloadAction<{
				type: SortTypes;
			}>
		) => {
			// state
			state.sortCriteria = state.sortCriteria.filter(
				(sortCriterion) => sortCriterion.type !== action.payload.type
			);

			// local storage

			// get any existing sort criteria
			const existingSortCriteria = getLSSortCriteria();
			// if they exist, filter out all that aren't being deleted
			if (existingSortCriteria.length > 0) {
				const newCriteria = existingSortCriteria.filter(
					(sortCriterion: SortCriterion) =>
						sortCriterion.type !== action.payload.type
				);
				// if there are remaining sort criteria, add them
				if (newCriteria.length > 0) {
					localStorage.setItem('sortCriteria', JSON.stringify(newCriteria));
				} else {
					// otherwise get rid of the item in local storage
					localStorage.removeItem('sortCriteria');
				}
			}
		},
		clearSortCriteria: (state) => {
			// state
			state.sortCriteria = [];

			// local storage
			localStorage.removeItem('sortCriteria');
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
		createSortCriterion: (state, action) => {
			// destructure necessary items
			const { title, type, value } = action.payload;

			// create a new sorting criteria
			const newSortCriterion: SortCriterion = {
				title,
				type,
				value,
			};

			const existingSortCriteria = getLSSortCriteria();

			// see if a sort criterion already exists and return the index if it does
			const index = existingSortCriteria.findIndex(
				(sortCriterion: SortCriterion) =>
					sortCriterion.type === newSortCriterion.type
			);

			if (index < 0) {
				// create a new sort criterion
				localStorage.setItem(
					'sortCriteria',
					JSON.stringify([...existingSortCriteria, newSortCriterion])
				);
				state.sortCriteria.push(newSortCriterion);
			} else {
				// update already existing sort criterion
				existingSortCriteria[index] = newSortCriterion;
				localStorage.setItem(
					'sortCriteria',
					JSON.stringify(existingSortCriteria)
				);
				state.sortCriteria[index] = newSortCriterion;
			}
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
		setFilters: (state, action) => {
			localStorage.setItem('filters', JSON.stringify(action.payload));
			state.filters = action.payload;
		},
		setItemLimit: (
			state,
			action: PayloadAction<{ type: string; itemLimit: number }>
		) => {
			localStorage.setItem('itemLimit', action.payload.itemLimit.toString());
			state.itemLimit = +action.payload.itemLimit;
		},
		setSortColumn: (
			state,
			action: PayloadAction<{
				type: SortTypes;
				value: SortValues;
			}>
		) => {
			// destructure necessary items
			const { type, value } = action.payload;

			const getSortCriterionTitle = (type: SortTypes) => {
				const data: { title: SortTitles; type: SortTypes }[] = [
					{ title: 'Title', type: 'title' },
					{ title: 'Category', type: 'category' },
					{ title: 'Profit', type: 'netProfit' },
					{ title: 'Return on investment', type: 'roi' },
					{ title: "Best seller's rank", type: 'bsrCurrent' },
					{ title: 'Monthly sales', type: 'monthlySales' },
					{ title: 'Date', type: 'date' },
				];
				return data.find((d) => d.type === type)?.title;
			};

			const title = getSortCriterionTitle(type);

			if (title) {
				// create a new sorting criterion
				const newSortCriterion: SortCriterion = {
					title,
					type,
					value,
				};

				const existingSortCriteria = getLSSortCriteria();

				// see if a sort criterion already exists and return the index if it does
				const index = existingSortCriteria.findIndex(
					(sortCriterion: SortCriterion) => sortCriterion.type === type
				);

				if (index < 0) {
					// create a new sort criterion
					localStorage.setItem(
						'sortCriteria',
						JSON.stringify([newSortCriterion, ...existingSortCriteria])
					);

					state.sortCriteria = [newSortCriterion, ...existingSortCriteria];
				} else {
					// update already existing sort criterion
					const filteredCriteria = existingSortCriteria.filter(
						(sortCriteria) => sortCriteria.type !== type
					);

					localStorage.setItem(
						'sortCriteria',
						JSON.stringify([newSortCriterion, ...filteredCriteria])
					);

					state.sortCriteria = [newSortCriterion, ...filteredCriteria];
				}
			}
		},
		setReorderedSortCriteria: (
			state,
			action: PayloadAction<SortCriterion[]>
		) => {
			state.sortCriteria = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(setItemLimit.fulfilled, (state, action) => {
			localStorage.setItem('itemLimit', action.payload.itemLimit.toString());
			state.itemLimit = +action.payload.itemLimit;
		});
	},
});

export const {
	clearFilter,
	clearFilters,
	createFilter,
	clearSortCriterion,
	clearSortCriteria,
	createSortCriterion,
	setDateLimit,
	setFilters,
	setSortColumn,
	setReorderedSortCriteria,
} = filtersSlice.actions;

export default filtersSlice.reducer;
