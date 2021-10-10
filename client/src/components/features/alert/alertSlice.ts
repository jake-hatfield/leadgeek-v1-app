import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

import { Alert } from '@utils/interfaces/Alert';

const initialState: Alert = {
	id: '',
	title: '',
	message: '',
	alertType: null,
};

export const leadsSlice = createSlice({
	name: 'alert',
	initialState,
	reducers: {
		removeAlert: () => {
			return initialState;
		},
		setAlert: {
			reducer: (state, action: PayloadAction<Alert>) => {
				const { id, title, message, alertType } = action.payload;
				state.id = id;
				state.title = title;
				state.message = message;
				state.alertType = alertType;
			},
			prepare: (alert: {
				title: string;
				message: string;
				alertType: 'success' | 'warning' | 'danger';
			}) => {
				const { title, message, alertType } = alert;
				const id = nanoid();
				return { payload: { id, title, message, alertType, visible: true } };
			},
		},
	},
});

export const { removeAlert, setAlert } = leadsSlice.actions;

export default leadsSlice.reducer;
