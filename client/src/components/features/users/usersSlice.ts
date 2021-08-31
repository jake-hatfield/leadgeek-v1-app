import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	allUsers: [],
	loading: false,
	pagination: {
		page: 1,
		hasNextPage: null,
		hasPreviousPage: false,
		nextPage: null,
		previousPage: null,
		lastPage: null,
		totalItems: null,
	},
	userSettings: {
		billing: {
			plan: {
				loading: true,
				id: null,
				created: null,
				cancelAt: null,
				cancelAtPeriod: null,
				currentPeriodEnd: null,
				plan: {
					id: null,
					amount: null,
				},
			},
			paymentHistory: {
				loading: true,
				payments: [],
			},
		},
		affiliates: {
			paypalEmail: '',
			paymentHistory: {
				loading: true,
				payments: [],
			},
		},
	},
};

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {},
});

export const {} = usersSlice.actions;

export default usersSlice.reducer;
