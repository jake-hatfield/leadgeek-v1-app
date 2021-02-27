import {
	GET_LEADS,
	VIEW_LEAD,
	LIKE_LEAD,
	UNLIKE_LEAD,
	SHOW_DETAILED_LEAD,
	CLEAR_DETAILED_LEAD,
} from './types';
import axios from 'axios';
const feed = [
	{
		id: 1,
		title: 'Revlon 2-Step Mascara',
		brand: 'Revlon',
		asin: 'B07KDSQNTR',
		category: 'Beauty & Personal Care',
		img:
			'https://images-na.ssl-images-amazon.com/images/I/91r2hU%2Bo-9L._AC_UY741_.jpg',
		coreStats: {
			netProfit: 5.77,
			roi: 114,
			currentBSR: 1110006,
			monthlySales: 2143,
		},
		source: `Kohl's`,
		sourceLink:
			'https://www.kohls.com/product/prd-4829820/adidas-hermosa-mesh-backpack.jsp',
		amzLink: 'https://amazon.com/dp/B07KDSQNTR/',
		liked: false,
		archived: false,
		viewed: false,
	},
	{
		id: 2,
		title: 'Disney Princess Finger Puppets',
		category: 'Toys & Games',
		coreStats: {
			netProfit: 12.1,
			roi: 65,
			currentBSR: 22116,
			monthlySales: 180,
		},
		sourceLink:
			'https://www.kohls.com/product/prd-4829820/adidas-hermosa-mesh-backpack.jsp',
		amzLink: 'https://amazon.com/dp/B07KDSQNTR/',
		liked: false,
		archived: false,
		viewed: false,
	},
	{
		id: 3,
		title: "Carter's Boy's Jumpsuit",
		category: 'Clothing, Shoes, and Jewelry',
		coreStats: {
			netProfit: 4.4,
			roi: 58,
			currentBSR: 150432,
			monthlySales: 24,
		},
		sourceLink:
			'https://www.kohls.com/product/prd-4829820/adidas-hermosa-mesh-backpack.jsp',
		amzLink: 'https://amazon.com/dp/B07KDSQNTR/',
		liked: false,
		archived: false,
		viewed: false,
	},
	{
		id: 4,
		title:
			'Scotch-Brite Non-Scratch Advanced Soap Control Dishwand, Leak-Free Guarantee, Keep Your Hands Out Of Dirty Water, Long Lasting and Reusable',
		category: 'Clothing, Shoes, and Jewelry',
		coreStats: {
			netProfit: 4.4,
			roi: 58,
			currentBSR: 150432,
			monthlySales: 24,
		},
		sourceLink:
			'https://www.kohls.com/product/prd-4829820/adidas-hermosa-mesh-backpack.jsp',
		amzLink: 'https://amazon.com/dp/B07KDSQNTR/',
		liked: false,
		archived: false,
		viewed: false,
	},
];

export const getLeads = (planId) => async (dispatch) => {
	try {
		// let activeSubscriptions;
		// if (planId.length > 0) {
		// 	planId.forEach(function (sub) {
		// 		if (sub === process.env.REACT_APP_BUNDLE_PRODUCT_ID) {
		// 			activeSubscriptions = 'Bundle';
		// 		} else if (sub === process.env.REACT_APP_PRO_PRODUCT_ID) {
		// 			activeSubscriptions = 'Pro';
		// 		} else if (sub === process.env.REACT_APP_GROW_PRODUCT_ID) {
		// 			activeSubscriptions = 'Grow';
		// 		} else return;
		// 	});
		// }
		// const config = {
		// 	headers: {
		// 		'Content-Type': 'application/json',
		// 	},
		// };
		// const body = JSON.stringify({ activeSubscriptions });
		const { data: feed } = await axios.get('/api/leads');
		const feedArray = feed.feed;
		console.log(feedArray);
		let unviewed = feedArray.filter((lead) => lead.viewed === false);
		dispatch({
			type: GET_LEADS,
			payload: { feedArray, unviewed },
		});
	} catch (error) {
		console.log(error);
	}
};

export const viewLead = (leadId) => (dispatch) => {
	try {
		dispatch({
			type: VIEW_LEAD,
			payload: { id: leadId },
		});
	} catch (error) {
		console.log(error);
	}
};

export const setLikeStatus = (leadId) => (dispatch) => {
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

export const exportLead = () => (dispatch) => {
	try {
		const lead = {
			source: 'Target',
			bsr30: '1903.0',
			cashback: '',
			shipping: 'Free shipping on $35+',
			roi: '0.4803001876172608',
			asin: '6026ec8b537dbb177eddd8e0',
			competitors: 'MF',
			brand: 'Barbie',
			date: '1969-12-31',
			retailerLink:
				'http://www.target.com/p/,barbie-fizzy-bath-brunette-doll-and-playset/-/...',
			variations: '',
			buyPrice: '15.99',
			category: 'Toys & Games',
			promo: '-',
			bsr90: '1684.0',
			amzLink: 'https://amazon.com/dp/B07XB3JL3Y/',
			bsrCurrent: '5341.0',
			sellPrice: '36.0',
			notes: '',
			netProfit: '7.68',
			weight: '1.4',
			title:
				'​Barbie Fizzy Bath Doll and Playset, Brunette, with Tub, Fizzy Powder,...',
			monthlySales: '214.0',
		};
		const config = {
			headers: {
				'Content-Type': 'application/json',
			},
		};
		const body = JSON.stringify({ lead });
		const res = axios.post('/api/leads/export', body, config);
		console.log(res);
	} catch (error) {
		console.log(error);
	}
};
