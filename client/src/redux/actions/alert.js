import { v4 as uuid } from 'uuid';
import { SET_ALERT, REMOVE_ALERT, TIMEOUT_ALERT } from './types';

export const setAlert =
	(title, msg, alertType, timeout = 6000) =>
	(dispatch) => {
		const id = uuid();
		dispatch({
			type: SET_ALERT,
			payload: { title, msg, alertType, id },
		});

		setTimeout(() => dispatch({ type: TIMEOUT_ALERT, payload: id }), timeout);
	};

export const removeAlert = (id) => (dispatch) => {
	dispatch({ type: REMOVE_ALERT, payload: { id } });
};
