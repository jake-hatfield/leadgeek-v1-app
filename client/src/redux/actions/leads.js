import {
	GET_LEADS,
	LIKE_LEAD,
	UNLIKE_LEAD,
	SHOW_DETAILED_LEAD,
	CLEAR_DETAILED_LEAD,
} from './types';

const feed = [
	{
		id: 1,
		sourceLink:
			'https://www.kohls.com/product/prd-4829820/adidas-hermosa-mesh-backpack.jsp',
		amzLink: 'https://amazon.com/dp/B07KDSQNTR/',
		title: 'Revlon 2-Step Mascara',
		category: 'Beauty & Personal Care',
		netProfit: 5.77,
		roi: 114,
		currentBSR: 1110006,
		monthlySales: 2143,
	},
	{
		id: 2,
		sourceLink:
			'https://www.kohls.com/product/prd-4829820/adidas-hermosa-mesh-backpack.jsp',
		amzLink: 'https://amazon.com/dp/B07KDSQNTR/',
		title: 'Disney Princess Finger Puppets',
		category: 'Toys & Games',
		netProfit: 12.1,
		roi: 65,
		currentBSR: 22116,
		monthlySales: 180,
	},
	{
		id: 3,
		sourceLink:
			'https://www.kohls.com/product/prd-4829820/adidas-hermosa-mesh-backpack.jsp',
		amzLink: 'https://amazon.com/dp/B07KDSQNTR/',
		title: "Carter's Boy's Jumpsuit",
		category: 'Clothing, Shoes, and Jewelry',
		netProfit: 4.4,
		roi: 58,
		currentBSR: 150432,
		monthlySales: 24,
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

export const showDetailedLead = (leadId) => (dispatch) => {
	try {
		dispatch({
			type: SHOW_DETAILED_LEAD,
			payload: { id: leadId },
		});
	} catch (error) {
		console.log(error);
	}
};

export const clearDetailedLead = () => (dispatch) => {
	try {
		dispatch({
			type: CLEAR_DETAILED_LEAD,
		});
	} catch (error) {
		console.log(error);
	}
};
