import React, { useEffect } from 'react';

import { DateTime } from 'luxon';

export const capitalize = (s) => {
	return s[0].toUpperCase() + s.slice(1);
};

export const truncate = (str, n) => {
	return str.length > n ? str.substr(0, n - 1) + '...' : str;
};

export const truncateAndObfuscate = (str, n) => {
	const string = str.slice(3);
	return string.length > n ? string.substr(0, n - 1) + 'xxxx' : str;
};

export const numberWithCommas = (x) => {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const lengthChecker = (array) => {
	return array.length > 99 ? '99+' : array.length;
};

export const domainFromURL = (url) => {
	let result, match;
	if (
		(match = url.match(
			/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
		))
	) {
		result = match[1];
		if ((match = result.match(/^[^\.]+\.(.+\..+)$/))) {
			result = match[1];
		}
	}
	return result;
};

// bsr / category % calculator
export const calculateBSR = (currentRank, category) => {
	let totalItems;
	if (category === 'Appliances') {
		totalItems = 616462;
	} else if (category.includes('Arts')) {
		totalItems = 7498354;
	} else if (category === 'Automotive') {
		totalItems = 22271330;
	} else if (category.includes('Baby')) {
		totalItems = 2969134;
	} else if (category.includes('Beauty')) {
		totalItems = 8918802;
	} else if (category === 'Books') {
		totalItems = 63513871;
	} else if (category.includes('CDs')) {
		totalItems = 5768853;
	} else if (category.includes('Phone')) {
		totalItems = 23560255;
	} else if (category.includes('Clothing')) {
		totalItems = 115990329;
	} else if (category.includes('Collectibles')) {
		totalItems = 5319325;
	} else if (category.includes('Electronics')) {
		totalItems = 13436282;
	} else if (category.includes('Grocery')) {
		totalItems = 2871202;
	} else if (category.includes('Handmade')) {
		totalItems = 1515790;
	} else if (category.includes('Health')) {
		totalItems = 7528676;
	} else if (category.includes('Home')) {
		totalItems = 59108947;
	} else if (category.includes('Industrial')) {
		totalItems = 9915828;
	} else if (category.includes('Dining')) {
		totalItems = 59108947;
	} else if (category.includes('Movies')) {
		totalItems = 3426934;
	} else if (category.includes('Musical')) {
		totalItems = 1455860;
	} else if (category.includes('Office')) {
		totalItems = 7746679;
	} else if (category.includes('Patio')) {
		totalItems = 8107431;
	} else if (category.includes('Pet')) {
		totalItems = 4996454;
	} else if (category.includes('Software')) {
		totalItems = 160164;
	} else if (category.includes('Sports')) {
		totalItems = 29519885;
	} else if (category.includes('Tools')) {
		totalItems = 17564272;
	} else if (category.includes('Toys')) {
		totalItems = 8933993;
	} else if (category === 'Video Games') {
		totalItems = 730691;
	}
	if (!totalItems) {
		return '-';
	} else {
		return ((currentRank / totalItems) * 100).toFixed(3);
	}
};

export const openLinkHandler = (retailerLink, amzLink) => {
	window.open(retailerLink);
	window.open(amzLink);
};

export function useStickyState(defaultValue, key) {
	const [value, setValue] = React.useState(() => {
		const stickyValue = window.localStorage.getItem(key);
		return stickyValue !== null ? JSON.parse(stickyValue) : defaultValue;
	});
	React.useEffect(() => {
		window.localStorage.setItem(key, JSON.stringify(value));
	}, [key, value]);
	return [value, setValue];
}

export const useOutsideMousedown = (ref, setState_1, setState_2) => {
	useEffect(() => {
		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				setState_1(false);
				if (setState_2) {
					setState_2(false);
				}
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [ref, setState_1, setState_2]);
};

export const useOutsideMouseup = (ref, setState_1, setState_2) => {
	useEffect(() => {
		function handleClickOutside(event) {
			if (ref.current && !ref.current.contains(event.target)) {
				setState_1(false);
				if (setState_2) {
					setState_2(false);
				}
			}
		}
		document.addEventListener('mouseup', handleClickOutside);
		return () => {
			document.removeEventListener('mouseup', handleClickOutside);
		};
	}, [ref, setState_1, setState_2]);
};

export const planCheckerByPrice = (price) => {
	let plan;
	if (price === 12900) {
		plan = 'Grow';
	} else if (price === 18900) {
		plan = 'Pro';
	} else if (price === 26300) {
		plan = 'Bundle';
	} else {
		plan = 'Leadgeek';
	}
	return plan;
};

export const calcAffCommission = (price) => {
	return (price * 0.25) / 100;
};

export const formatTimestamp = (timestamp, showYear) => {
	const isoTime = new Date(timestamp * 1000).toJSON();
	if (showYear) {
		return DateTime.fromISO(isoTime).toFormat('LLL dd, yyyy');
	} else {
		return DateTime.fromISO(isoTime).toFormat('LLLL dd');
	}
};

export const getPayout = (instance) => {
	let dt = DateTime.now();
	let cache = Number(dt.toFormat('dd'));

	let newDate = dt;
	if (cache >= 15) {
		if (instance === 1) {
			newDate.plus({ months: 1 });
		} else {
			newDate.plus({ months: -1 });
		}
	}

	const nextPayoutDate = newDate.set({
		days: 15,
		hours: 23,
		minutes: 59,
		seconds: 59,
	});

	return nextPayoutDate;
};

export const calcNextPayoutDate = (date) => {
	const isoTime = new Date(date * 1000).toJSON();
	let dt = DateTime.fromISO(isoTime).plus({ months: 2 });
	let cache = Number(dt.toFormat('dd'));
	let newDate;
	if (cache >= 15) {
		newDate = dt.set({ days: 15 }).plus({ months: 1 });
	}
	const payoutDate = newDate.set({ hours: 23, minutes: 59, seconds: 59 });

	return payoutDate;
};
