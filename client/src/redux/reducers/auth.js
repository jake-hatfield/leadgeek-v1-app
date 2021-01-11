import {
	REGISTER_SUCCESS,
	REGISTER_FAIL,
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	USER_LOADED,
	AUTH_ERROR,
	SET_RESET_PASSWORD_TOKEN,
	CHECK_RESET_PASSWORD_TOKEN,
	REMOVE_RESET_PASSWORD_TOKEN,
	GET_STRIPE_SUBSCRIPTION,
} from '../actions/types';

const initialState = {
	token: localStorage.getItem('token'),
	loading: true,
	isAuthenticated: null,
	user: null,
	activeSubscription: localStorage.getItem('stripeSubscription'),
	activeSubscriptions: null,
	validatedResetPasswordToken: false,
};

export default function (state = initialState, action) {
	const { type, payload } = action;
	switch (type) {
		case USER_LOADED:
			return {
				...state,
				isAuthenticated: true,
				loading: false,
				user: payload,
			};
		case REGISTER_SUCCESS:
		case LOGIN_SUCCESS:
			return {
				...state,
				...payload,
				isAuthenticated: true,
			};
		case REGISTER_FAIL:
		case AUTH_ERROR:
		case LOGIN_FAIL:
		case LOGOUT:
			return {
				...state,
				token: null,
				loading: false,
				isAuthenticated: false,
				activeSubscription: null,
				user: null,
			};
		case GET_STRIPE_SUBSCRIPTION:
			return {
				...state,
				activeSubscription: true,
				activeSubscriptions: payload,
			};
		case CHECK_RESET_PASSWORD_TOKEN:
			return {
				...state,
				loading: true,
			};
		case SET_RESET_PASSWORD_TOKEN:
			return {
				...state,
				user: { email: payload },
				loading: false,
				validatedResetPasswordToken: true,
			};
		case REMOVE_RESET_PASSWORD_TOKEN:
			return {
				...state,
				validatedResetPasswordToken: false,
			};
		default:
			return state;
	}
}
