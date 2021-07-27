import axios from 'axios';
import {
	GET_ALL_USERS,
	SET_PAGE,
	SET_PLAN,
	SET_BILLING_PAYMENTS,
	LOADING,
	FINISHED_LOADING,
	FINISHED_PLAN_LOADING,
	SET_AFFILIATE_PAYMENTS,
	FINISHED_BILLING_PAYMENTS_LOADING,
	FINISHED_AFFILIATE_PAYMENTS_LOADING,
} from './types';
import { setAlert } from './alert';

const config = {
	headers: {
		'Content-Type': 'application/json',
	},
};

// Get all users (ADMIN)
export const getAllUsers = (page, itemLimit) => async (dispatch) => {
	dispatch({ type: LOADING });
	const body = JSON.stringify({ page, itemLimit });
	const { data } = await axios.post('/api/users/get-all-users', body, config);
	if (data.users.length > 0) {
		dispatch({
			type: GET_ALL_USERS,
			payload: { data },
		});
	} else {
		dispatch(
			setAlert(
				'Something went wrong',
				'There was an error retreiving users.',
				'danger'
			)
		);
		dispatch({ type: FINISHED_LOADING });
	}
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

// Get all successful payments
export const getSuccessfulPayments = (cusId) => async (dispatch) => {
	try {
		dispatch({ type: LOADING });
		const body = JSON.stringify({ cusId });
		const { data } = await axios.post(
			'/api/users/get-successful-payments/',
			body,
			config
		);
		dispatch({
			type: SET_BILLING_PAYMENTS,
			payload: data.payments,
		});
	} catch (error) {
		console.log(error);
	}
};

// Get the user's active plan details
export const getActivePlanDetails = (subIds) => async (dispatch) => {
	try {
		const body = JSON.stringify({ subIds });
		const {
			data: { msg: message, subscription },
		} = await axios.post('/api/users/get-active-plan-details', body, config);
		if (message === 'Subscription data found') {
			dispatch({
				type: SET_PLAN,
				payload: subscription,
			});
		} else {
			dispatch({
				type: FINISHED_PLAN_LOADING,
			});
		}
	} catch (error) {
		console.log(error);
	}
};

export const getAffiliatePayments = (lgid, affCreated) => async (dispatch) => {
	try {
		const body = JSON.stringify({ lgid, affCreated });
		const {
			data: { msg: message, affPayments },
		} = await axios.post('/api/users/get-affiliate-payments', body, config);
		if (message === 'Referred clients with valid payments were found.') {
			dispatch({
				type: SET_AFFILIATE_PAYMENTS,
				payload: affPayments,
			});
		} else {
			dispatch({
				type: FINISHED_AFFILIATE_PAYMENTS_LOADING,
			});
		}
	} catch (error) {
		console.log(error);
	}
};
