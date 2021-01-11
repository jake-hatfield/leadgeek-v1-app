import axios from 'axios';

export const setAuthToken = (token) => {
	if (token) {
		axios.defaults.headers.common['x-auth-token'] = token;
		localStorage.setItem('token', token);
	} else {
		delete axios.defaults.headers.common['x-auth-token'];
		localStorage.removeItem('token');
	}
};

export const setResetPasswordToken = (token) => {
	if (token) {
		axios.defaults.headers.common['x-auth-token'] = token;
		localStorage.setItem('resetPasswordToken', token);
	} else {
		delete axios.defaults.headers.common['x-auth-token'];
		localStorage.removeItem('resetPasswordToken');
	}
};

export const setStripeToken = (token) => {
	if (token) {
		axios.defaults.headers.common['x-auth-token'] = token;
		localStorage.setItem('stripeSubscription', token);
	} else {
		delete axios.defaults.headers.common['x-auth-token'];
		localStorage.removeItem('stripeSubscription');
	}
};

export default setAuthToken;
