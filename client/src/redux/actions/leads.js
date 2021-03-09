import {
	GET_LEADS,
	GET_LIKED_LEADS,
	VIEW_LEAD,
	HANDLE_LIKE_LEAD,
	SHOW_DETAILED_LEAD,
	CLEAR_DETAILED_LEAD,
	SET_ALERT,
} from './types';
import axios from 'axios';
import { setAlert } from './alert';

export const getLeads = (lastLoggedIn, planId) => async (dispatch) => {
	try {
		const { data } = await axios.get('/api/leads');
		const feedArray = data.feed;
		const unviewed = feedArray.filter((lead) => lead.data.date >= lastLoggedIn);
		const liked = feedArray.filter((lead) => lead.liked === true);
		dispatch({
			type: GET_LEADS,
			payload: { feedArray, unviewed, liked },
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
		dispatch({
			type: SHOW_DETAILED_LEAD,
			payload: { id: leadId },
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
				title: 'Glarbie',
				monthlySales: 214.0,
			},
			plan: 'bundle_1',
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
