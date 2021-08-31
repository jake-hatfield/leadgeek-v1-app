import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// import { setAlert } from '@redux/actions/alert';

import { User } from '@utils/interfaces/User';
import { config } from '@utils/utils';

interface AuthState {
	status: 'idle' | 'loading' | 'failed';
	token: string | null;
	isAuthenticated: boolean;
	user: User | null;
	validatedResetPwToken: boolean;
}

const initialState: AuthState = {
	status: 'loading',
	token: localStorage.getItem('token'),
	isAuthenticated: false,
	user: null,
	validatedResetPwToken: false,
};

export const getUserData = createAsyncThunk('auth/getUserData', async () => {
	try {
		const res = await axios.get('/api/auth');
		return res.data;
	} catch (error) {
		console.log(error);
		return null;
	}
});

export const setJWT = createAsyncThunk(
	'auth/setJWT',
	async (
		userCredentials: { email: string; password: string },
		{ dispatch }
	) => {
		try {
			const { email, password } = userCredentials;
			const emailToLowerCase = email.toLowerCase();
			const body = JSON.stringify({ email: emailToLowerCase, password });
			const res = await axios.post('/api/auth', body, config);
			if (res.data) {
				return res.data;
			} else {
				// dispatch(
				// 	setAlert(
				// 		'Login error',
				// 		"Email & password combination aren't correct. Please try again or reset your password.",
				// 		'danger'
				// 	)
				// );
				console.log('There was an error logging in!');
			}
		} catch (error: any) {
			console.log(error);
		}
	}
);

// reset password validation
// export const resetPwValidation = (resetPwToken) => async (dispatch) => {
// 	const body = JSON.stringify({ resetPwToken });
// 	try {
// 		dispatch({
// 			type: CHECK_RESET_PASSWORD_TOKEN,
// 		});
// 		const res = await axios.post(
// 			'/api/users/reset-password-validation',
// 			body,
// 			config
// 		);
// 		if (res.data.msg === 'Password reset link was validated') {
// 			dispatch({
// 				type: SET_RESET_PASSWORD_TOKEN,
// 				payload: res.data.user,
// 			});
// 		} else {
// 			return dispatch(
// 				setAlert(
// 					'Error resetting password',
// 					"Your password couldn't be reset. Please request a new email link or contact support.",
// 					'danger'
// 				)
// 			);
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// };

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		removeUserData: (state) => {
			state.token = null;
			state.status = 'idle';
			state.isAuthenticated = false;
			state.user = null;
			state.validatedResetPwToken = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getUserData.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(getUserData.fulfilled, (state, action) => {
				state.status = 'idle';
				state.isAuthenticated = true;
				state.user = action.payload;
			})
			.addCase(getUserData.rejected, (state) => {
				state.status = 'failed';
				state.token = null;
				state.isAuthenticated = false;
				state.user = null;
				state.validatedResetPwToken = false;
			})
			.addCase(setJWT.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(setJWT.fulfilled, (state, action) => {
				state.status = 'idle';
				state.token = action.payload;
			})
			.addCase(setJWT.rejected, (state) => {
				state.status = 'failed';
				state.token = null;
				state.isAuthenticated = false;
				state.user = null;
				state.validatedResetPwToken = false;
			});
	},
});

export const { removeUserData } = authSlice.actions;

export default authSlice.reducer;
