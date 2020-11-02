import { GET_LEADS } from './types';

export const getLeads = () => (dispatch) => {
	const leads = [
		{
			name: 'Revlon 2-Step Mascara',
			category: 'Beauty & Personal Care',
			netProfit: '5.77',
			roi: '114',
			currentBSR: '1110006',
			monthlySales: '2143',
		},
		{
			name: 'Disney Princess Finger Puppets',
			category: 'Toys & Games',
			netProfit: '12.10',
			roi: '65',
			currentBSR: '22116',
			monthlySales: '180',
		},
	];
	try {
		dispatch({
			type: GET_LEADS,
			payload: leads,
		});
	} catch (error) {
		console.log(error);
	}
};
