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
	CHECK_RESET_PASSWORD_TOKEN,
	SET_RESET_PASSWORD_TOKEN,
	REMOVE_RESET_PASSWORD_TOKEN,
} from './types';
import { setResetPasswordToken, setStripeToken } from '../../utils/authTokens';

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

// check for an active stripe subscription
// export const getStripeSubscription = (email) => async (dispatch) => {
// 	const config = {
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 	};
// 	const body = JSON.stringify({ email });

// 	try {
// 		const res = await axios.post(
// 			'/api/auth/getStripeSubscriptions',
// 			body,
// 			config
// 		);
// 		console.log(res.data);
// 		if (res.data.msg === 'Customer found') {
// 			dispatch({
// 				type: GET_STRIPE_SUBSCRIPTION,
// 				payload: res.data.activeSubscriptions,
// 			});
// 			dispatch({
// 				type: GET_PAYMENT_DETAILS,
// 				payload: res.data.paymentMethodId,
// 			});
// 			setStripeToken('active');
// 		} else {
// 			console.log(res.data.msg);
// 		}
// 	} catch (error) {
// 		const errors = error.response.data.errors;
// 		if (errors) {
// 			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
// 		}
// 	}
// };

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
		if (res.data.msg === 'Password recovery email sent successfully') {
			dispatch(
				setAlert(
					`An email has been sent to ${email} if an account is associated. Please also check your spam folder.`,
					'success'
				)
			);
			const { token } = res.data;
			setResetPasswordToken(token);
		}
	} catch (error) {
		// make sure people can't guess user's password by trial and error
		const errorMsg = error.response.data;
		if (errorMsg === 'Email not found in database') {
			dispatch(
				setAlert(
					`An email has been sent to ${email} if an account is associated. Please also check your spam folder.`,
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
export const resetPasswordValidation = (resetPasswordToken) => async (
	dispatch
) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	const body = JSON.stringify({ resetPasswordToken });
	try {
		dispatch({
			type: CHECK_RESET_PASSWORD_TOKEN,
		});
		const res = await axios.post(
			'/api/users/resetPasswordValidation',
			body,
			config
		);
		if (res.data.msg === 'Password reset link was validated') {
			dispatch({
				type: SET_RESET_PASSWORD_TOKEN,
				payload: res.data.user,
			});
		}
	} catch (error) {
		console.log(error);
	}
};

// update password
export const updatePassword = (email, password) => async (dispatch) => {
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	const body = JSON.stringify({ email, password });
	try {
		axios.put('/api/users/updatePassword', body, config).then((res) => {
			if (res.data === 'Password was successfully updated') {
				dispatch(setAlert('Password was successfully updated!', 'success'));
				dispatch({ type: REMOVE_RESET_PASSWORD_TOKEN });
				dispatch({ type: LOGIN_SUCCESS });
				localStorage.removeItem('resetPasswordToken');
			} else {
				dispatch(
					setAlert(
						"Password couldn't be updated. Please contact support.",
						'danger'
					)
				);
			}
			return;
		});
	} catch (error) {
		const errors = error.response.data.errors;
		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}
	}
};
