import {
	GET_LEADS,
	GET_LIKED_LEADS,
	GET_ARCHIVED_LEADS,
	VIEW_LEAD,
	HANDLE_LIKE_LEAD,
	HANDLE_ARCHIVE_LEAD,
	SET_CURRENT_LEAD,
	CLEAR_DETAILED_LEAD,
	SET_PAGE,
	LOADING,
	FINISHED_LOADING,
} from './types';
import axios from 'axios';
import { setAlert } from './alert';

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
			console.log(data);
			dispatch(setAlert(data, 'success'));
		} else {
			dispatch(setAlert(data, 'danger'));
		}
	} catch (error) {
		console.log(error);
	}
};

export const getLeads = (user, page) => async (dispatch) => {
	try {
		dispatch({ type: LOADING });
		const { _id, lastLoggedIn, planId, unviewedLeads } = user;
		let plan;
		if (planId.includes(process.env.REACT_APP_BUNDLE_PRODUCT_ID)) {
			plan = 'bundle_1';
		} else if (planId.includes(process.env.REACT_APP_PRO_PRODUCT_ID)) {
			plan = 'pro_1';
		} else plan = 'grow_1';
		const body = JSON.stringify({
			_id,
			lastLoggedIn,
			plan,
			unviewedLeads,
			page,
		});
		const { data } = await axios.post('/api/leads', body, config);
		if (data.message === 'There are no leads to show.') {
			dispatch(setAlert(data.message, 'warning'));
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

export const populateLikedLeads = (leads, page) => async (dispatch) => {
	try {
		dispatch({ type: LOADING });
		const body = JSON.stringify({ leads, page });
		const { data } = await axios.post('/api/leads/liked', body, config);
		if (data.message === 'You have not liked any leads.') {
			dispatch(setAlert(data.message, 'warning'));
		} else {
			dispatch({
				type: GET_LIKED_LEADS,
				payload: data,
			});
		}
		dispatch({ type: FINISHED_LOADING });
	} catch (error) {
		console.log(error);
	}
};

export const populateArchivedLeads = (leads, page) => async (dispatch) => {
	try {
		dispatch({ type: LOADING });
		const body = JSON.stringify({ leads, page });
		const { data } = await axios.post('/api/leads/archived', body, config);
		if (data.message === 'You have not archived any leads.') {
			dispatch(setAlert(data.message, 'warning'));
		} else {
			dispatch({
				type: GET_ARCHIVED_LEADS,
				payload: data,
			});
		}
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
			const { msg, leads } = res.data;
			dispatch(setAlert(msg, 'success'));
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
			const { msg, leads } = res.data;
			dispatch(setAlert(msg, 'success'));
			dispatch({
				type: HANDLE_ARCHIVE_LEAD,
				payload: { leadId, leads },
			});
		}
	} catch (error) {
		console.error(error);
	}
};

export const viewLead = (userId, leadId) => async (dispatch) => {
	try {
		const body = JSON.stringify({ userId, leadId });
		const res = await axios.post('/api/leads/view', body, config);
		dispatch({
			type: VIEW_LEAD,
			payload: res.data,
		});
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

export const clearDetailedLead = () => (dispatch) => {
	try {
		dispatch({
			type: CLEAR_DETAILED_LEAD,
		});
	} catch (error) {
		console.log(error);
	}
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
