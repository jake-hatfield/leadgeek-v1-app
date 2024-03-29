import { configureStore } from '@reduxjs/toolkit';

// import reducers
import alertReducer from '@features/alert/alertSlice';
import authReducer from '@features/auth/authSlice';
import filterReducer from '@features/filters/filtersSlice';
import leadsReducer from '@features/leads/leadsSlice';

const store = configureStore({
	reducer: {
		alert: alertReducer,
		auth: authReducer,
		filters: filterReducer,
		leads: leadsReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
