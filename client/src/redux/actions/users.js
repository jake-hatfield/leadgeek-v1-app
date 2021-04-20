import axios from 'axios';
import { GET_ALL_USERS } from './types';

// Get all users (ADMIN)
export const getAllUsers = () => async (dispatch) => {
	const { data } = await axios.get('/api/auth/get-all-users');
	if (data.length > 0) {
		dispatch({
			type: GET_ALL_USERS,
			payload: data,
		});
	}
};
