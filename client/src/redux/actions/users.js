import axios from 'axios';
import {
	GET_ALL_USERS,
	SET_PAGE,
	SET_PAYMENTS,
	LOADING,
	FINISHED_LOADING,
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
export const getSuccessfulPayments = () => async (dispatch) => {
	try {
		dispatch({ type: LOADING });
		const { data } = await axios.get('/api/users/get-successful-payments/');

		dispatch({
			type: SET_PAYMENTS,
			payload: data.payments,
		});
	} catch (error) {
		console.log(error);
	}
};
