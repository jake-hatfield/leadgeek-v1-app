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
	HANDLE_LIKE_LEAD,
} from '../actions/types';

const initialState = {
	token: localStorage.getItem('token'),
	loading: true,
	isAuthenticated: null,
	user: {},
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
		case HANDLE_LIKE_LEAD:
			return {
				...state,
				user: { ...state.user, likedLeads: payload },
				loading: false,
			};
		default:
			return state;
	}
}
