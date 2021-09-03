import {
	GET_LEADS,
	GET_ALL_LEADS,
	GET_LIKED_LEADS,
	GET_ARCHIVED_LEADS,
	NO_LEAD_RESULTS,
	VIEW_LEAD,
	HANDLE_LIKE_LEAD,
	HANDLE_ARCHIVE_LEAD,
	SET_COMMENT,
	SET_CURRENT_LEAD,
	CLEAR_CURRENT_LEAD,
	SET_PAGE,
	LOADING,
	FINISHED_LOADING,
	SET_SEARCH_RESULTS,
	CLEAR_CURRENT_SEARCH,
} from './types';

import axios from 'axios';

import { setAlert } from '@features/alert/alertSlice';
import { truncate } from '@utils/utils';

// application/json config object
const config = {
	headers: {
		'Content-Type': 'application/json',
	},
};

export const exportLeads = () => async (dispatch) => {
	try {
		const { data } = await axios.get('/api/leads/export');
		console.log(data);
		if (data === 'Leads were added to the database.') {
			await axios.post(
				'https://api.netlify.com/build_hooks/60f1da8987d39d7d6bceae55'
			);
			dispatch(setAlert('Upload success', data, 'success'));
		} else {
			let message =
				'See error code in the console or check Google Sheets for duplicate/missing attributes.';
			dispatch(setAlert('Error uploading leads', message, 'danger'));
		}
	} catch (error) {
		console.log(error);
	}
};

export const getLeads = (user, page, filters) => async (dispatch) => {
	try {
		dispatch({ type: LOADING });
		const { _id, lastLoggedIn, role, unviewedLeads } = user;
		const body = JSON.stringify({
			_id,
			lastLoggedIn,
			role,
			unviewedLeads,
			page,
			filters,
		});
		const { data } = await axios.post('/api/leads', body, config);
		if (data.message === 'There are no leads to show') {
			dispatch({ type: NO_LEAD_RESULTS });
			dispatch(
				setAlert(
					data.message,
					"Please check that your filters aren't too strict or try refreshing the page",
					'warning'
				)
			);
		} else {
			dispatch({
				type: GET_LEADS,
				payload: {
					data,
				},
			});
		}
		return dispatch({ type: FINISHED_LOADING });
	} catch (error) {
		console.log(error);
	}
};

export const getAllLeads = (user) => async (dispatch) => {
	try {
		const { role, dateCreated } = user;
		const body = JSON.stringify({
			role,
			dateCreated,
		});
		const { data } = await axios.post('/api/leads/all', body, config);
		if (data.message === 'There are no leads to show') {
			dispatch(
				setAlert(
					data.message,
					"Please check that your filters aren't too strict or try refreshing the page",
					'warning'
				)
			);
		} else {
			dispatch({
				type: GET_ALL_LEADS,
				payload: {
					data,
				},
			});
		}
	} catch (error) {
		console.log(error);
	}
};

export const getLikedLeads = (leads, page, itemLimit) => async (dispatch) => {
	try {
		dispatch({ type: LOADING });
		const body = JSON.stringify({ leads, page, itemLimit });
		const { data } = await axios.post('/api/leads/liked', body, config);
		dispatch({
			type: GET_LIKED_LEADS,
			payload: { data },
		});
		dispatch({ type: FINISHED_LOADING });
	} catch (error) {
		console.log(error);
	}
};

export const getArchivedLeads =
	(leads, page, itemLimit) => async (dispatch) => {
		try {
			dispatch({ type: LOADING });
			const body = JSON.stringify({ leads, page, itemLimit });
			const { data } = await axios.post('/api/leads/archived', body, config);
			dispatch({
				type: GET_ARCHIVED_LEADS,
				payload: { data },
			});
			dispatch({ type: FINISHED_LOADING });
		} catch (error) {
			console.log(error);
		}
	};

export const handleLikeLead = (userId, leadId) => async (dispatch) => {
	try {
		const body = JSON.stringify({ userId, leadId });
		const res = await axios.post('/api/leads/handle-like-lead', body, config);
		if (res.status === 200) {
			const { message, leads, title } = res.data;
			dispatch(setAlert(message, truncate(title, 50), 'success'));
			dispatch({
				type: HANDLE_LIKE_LEAD,
				payload: { leadId, leads },
			});
		}
	} catch (error) {
		console.error(error);
	}
};

export const handleArchiveLead = (userId, leadId) => async (dispatch) => {
	try {
		const body = JSON.stringify({ userId, leadId });
		const res = await axios.post(
			'/api/leads/handle-archive-lead',
			body,
			config
		);
		if (res.status === 200) {
			const { message, leads, title } = res.data;
			dispatch(setAlert(message, truncate(title, 80), 'success'));
			dispatch({
				type: HANDLE_ARCHIVE_LEAD,
				payload: { leadId, leads },
			});
		}
	} catch (error) {
		console.error(error);
	}
};

export const addComment = (comment, userId, leadId) => async (dispatch) => {
	try {
		const body = JSON.stringify({ comment, userId, leadId });
		const { data } = await axios.post('/api/leads/add-comment', body, config);
		console.log(data.message);
		if (data.message === 'Comment was added') {
			dispatch({
				type: SET_COMMENT,
				payload: data.comments,
			});
		} else {
			dispatch(
				setAlert(
					'Something went wrong',
					"Your comment couldn't be added right now",
					'danger'
				)
			);
		}
	} catch (error) {
		console.log(error);
	}
};

export const setCurrentLead = (lead) => (dispatch) => {
	try {
		dispatch({
			type: SET_CURRENT_LEAD,
			payload: lead,
		});
	} catch (error) {
		console.log(error);
	}
};

export const clearCurrentLead = () => (dispatch) => {
	try {
		dispatch({
			type: CLEAR_CURRENT_LEAD,
		});
	} catch (error) {
		console.log(error);
	}
};

export const getSearchResults =
	(q, role, dateCreated, page, newSearch, itemLimit) => async (dispatch) => {
		dispatch({ type: LOADING });
		if (newSearch) {
			dispatch({ type: CLEAR_CURRENT_SEARCH });
		}
		const body = JSON.stringify({ q, role, dateCreated, page, itemLimit });
		const { data } = await axios.post('/api/search', body, config);
		dispatch({
			type: SET_SEARCH_RESULTS,
			payload: { data, q },
		});
		return dispatch({ type: FINISHED_LOADING });
	};

export const setPage = (page, type) => (dispatch) => {
	try {
		dispatch({
			type: SET_PAGE,
			payload: { page, type },
		});
	} catch (error) {
		console.log(error);
	}
};

export const setItemLimit = (itemLimit) => async (dispatch) => {
	if (itemLimit) {
	}
};

export const setLoading = () => async (dispatch) => {
	try {
		dispatch({ type: LOADING });
	} catch (error) {
		console.log(error);
	}
};
