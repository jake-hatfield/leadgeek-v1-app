import axios from 'axios';
import { GET_ALL_USERS } from './types';

const config = {
	headers: {
		'Content-Type': 'application/json',
	},
};

// Get all users (ADMIN)
export const getAllUsers = (page) => async (dispatch) => {
	const body = JSON.stringify({ page });
	const { data } = await axios.post('/api/users/get-all-users', body, config);
	if (data.users.length > 0) {
		dispatch({
			type: GET_ALL_USERS,
			payload: { data },
		});
	}
};
