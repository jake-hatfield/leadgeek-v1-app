import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { authenticateUser } from '@features/auth/authSlice';

import { Alert } from '@utils/interfaces/Alert';

const initialState: Alert[] = [];

export const leadsSlice = createSlice({
	name: 'alert',
	initialState,
	reducers: {
		removeAlert: (state, action: PayloadAction<string>) => {
			return state.filter((alert) => alert.id !== action.payload);
		},
		setAlert: {
			reducer: (state, action: PayloadAction<Alert>) => {
				state.push(action.payload);
			},
			prepare: (alert: {
				title: string;
				message: string;
				alertType: 'success' | 'warning' | 'danger';
			}) => {
				const { title, message, alertType } = alert;
				const id = nanoid();
				return { payload: { id, title, message, alertType } };
			},
		},
	},
	// extraReducers: (builder) => {
	// 	builder.addCase(authenticateUser.fulfilled, (state) => {
	// 		state = initialState;
	// 	});
	// },
});

export const { removeAlert, setAlert } = leadsSlice.actions;

export default leadsSlice.reducer;
