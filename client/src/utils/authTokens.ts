import axios from 'axios';

export const setAuthToken = (token: string) => {
	if (token) {
		axios.defaults.headers.common['x-auth-token'] = token;
		localStorage.setItem('token', token);
	} else {
		delete axios.defaults.headers.common['x-auth-token'];
		localStorage.removeItem('token');
	}
};

export const setResetPwToken = (token: string) => {
	if (token) {
		axios.defaults.headers.common['x-auth-token'] = token;
		localStorage.setItem('resetPwToken', token);
	} else {
		delete axios.defaults.headers.common['x-auth-token'];
		localStorage.removeItem('resetPwToken');
	}
};

export default setAuthToken;
