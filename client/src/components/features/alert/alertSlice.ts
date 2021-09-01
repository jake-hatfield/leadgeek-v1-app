import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

import { Alert } from '@utils/interfaces/Alert';

const initialState: Alert[] = [];

export const leadsSlice = createSlice({
	name: 'alert',
	initialState,
	reducers: {
		removeAlert: (state, action: PayloadAction<string>) => {
			return state.filter((alert) => alert.id !== action.payload);
		},
		// setAlert: (state, action: PayloadAction<Alert>) => {
		// 	const alert = action.payload;
		// 	return state.push(alert);
		// },
	},
});

export const { removeAlert } = leadsSlice.actions;

export default leadsSlice.reducer;
