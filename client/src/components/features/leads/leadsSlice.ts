import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import axios from 'axios';

import { User } from '@utils/interfaces/User';
import { Lead } from '@utils/interfaces/Leads/Lead';
import { Pagination } from '@utils/interfaces/Leads/Pagination';
import { config } from '@utils/utils';
import { query } from 'express-validator';

interface LeadState {
	totalByIds: Lead[];
	totalAllIds: string[];
	pageByIds: any;
	pagination: Pagination;
}

interface LeadsState {
	status: 'idle' | 'loading' | 'failed';
	feed: LeadState;
	liked: LeadState;
	archived: LeadState;
	search: any;
	currentLead: Lead | null;
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
	currentLead: null,
	lastUpdated: null,
};

export const addComment = createAsyncThunk(
	'leads/addComment',
	async (
		options: { comment: string; userId: string; leadId: string },
		{ dispatch }
	) => {
		try {
			const { comment, userId, leadId } = options;
			const body = JSON.stringify({ comment, userId, leadId });
			const { data } = await axios.post('/api/leads/add-comment', body, config);
			if (data.message === 'Comment was added') {
				// dispatch({
				//     type: SET_COMMENT,
				//     payload: data.comments,
				// });
				return data.comments;
			} else {
				// dispatch(
				//     setAlert(
				//         'Something went wrong',
				//         "Your comment couldn't be added right now",
				//         'danger'
				//     )
				// );
			}
		} catch (error) {
			console.log(error);
		}
	}
);

export const getAllLeads = createAsyncThunk(
	'leads/getAllLeads',
	async (options, { dispatch }) => {
		console.log(options);
	}
);

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

export const getSearchResults = createAsyncThunk(
	'leads/getSearchResults',
	async (
		options: {
			query: string;
			role: string;
			dateCreated: string;
			page: number;
			newSearch: boolean;
			itemLimit: number;
		},
		{ dispatch }
	) => {
		const { query, role, dateCreated, page, newSearch, itemLimit } = options;
		if (newSearch) {
			// dispatch clear current search
		}
		const body = JSON.stringify({
			q: query,
			role,
			dateCreated,
			page,
			itemLimit,
		});
		const { data } = await axios.post('/api/search', body, config);
		console.log(data);
		return {
			data,
			query,
		};
	}
);

export const handleArchiveLead = createAsyncThunk(
	'leads/handleArchiveLead',
	async (
		options: {
			userId: string;
			leadId: string;
		},
		{ dispatch }
	) => {
		try {
			const { userId, leadId } = options;
			const body = JSON.stringify({ userId, leadId });
			const res = await axios.post(
				'/api/leads/handle-archive-lead',
				body,
				config
			);
			if (res.status === 200) {
				const { message, leads, title } = res.data;
				// dispatch(setAlert(message, truncate(title, 50), 'success'));
				return {
					leadId,
					leads,
				};
			}
		} catch (error) {
			console.log(error);
		}
	}
);

export const handleLikeLead = createAsyncThunk(
	'leads/handleLikeLead',
	async (
		options: {
			userId: string;
			leadId: string;
		},
		{ dispatch }
	) => {
		try {
			const { userId, leadId } = options;
			const body = JSON.stringify({ userId, leadId });
			const res = await axios.post('/api/leads/handle-like-lead', body, config);
			if (res.status === 200) {
				const { message, leads, title } = res.data;
				// dispatch(setAlert(message, truncate(title, 50), 'success'));
				return {
					leadId,
					leads,
				};
			}
		} catch (error) {
			console.log(error);
		}
	}
);

// TODO: Dispatch alerts once alert component is up
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
	reducers: {
		setCurrentLead: (state, action: PayloadAction<Lead>) => {
			state.currentLead = action.payload;
		},
		clearCurrentLead: (state) => {
			state.currentLead = null;
		},
		setPage: (state, action) => {
			console.log(action.payload);
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addComment.fulfilled, (state, action) => {
				console.log(action);
			})
			.addCase(getAllLeads.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(getFeedLeads.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(getFeedLeads.fulfilled, (state, action) => {
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
			})
			.addCase(getSearchResults.pending, (state) => {
				state.search.status = 'loading';
			})
			.addCase(handleArchiveLead.fulfilled, (state, action) => {
				console.log(action);
			})
			.addCase(handleLikeLead.fulfilled, (state, action) => {
				console.log(action);
			});
	},
});

export const { setCurrentLead, clearCurrentLead, setPage } = leadsSlice.actions;

export default leadsSlice.reducer;
