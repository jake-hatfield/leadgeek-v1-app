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
		dispatch({
			type: GET_LEADS,
			payload: {
				data,
			},
		});
		dispatch({ type: FINISHED_LOADING });
	} catch (error) {
		console.log(error);
	}
};

export const populateLikedLeads = (leads) => async (dispatch) => {
	try {
		dispatch({ type: LOADING });
		const body = JSON.stringify(leads);
		const {
			data: { message, likedLeads },
		} = await axios.post('/api/leads/liked', body, config);
		if (message === 'You have not liked any leads.') {
			dispatch(setAlert(message, 'warning'));
		} else {
			dispatch({
				type: GET_LIKED_LEADS,
				payload: likedLeads,
			});
		}
		dispatch({ type: FINISHED_LOADING });
	} catch (error) {
		console.log(error);
	}
};

export const populateArchivedLeads = (leads) => async (dispatch) => {
	try {
		dispatch({ type: LOADING });
		const body = JSON.stringify(leads);
		const {
			data: { message, archivedLeads },
		} = await axios.post('/api/leads/archived', body, config);
		if (message === 'You have not archived any leads.') {
			dispatch(setAlert(message, 'warning'));
		} else {
			dispatch({
				type: GET_ARCHIVED_LEADS,
				payload: archivedLeads,
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
		console.log(res.data);
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

export const setPage = (page) => (dispatch) => {
	try {
		dispatch({
			type: SET_PAGE,
			payload: page,
		});
	} catch (error) {
		console.log(error);
	}
};

export const exportLead = () => async (dispatch) => {
	try {
		const lead = {
			data: {
				source: 'Target',
				bsr30: 1903.0,
				cashback: '',
				shipping: 'Free shipping on $35+',
				roi: 0.4803001876172608,
				asin: '6026ec8b537dbb177eddd8e0',
				competitors: 'MF',
				brand: 'Barbie',
				date: Date.now(),
				retailerLink:
					'http://www.target.com/p/,barbie-fizzy-bath-brunette-doll-and-playset/-/...',
				variations: '',
				buyPrice: 15.99,
				category: 'Toys & Games',
				promo: '-',
				bsr90: 1684.0,
				amzLink: 'https://amazon.com/dp/B07XB3JL3Y/',
				bsrCurrent: 5341.0,
				sellPrice: 36.0,
				notes: '',
				netProfit: 7.68,
				weight: 1.4,
				title: 'Schmarbie',
				monthlySales: 214.0,
			},
			plan: 'pro_1',
		};
		const body = JSON.stringify({ lead });
		const { data } = await axios.post('/api/leads/export', body, config);
		console.log(data);
	} catch (error) {
		console.log(error);
	}
};
