import axios from 'axios';

// redux
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setAlert } from '@features/alert/alertSlice';

// interfaces
import { FilterState } from '@utils/interfaces/Filter';
import { Lead, LeadTypes } from '@utils/interfaces/Lead';
import { Pagination } from '@utils/interfaces/Pagination';

// utils
import { config, truncate } from '@utils/utils';
import { setItemLimit } from '../filters/filtersSlice';

export const addComment = createAsyncThunk(
	'leads/addComment',
	async (
		options: { comment: string; userId: string; leadId: string },
		{ dispatch }
	) => {
		try {
			// destructure necessary items
			const { comment, userId, leadId } = options;

			// build request body
			const body = JSON.stringify({ comment, userId, leadId });

			// POST request to route
			const { data } = await axios.post('/api/leads/comment', body, config);

			if (data.message === 'Comment was added') {
				return data.comments;
			} else {
				// dispatch danger alert
				dispatch(
					setAlert({
						title: 'Something went wrong',
						message: "Your comment couldn't be added right now",
						alertType: 'danger',
					})
				);
			}
		} catch (error) {
			console.log(error);
		}
	}
);

export const getAllLeads = createAsyncThunk(
	'leads/getAllLeads',
	async (
		options: {
			userId: string;
			filters: FilterState;
			type: LeadTypes;
			query: string | null;
		},
		{ dispatch }
	) => {
		// destructure necessary items
		const { userId, filters, type, query } = options;

		// build request body
		const body = JSON.stringify({
			userId,
			filters,
			type,
			query: query,
		});

		// POST request to route
		const {
			data,
		}: { data: { totalByIds: Lead[]; type: LeadTypes; message: string } } =
			await axios.post('/api/leads/all', body, config);

		if (data.totalByIds.length > 0) {
			dispatch(
				setAlert({
					title: 'Data ready for export',
					message: 'Please click "confirm" to save as a .csv file',
					alertType: 'success',
				})
			);
		}

		return { totalByIds: data.totalByIds, type: data.type };
	}
);

export const getArchivedLeads = createAsyncThunk(
	'leads/getArchivedLeads',
	async (
		options: { leads: { _id: string }[]; page: number; filters: FilterState },
		{ rejectWithValue }
	) => {
		try {
			// destructure necessary items
			const { leads, page, filters } = options;

			// build request body
			const body = JSON.stringify({ leads, page, filters });

			// POST request to route
			const { data } = await axios.post('/api/leads/archived', body, config);

			return data;
		} catch (error) {
			console.log(error);
			return rejectWithValue(error);
		}
	}
);

export const getFeedLeads = createAsyncThunk(
	'leads/getFeedLeads',
	async (
		options: {
			page: number;
			filters: FilterState;
		},
		{ rejectWithValue }
	) => {
		try {
			// destructure necessary items
			const { page, filters } = options;

			console.log(filters);

			// build request body
			const body = JSON.stringify({
				page,
				filters,
			});

			// POST request to route
			const { data } = await axios.post<{
				feed: Lead[];
				page: number;
				hasNextPage: boolean;
				hasPreviousPage: boolean;
				nextPage: number;
				previousPage: number;
				lastPage: number | null;
				totalItems: number;
				filteredItems: number;
				lastUpdated: string | null;
			}>('/api/leads', body, config);

			// return data to redux store
			return data;
		} catch (error) {
			console.log(error);
			return rejectWithValue(error);
		}
	}
);

export const getLikedLeads = createAsyncThunk(
	'leads/getLikedLeads',
	async (
		options: { leads: { _id: string }[]; page: number; filters: FilterState },
		{ rejectWithValue }
	) => {
		try {
			// destructure necessary items
			const { leads, page, filters } = options;

			// build request body
			const body = JSON.stringify({ leads, page, filters });

			// POST request to route
			const { data } = await axios.post('/api/leads/liked', body, config);

			return data;
		} catch (error) {
			console.log(error);
			return rejectWithValue(error);
		}
	}
);

export const getSearchResults = createAsyncThunk(
	'leads/getSearchResults',
	async (
		options: {
			userId: string;
			query: string | null;
			page: number;
			filters: FilterState;
		},
		{ rejectWithValue }
	) => {
		try {
			// destructure necessary items
			const { userId, query, page, filters } = options;

			// handle navigation to the search page directly without a query
			if (!query) {
				return {
					data: {
						leads: [],
						page: 1,
						hasNextPage: false,
						hasPreviousPage: false,
						nextPage: 2,
						previousPage: 0,
						totalItems: 0,
					},
					query,
				};
			}

			// build request body
			const body = JSON.stringify({
				userId,
				query,
				page,
				filters,
			});

			// POST request to route
			const { data } = await axios.post('/api/leads/search', body, config);

			return {
				data,
				query,
			};
		} catch (error) {
			console.log(error);
			return rejectWithValue(error);
		}
	}
);

export const handleArchiveLead = createAsyncThunk(
	'leads/handleArchiveLead',
	async (
		options: {
			leadId: string;
		},
		{ dispatch }
	) => {
		try {
			// destructure necessary items
			const { leadId } = options;

			// POST request to route
			const res = await axios.post(`/api/leads/archive/${leadId}`);

			if (res.status === 200) {
				// destructure necessary items
				const { message, leads, title } = res.data;

				// set success alert
				dispatch(
					setAlert({
						title: truncate(title, 50),
						message,
						alertType: 'success',
					})
				);

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
			leadId: string;
		},
		{ dispatch }
	) => {
		try {
			// destructure necessary items
			const { leadId } = options;

			// POST request to route
			const res = await axios.post<{
				title: 'Lead was unliked' | 'Lead was liked' | 'Error';
				message: string;
				leads: { _id: string }[];
			}>(`/api/leads/like/${leadId}`);

			if (res.status === 200) {
				// destructure necessary items
				const { message, leads, title } = res.data;

				// set success alert
				dispatch(
					setAlert({
						title: truncate(title, 50),
						message,
						alertType: 'success',
					})
				);

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

interface LeadState {
	totalByIds: Lead[];
	totalAllIds: string[];
	pageByIds: Lead[];
	pagination: Pagination;
}

interface LeadsState {
	status: 'idle' | 'loading' | 'failed';
	feed: LeadState;
	liked: LeadState;
	archived: LeadState;
	search: {
		totalByIds: Lead[];
		totalAllIds: string[];
		pageByIds: Lead[];
		pagination: Pagination;
		searchValue: string | null;
		newSearch: boolean;
	};
	currentLead: Lead | null;
	currentLeadStatus: 'idle' | 'loading' | 'failed';
	lastUpdated: string | null;
}

const initialState: LeadsState = {
	status: 'loading',
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
			filteredItems: null,
		},
		searchValue: null,
		newSearch: false,
	},
	currentLead: null,
	currentLeadStatus: 'loading',
	lastUpdated: null,
};

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
		setLeadIdle: (state) => {
			state.status = 'idle';
		},
		setLeadLoading: (state) => {
			state.status = 'loading';
		},
		setPage: (
			state,
			action: PayloadAction<{
				page: number;
				type: LeadTypes;
			}>
		) => {
			// destructure necessary items
			const { page, type } = action.payload;

			state[type].pagination.page = page;
		},
		setSearchValue: (state, action) => {
			state.search.newSearch = true;
			state.search.searchValue = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAllLeads.fulfilled, (state, action) => {
				// destructure necessary items
				const {
					totalByIds,
					type,
				}: {
					totalByIds: Lead[];
					type: LeadTypes;
				} = action.payload;

				// if state type doesn't exist, set it to an empty array
				if (!state[type].totalByIds) {
					state[type].totalByIds = [];
				}

				// otherwise update the total leads in the state with the new payload
				state[type].totalByIds = totalByIds;
			})
			.addCase(getArchivedLeads.fulfilled, (state, action) => {
				const {
					archivedLeads,
					page,
					hasNextPage,
					hasPreviousPage,
					nextPage,
					previousPage,
					totalItems,
				} = action.payload;
				state.status = 'idle';
				state.archived.pageByIds = archivedLeads;
				state.archived.pagination.page = page;
				state.archived.pagination.hasNextPage = hasNextPage;
				state.archived.pagination.hasPreviousPage = hasPreviousPage;
				state.archived.pagination.nextPage = nextPage;
				state.archived.pagination.previousPage = previousPage;
				state.archived.pagination.totalItems = totalItems;
			})
			.addCase(getArchivedLeads.rejected, (state) => {
				state.status = 'failed';
			})
			.addCase(getFeedLeads.pending, (state) => {
				state.status = 'loading';
				state.currentLeadStatus = 'loading';
			})
			.addCase(getFeedLeads.fulfilled, (state, action) => {
				const {
					feed,
					page,
					hasNextPage,
					hasPreviousPage,
					nextPage,
					previousPage,
					lastPage,
					totalItems,
					filteredItems,
					lastUpdated,
				} = action.payload;
				state.status = 'idle';
				state.currentLeadStatus = 'idle';
				state.feed.pageByIds = feed;
				state.feed.pagination.page = page;
				state.feed.pagination.hasNextPage = hasNextPage;
				state.feed.pagination.hasPreviousPage = hasPreviousPage;
				state.feed.pagination.nextPage = nextPage;
				state.feed.pagination.previousPage = previousPage;
				state.feed.pagination.lastPage = lastPage;
				state.feed.pagination.totalItems = totalItems;
				state.feed.pagination.filteredItems = filteredItems;
				state.lastUpdated = lastUpdated;
			})
			.addCase(getFeedLeads.rejected, (state) => {
				state.status = 'failed';
			})
			.addCase(getLikedLeads.fulfilled, (state, action) => {
				const {
					likedLeads,
					page,
					hasNextPage,
					hasPreviousPage,
					nextPage,
					previousPage,
					totalItems,
				} = action.payload;
				state.status = 'idle';
				state.liked.pageByIds = likedLeads;
				state.liked.pagination.page = page;
				state.liked.pagination.hasNextPage = hasNextPage;
				state.liked.pagination.hasPreviousPage = hasPreviousPage;
				state.liked.pagination.nextPage = nextPage;
				state.liked.pagination.previousPage = previousPage;
				state.liked.pagination.totalItems = totalItems;
			})
			.addCase(getLikedLeads.rejected, (state) => {
				state.status = 'failed';
			})
			.addCase(getSearchResults.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(getSearchResults.fulfilled, (state, action) => {
				const {
					data: {
						leads,
						page,
						hasNextPage,
						hasPreviousPage,
						nextPage,
						previousPage,
						totalItems,
					},
					query,
				} = action.payload;
				state.status = 'idle';
				state.search.pageByIds = leads;
				state.search.pagination.page = page;
				state.search.pagination.page = page;
				state.search.pagination.hasNextPage = hasNextPage;
				state.search.pagination.hasPreviousPage = hasPreviousPage;
				state.search.pagination.nextPage = nextPage;
				state.search.pagination.previousPage = previousPage;
				state.search.pagination.totalItems = totalItems;
				state.search.searchValue = query;
				state.search.newSearch = false;
			})
			.addCase(getSearchResults.rejected, (state) => {
				state.status = 'failed';
			})
			.addCase(handleArchiveLead.fulfilled, (state, action) => {
				const newArchived = state.archived.pageByIds.filter(
					(lead) => lead._id !== action.payload?.leadId
				);
				state.archived.pageByIds = newArchived;
			})
			.addCase(handleLikeLead.fulfilled, (state, action) => {
				const newLiked = state.liked.pageByIds.filter(
					(lead) => lead._id !== action.payload?.leadId
				);
				state.liked.pageByIds = newLiked;
			})
			.addCase(
				setItemLimit.fulfilled,
				(
					state,
					action: PayloadAction<{ type: LeadTypes; itemLimit: number }>
				) => {
					const { type } = action.payload;
					state[type].pagination.page = 1;
				}
			);
	},
});

export const {
	setCurrentLead,
	clearCurrentLead,
	setLeadIdle,
	setLeadLoading,
	setPage,
	setSearchValue,
} = leadsSlice.actions;

export default leadsSlice.reducer;
