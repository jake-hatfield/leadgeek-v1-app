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
};

export const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {},
});

export const {} = usersSlice.actions;

export default usersSlice.reducer;
