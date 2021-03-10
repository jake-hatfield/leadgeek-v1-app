import {
	GET_LEADS,
	GET_LIKED_LEADS,
	GET_ARCHIVED_LEADS,
	VIEW_LEAD,
	HANDLE_LIKE_LEAD,
	HANDLE_ARCHIVE_LEAD,
	SHOW_DETAILED_LEAD,
	CLEAR_DETAILED_LEAD,
	SET_PAGE,
	SET_ALERT,
} from './types';
import axios from 'axios';
import { setAlert } from './alert';
const queryString = require('query-string');

export const getLeads = (user, page) => async (dispatch) => {
	try {
		const { lastLoggedIn, _id, planId } = user;
		let plan;
		if (planId.includes(process.env.REACT_APP_BUNDLE_PRODUCT_ID)) {
			plan = 'bundle_1';
		} else if (planId.includes(process.env.REACT_APP_PRO_PRODUCT_ID)) {
			plan = 'pro_1';
		} else plan = 'grow_1';
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const body = JSON.stringify({ lastLoggedIn, _id, plan, page });
		const { data } = await axios.post('/api/leads', body, config);
		// const liked = feed.filter((lead) => lead.liked === true);
		dispatch({
			type: GET_LEADS,
			payload: {
				data,
			},
		});
	} catch (error) {
		console.log(error);
	}
};

export const populateLikedLeads = (leads) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const body = JSON.stringify(leads);
		const { data } = await axios.post('/api/leads/liked', body, config);
		dispatch({
			type: GET_LIKED_LEADS,
			payload: data.likedLeads,
		});
	} catch (error) {
		console.log(error);
	}
};

export const populateArchivedLeads = (leads) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const body = JSON.stringify(leads);
		const { data } = await axios.post('/api/leads/archived', body, config);
		dispatch({
			type: GET_ARCHIVED_LEADS,
			payload: data.archivedLeads,
		});
	} catch (error) {
		console.log(error);
	}
};

export const handleLikeLead = (userId, leadId) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const body = JSON.stringify({ userId, leadId });
		const res = await axios.post('/api/leads/handle-like-lead', body, config);
		if (res.status === 200) {
			let message = res.data.msg;
			dispatch(setAlert(message, 'success'));
			dispatch({
				type: HANDLE_LIKE_LEAD,
				payload: res.data.leads,
			});
		}
	} catch (error) {
		console.error(error);
	}
};

export const handleArchiveLead = (userId, leadId) => async (dispatch) => {
	try {
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const body = JSON.stringify({ userId, leadId });
		const res = await axios.post(
			'/api/leads/handle-archive-lead',
			body,
			config
		);
		if (res.status === 200) {
			let message = res.data.msg;
			dispatch(setAlert(message, 'success'));
			dispatch({
				type: HANDLE_ARCHIVE_LEAD,
				payload: res.data.leads,
			});
		}
	} catch (error) {
		console.error(error);
	}
};

export const viewLead = (leadId) => (dispatch) => {
	try {
		dispatch({
			type: VIEW_LEAD,
			payload: { id: leadId },
		});
	} catch (error) {
		console.log(error);
	}
};

export const showDetailedLead = (leadId) => (dispatch) => {
	try {
		const path = window.location.pathname;
		const arrayType = path.replace(/\//, '');
		dispatch({
			type: SHOW_DETAILED_LEAD,
			payload: { id: leadId, array: arrayType },
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
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const body = JSON.stringify({ lead });
		const res = await axios.post('/api/leads/export', body, config);
		console.log(res.data);
	} catch (error) {
		console.log(error);
	}
};
