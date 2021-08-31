import { configureStore } from '@reduxjs/toolkit';

// import reducers
import alertReducer from '@features/alert/alertSlice';
import authReducer from '@features/auth/authSlice';
import filterReducer from '@features/filters/filtersSlice';
import leadsReducer from '@features/leads/leadsSlice';
import usersReducer from '@features/users/usersSlice';

const store = configureStore({
	reducer: {
		alert: alertReducer,
		auth: authReducer,
		filters: filterReducer,
		leads: leadsReducer,
		users: usersReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
