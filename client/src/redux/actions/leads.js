import { GET_LEADS, LIKE_LEAD, UNLIKE_LEAD } from './types';

const feed = [
	{
		id: 1,
		title: 'Revlon 2-Step Mascara',
		category: 'Beauty & Personal Care',
		netProfit: '5.77',
		roi: '114',
		currentBSR: '1110006',
		monthlySales: '2143',
	},
	{
		id: 2,
		title: 'Disney Princess Finger Puppets',
		category: 'Toys & Games',
		netProfit: '12.10',
		roi: '65',
		currentBSR: '22116',
		monthlySales: '180',
	},
];

export const getLeads = () => (dispatch) => {
	try {
		dispatch({
			type: GET_LEADS,
			payload: feed,
		});
	} catch (error) {
		console.log(error);
	}
};

export const likeLead = (leadId) => (dispatch) => {
	try {
		dispatch({
			type: LIKE_LEAD,
			payload: { id: leadId },
		});
	} catch (error) {
		console.log(error);
	}
};

export const unlikeLead = (leadId) => (dispatch) => {
	try {
		dispatch({
			type: UNLIKE_LEAD,
			payload: { id: leadId },
		});
	} catch (error) {
		console.log(error);
	}
};
