import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';

import { User } from '@utils/interfaces/User';
import { Lead } from '@utils/interfaces/Lead';
import { config } from '@utils/utils';

interface LeadState {
	totalByIds: Lead[];
	totalAllIds: string[];
	pageByIds: any;
	pagination: {
		page: number;
		hasNextPage: boolean | null;
		hasPreviousPage: boolean;
		nextPage: number | null;
		previousPage: number | null;
		lastPage: number | null;
		totalItems: number | null;
		filteredItems: number | null;
	};
}

interface LeadsState {
	status: 'idle' | 'loading' | 'failed';
	feed: LeadState;
	liked: LeadState;
	archived: LeadState;
	search: any;
	lastUpdated: Date | null;
}

const initialState: LeadsState = {
	status: 'idle',
	feed: {
		totalByIds: [],
		totalAllIds: [],
		pageByIds: [],
		pagination: {
			page: 1,
			hasNextPage: null,
			hasPreviousPage: false,
			nextPage: null,
			previousPage: null,
			lastPage: null,
			totalItems: null,
			filteredItems: null,
		},
	},
	liked: {
		totalByIds: [],
		totalAllIds: [],
		pageByIds: [],
		pagination: {
			page: 1,
			hasNextPage: null,
			hasPreviousPage: false,
			nextPage: null,
			previousPage: null,
			lastPage: null,
			totalItems: null,
			filteredItems: null,
		},
	},
	archived: {
		totalByIds: [],
		totalAllIds: [],
		pageByIds: [],
		pagination: {
			page: 1,
			hasNextPage: null,
			hasPreviousPage: false,
			nextPage: null,
			previousPage: null,
			lastPage: null,
			totalItems: null,
			filteredItems: null,
		},
	},
	search: {
		totalByIds: [],
		totalAllIds: [],
		pageByIds: [],
		pagination: {
			page: 1,
			hasNextPage: null,
			hasPreviousPage: false,
			nextPage: null,
			previousPage: null,
			lastPage: null,
			totalItems: null,
		},
		searchValue: null,
	},
	lastUpdated: null,
};

export const getFeedLeads = createAsyncThunk(
	'leads/getFeedLeads',
	async (options: { user: User; page: number; filters: any }, { dispatch }) => {
		try {
			const { _id, lastLoggedIn, role } = options.user;
			const body = JSON.stringify({
				_id,
				lastLoggedIn,
				role,
				page: options.page,
				filters: options.filters,
			});
			const { data } = await axios.post('/api/leads', body, config);
			if (data.message === 'There are no leads to show') {
				// dispatch({ type: NO_LEAD_RESULTS });
				// dispatch(
				// 	setAlert(
				// 		data.message,
				// 		"Please check that your filters aren't too strict or try refreshing the page",
				// 		'warning'
				// 	)
				// );
				console.log(data.message);
			} else {
				console.log(data);
				return data;
			}
		} catch (error) {
			console.log(error);
		}
	}
);

// export const getLeads = (user, page, filters) => async (dispatch) => {
// 	try {
// 		dispatch({ type: LOADING });
// 		const { _id, lastLoggedIn, role, unviewedLeads } = user;
// 		const body = JSON.stringify({
// 			_id,
// 			lastLoggedIn,
// 			role,
// 			unviewedLeads,
// 			page,
// 			filters,
// 		});
// const { data } = await axios.post('/api/leads', body, config);
// if (data.message === 'There are no leads to show') {
// 	dispatch({ type: NO_LEAD_RESULTS });
// 	dispatch(
// 		setAlert(
// 			data.message,
// 			"Please check that your filters aren't too strict or try refreshing the page",
// 			'warning'
// 		)
// 	);
// } else {
// 	dispatch({
// 		type: GET_LEADS,
// 		payload: {
// 			data,
// 		},
// 	});
// }
// 		return dispatch({ type: FINISHED_LOADING });
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

export const leadsSlice = createSlice({
	name: 'leads',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getFeedLeads.pending, (state) => {
			state.status = 'loading';
		});
		builder.addCase(getFeedLeads.fulfilled, (state, action) => {
			const {
				feed,
				page,
				hasNextPage,
				hasPreviousPage,
				nextPage,
				previousPage,
				totalItems,
				filteredItems,
				lastUpdated,
			} = action.payload;
			state.status = 'idle';
			state.feed.pageByIds = feed;
			state.feed.pagination.page = page;
			state.feed.pagination.hasNextPage = hasNextPage;
			state.feed.pagination.hasPreviousPage = hasPreviousPage;
			state.feed.pagination.nextPage = nextPage;
			state.feed.pagination.previousPage = previousPage;
			state.feed.pagination.totalItems = totalItems;
			state.feed.pagination.filteredItems = filteredItems;
			state.lastUpdated = lastUpdated;
		});
	},
});

export const {} = leadsSlice.actions;

export default leadsSlice.reducer;
