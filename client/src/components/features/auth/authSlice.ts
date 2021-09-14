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
			// desctructure items
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
					message:
						"Email & password combination aren't correct. Please try again or reset your password.",
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
			const res = await axios.get('/api/auth');
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
			const { id } = options;
			const body = JSON.stringify({ id });
			const { data } = await axios.post('/api/auth/surrogate-user', body);
			return data;
		} catch (error) {
			console.log(error);
		}
	}
);

export const updatePassword = createAsyncThunk(
	'auth/updatePassword',
	async (options: { email: string; password: string }, { dispatch }) => {
		try {
			const { email, password } = options;
			const emailToLowerCase = email.toLowerCase();
			const body = JSON.stringify({ email: emailToLowerCase, password });
			const { data } = await axios.put('/api/auth/update-password', body);
			if (data === 'Password was successfully updated') {
				dispatch(
					setAlert({
						title: 'Reset success',
						message: 'Your password was successfully updated.',
						alertType: 'success',
					})
				);
				localStorage.removeItem('resetPwToken');
				// dispatch(login(emailToLowerCase, password));
				return;
			} else {
				return dispatch(
					setAlert({
						title: 'Error resetting password',
						message:
							"Your password couldn't be updated. Please contact support.",
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
	async (options: { resetPwToken: string }, { dispatch }) => {
		try {
			const { resetPwToken } = options;
			const body = JSON.stringify({ resetPwToken });
			const { data } = await axios.post(
				'/api/auth/reset-password-validation',
				body
			);
			if (data.message === 'Password reset link was validated') {
				return data.user;
			} else {
				return dispatch(
					setAlert({
						title: 'Error resetting password',
						message:
							"Your password couldn't be reset. Please request a new email link or contact support.",
						alertType: 'danger',
					})
				);
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
				state.user = null;
				state.validatedResetPwToken = false;
			})
			.addCase(validateResetPwToken.pending, (state) => {
				state.status = 'loading';
			})
			.addCase(validateResetPwToken.fulfilled, (state, action) => {
				state.user!.email = action.payload;
				state.status = 'idle';
				state.validatedResetPwToken = true;
			});
	},
});

export const { removeUserData } = authSlice.actions;

export default authSlice.reducer;
