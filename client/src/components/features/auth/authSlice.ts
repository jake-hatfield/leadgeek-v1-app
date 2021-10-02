import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

// packages
import axios from 'axios';

// redux
import { setAlert } from '@features/alert/alertSlice';
import {
	addComment,
	handleArchiveLead,
	handleLikeLead,
} from '@features/leads/leadsSlice';

// utils
import { config } from '@utils/utils';
import { User } from '@utils/interfaces/User';

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

export const authenticateUser = createAsyncThunk(
	'auth/authenticateUser',
	async (
		options: { email: string; password: string },
		{ dispatch, rejectWithValue }
	) => {
		try {
			// destructure items
			const { email, password } = options;

			// set email string to all lowercase to prevent false mismatches
			const emailToLowerCase = email.toLowerCase();

			// prepare body JSON object
			const body = JSON.stringify({ email: emailToLowerCase, password });

			// make request to api
			const res = await axios.post('/api/auth', body, config);

			// if response contains a token, update it in auth state
			if (res.data.token) {
				return res.data.token;
			}
		} catch (error) {
			console.log(error);
			dispatch(
				setAlert({
					title: 'Login error',
					message: "Email & password combination aren't correct",
					alertType: 'danger',
				})
			);
			return rejectWithValue(error);
		}
	}
);

export const getUserData = createAsyncThunk(
	'auth/getUserData',
	async (_, { rejectWithValue }) => {
		try {
			// make GET request to API
			const res = await axios.get('/api/auth');

			// return data to state
			return res.data;
		} catch (error) {
			console.log(error);
			return rejectWithValue(error);
		}
	}
);

export const surrogateUser = createAsyncThunk(
	'auth/surrogateUser',
	async (options: { id: string }) => {
		try {
			// prepare body JSON object
			const body = JSON.stringify({ id: options.id });

			// make POST request to API
			const { data } = await axios.post('/api/auth/surrogate-user', body);

			// return data to state
			return data;
		} catch (error) {
			console.log(error);
		}
	}
);

export const updatePassword = createAsyncThunk(
	'auth/updatePassword',
	async (
		options: { email: string; password: string; redirect: boolean },
		{ dispatch, rejectWithValue }
	) => {
		try {
			// destructure necessary items
			const { email, password, redirect } = options;

			// double check everything is there before sending it to the API
			if (!email || !password) {
				dispatch(
					setAlert({
						title: 'Error',
						message: 'Required information is missing',
						alertType: 'danger',
					})
				);
				return rejectWithValue('Required information is missing');
			}

			// email to lowercase to prevent stupid errors
			const emailToLowerCase = email.toLowerCase();

			// prepare body JSON object
			const body = JSON.stringify({ email: emailToLowerCase, password });

			// make PUT request to API
			const { data } = await axios.put(
				'/api/auth/update-password',
				body,
				config
			);

			// if password was successfully updated, alert the user, clear the reset password token in LS, and log them in
			if (data === 'Password was successfully updated') {
				dispatch(
					setAlert({
						title: 'Reset success',
						message: 'Your password was successfully updated',
						alertType: 'success',
					})
				);
				localStorage.removeItem('resetPwToken');
				localStorage.removeItem('email');
				if (redirect) {
					return dispatch(authenticateUser({ email, password }));
				}
			} else {
				// password wasn't successfully updated, alert the user
				return dispatch(
					setAlert({
						title: 'Error resetting password',
						message: 'Please contact support',
						alertType: 'danger',
					})
				);
			}
		} catch (error) {
			console.log(error);
		}
	}
);

export const validateResetPwToken = createAsyncThunk(
	'auth/validateResetPwToken',
	async (options: { resetPwToken: string }, { dispatch, rejectWithValue }) => {
		try {
			// prepare body JSON object
			const body = JSON.stringify({ resetPwToken: options.resetPwToken });

			// make POST request to API
			const { data } = await axios.post(
				'/api/auth/reset-password-validation',
				body,
				config
			);

			console.log(data.message);

			// if link was validated, update user in state
			if (data.message === 'Password reset link was validated') {
				localStorage.setItem('email', data.user);
				return;
			} else {
				// alert that link couldn't be updated
				dispatch(
					setAlert({
						title: "Password couldn't be reset",
						message: 'Please request a new email link or contact support.',
						alertType: 'danger',
					})
				);
				return rejectWithValue(data.message);
			}
		} catch (error) {
			console.log(error);
			return error;
		}
	}
);

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		removeUserData: (state) => {
			localStorage.removeItem('token');
			state.token = null;
			state.status = 'idle';
			state.isAuthenticated = false;
			state.user = null;
			state.validatedResetPwToken = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addComment.fulfilled, (state, action) => {
				if (state.user) {
					state.user.comments = action.payload;
				}
			})
			.addCase(authenticateUser.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(authenticateUser.fulfilled, (state, action) => {
				state.status = 'idle';
				state.token = action.payload;
				state.isAuthenticated = true;
			})
			.addCase(authenticateUser.rejected, (state) => {
				state.status = 'idle';
				state.token = null;
				state.isAuthenticated = false;
				state.user = null;
				state.validatedResetPwToken = false;
			})
			.addCase(getUserData.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(getUserData.fulfilled, (state, action: PayloadAction<User>) => {
				state.status = 'idle';
				state.isAuthenticated = true;
				state.user = action.payload;
			})
			.addCase(getUserData.rejected, (state) => {
				state.status = 'idle';
				state.token = null;
				state.isAuthenticated = false;
				state.user = null;
				state.validatedResetPwToken = false;
			})
			.addCase(handleLikeLead.fulfilled, (state, action) => {
				state.user!.likedLeads! = action.payload?.leads;
			})
			.addCase(handleArchiveLead.fulfilled, (state, action) => {
				state.user!.archivedLeads! = action.payload?.leads;
			})
			.addCase(surrogateUser.fulfilled, (state, action) => {
				const { token, user } = action.payload;
				state.token = token;
				state.user = user;
			})
			.addCase(updatePassword.fulfilled, (state) => {
				state.validatedResetPwToken = false;
			})
			.addCase(validateResetPwToken.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(validateResetPwToken.fulfilled, (state) => {
				state.status = 'idle';
				state.validatedResetPwToken = true;
			})
			.addCase(validateResetPwToken.rejected, (state, action) => {
				state.status = 'idle';
				state.validatedResetPwToken = false;
			});
	},
});

export const { removeUserData } = authSlice.actions;

export default authSlice.reducer;
