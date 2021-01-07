import axios from 'axios';
import { setAlert } from './alert';
import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	USER_LOADED,
	AUTH_ERROR,
	CLEAR_PROFILE,
	FORGOT_PASSWORD,
	RESET_PASSWORD,
	UPDATE_PASSWORD,
} from './types';

// load user
export const loadUser = () => async (dispatch) => {
	try {
		const res = await axios.get('/api/auth');
		dispatch({
			type: USER_LOADED,
			payload: res.data,
		});
	} catch (error) {
		dispatch({
			type: AUTH_ERROR,
		});
	}
};

// register user
export const register = ({ name, email, password }) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const body = JSON.stringify({ name, email, password });

	try {
		const res = await axios.post('/api/users', body, config);
		dispatch({
			type: REGISTER_SUCCESS,
			payload: res.data,
		});
		dispatch(loadUser());
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: REGISTER_FAIL,
		});
	}
};

// login user
export const login = (email, password) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};

	const body = JSON.stringify({ email, password });

	try {
		const res = await axios.post('/api/auth', body, config);
		dispatch({
			type: LOGIN_SUCCESS,
			payload: res.data,
		});

		dispatch(loadUser());
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}
		dispatch({
			type: LOGIN_FAIL,
		});
	}
};

// logout & clear the profile
export const logout = () => (dispatch) => {
	dispatch({
		type: CLEAR_PROFILE,
	});
	dispatch({
		type: LOGOUT,
	});
};

// forgot password
export const forgotPassword = (email) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	const body = JSON.stringify({ email });
	try {
		const res = await axios.post('/api/users/forgotPassword', body, config);
		dispatch(
			setAlert(
				'Email successfuly sent! Please also check your spam folder.',
				'success'
			)
		);
	} catch (error) {
		const errorMsg = error.response.data;
		if (errorMsg == 'Email not found in database') {
			dispatch(
				setAlert(
					'Email successfuly sent! Please also check your spam folder.',
					'success'
				)
			);
		} else {
			dispatch(
				setAlert(
					'Email could not be sent, please contact LeadGeek support.',
					'danger'
				)
			);
		}
	}
};

// reset password validation
export const resetPassword = (email) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	const body = JSON.stringify({ email });
	try {
		const res = await axios.get('/api/users/forgotPassword', body, config);
		dispatch({
			type: RESET_PASSWORD,
			payload: res.data,
		});
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}
	}
};

export const updatePassword = (email, password) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	const body = JSON.stringify({ email, password });
	try {
		axios.put('/api/users/updatePassword', body, config).then((res) => {
			console.log(res.data);
			if (res.data.message === 'Password successfully updated') {
				dispatch(setAlert('Password successfully updated', 'success'));
			} else {
				dispatch(setAlert("Password couldn't be updated", 'danger'));
			}
		});
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}
	}
};
