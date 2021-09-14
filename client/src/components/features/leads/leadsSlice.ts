import axios from 'axios';

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setAlert } from '@features/alert/alertSlice';

import { FilterState } from '@utils/interfaces/Filter';
import { Lead } from '@utils/interfaces/leads/Lead';
import { Pagination } from '@utils/interfaces/leads/Pagination';
import { config, truncate } from '@utils/utils';

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
				return data.comments;
			} else {
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
	async (options: { role: string; dateCreated: string }, { dispatch }) => {
		const { role, dateCreated } = options;
		const body = JSON.stringify({
			role,
			dateCreated,
		});
		const { data } = await axios.post('/api/leads/all', body, config);
		return data;
	}
);

export const getArchivedLeads = createAsyncThunk(
	'leads/getArchivedLeads',
	async (
		options: { leads: Lead[]; page: number; itemLimit: number },
		{ rejectWithValue }
	) => {
		try {
			const { leads, page, itemLimit } = options;
			const body = JSON.stringify({ leads, page, itemLimit });
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
			user: {
				id: string;
				role: string;
			};
			page: number;
			filters: FilterState;
		},
		{ rejectWithValue }
	) => {
		try {
			const { id, role } = options.user;
			const body = JSON.stringify({
				_id: id,
				role,
				page: options.page,
				filters: options.filters,
			});
			const { data } = await axios.post('/api/leads', body, config);
			if (data.message === 'There are no leads to show') {
			} else {
				return data;
			}
		} catch (error) {
			console.log(error);
			return rejectWithValue(error);
		}
	}
);

export const getLikedLeads = createAsyncThunk(
	'leads/getLikedLeads',
	async (
		options: { leads: Lead[]; page: number; filters: FilterState },
		{ rejectWithValue }
	) => {
		try {
			const { leads, page, filters } = options;
			const body = JSON.stringify({ leads, page, filters });
			const { data } = await axios.post('/api/leads/liked', body, config);
			console.log(data);
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
			query: string;
			role: string;
			dateCreated: string;
			page: number;
			newSearch: boolean;
			itemLimit: number;
		},
		{ dispatch }
	) => {
		const { query, role, dateCreated, page, itemLimit } = options;

		const body = JSON.stringify({
			query,
			role,
			dateCreated,
			page,
			itemLimit,
		});
		const { data } = await axios.post('/api/search', body, config);
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
	};
	currentLead: Lead | null;
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
	},
	currentLead: null,
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
		setLeadLoading: (state) => {
			state.status = 'loading';
		},
		setPage: (state, action: PayloadAction<{ page: number; type: string }>) => {
			const { page, type } = action.payload;
			switch (type) {
				case 'feed':
					state.feed.pagination.page = page;
					break;
				case 'liked':
					state.liked.pagination.page = page;
					break;
				case 'archived':
					state.archived.pagination.page = page;
					break;
				case 'search':
					state.archived.pagination.page = page;
					break;
				default:
					break;
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAllLeads.fulfilled, (state, action) => {
				state.feed.totalByIds = action.payload.feed;
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
			});
	},
});

export const { setCurrentLead, clearCurrentLead, setLeadLoading, setPage } =
	leadsSlice.actions;

export default leadsSlice.reducer;
