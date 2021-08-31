import React, { RefObject, useEffect } from 'react';

import { DateTime } from 'luxon';

export const config = {
	headers: {
		'Content-Type': 'application/json',
	},
};

export const capitalize = (string: string) => {
	return string[0].toUpperCase() + string.slice(1);
};

export const truncate = (string: string, n: number) => {
	return string.length > n ? string.substr(0, n - 1) + '...' : string;
};

export const truncateAndObfuscate = (string: string, n: number) => {
	const newString = string.slice(3);
	return newString.length > n ? newString.substr(0, n - 1) + 'xxxx' : string;
};

export const numberWithCommas = (n: number) => {
	return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const arrayLengthChecker = (array: []): string | number => {
	return array.length > 99 ? '99+' : array.length;
};

export const returnDomainFromUrl = (url: string) => {
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
export const calculateBSR = (
	currentRank: number,
	category: string
): string | number => {
	let totalItems: number;
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
	if (!totalItems!) {
		return '-';
	} else {
		return ((currentRank / totalItems) * 100).toFixed(3);
	}
};

export const openLinkHandler = (retailerLink: string, amzLink: string) => {
	window.open(retailerLink);
	window.open(amzLink);
};

export const useOutsideMousedown = (
	ref: RefObject<HTMLElement>,
	setState_1: React.Dispatch<boolean>,
	setState_2: React.Dispatch<boolean>
) => {
	useEffect(() => {
		const handleClickOutside = (e: any) => {
			console.log(e.target);
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setState_1(false);
				if (setState_2) {
					setState_2(false);
				}
			}
		};
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [ref, setState_1, setState_2]);
};

export const useOutsideMouseup = (
	ref: RefObject<HTMLElement>,
	setState_1: React.Dispatch<boolean>,
	setState_2: React.Dispatch<boolean>
) => {
	useEffect(() => {
		function handleClickOutside(e: any) {
			if (ref.current && !ref.current.contains(e.target)) {
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

export const planCheckerByPrice = (price: number) => {
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

export const calcAffCommission = (price: number) => {
	return (price * 0.25) / 100;
};

export const formatTimestamp = (timestamp: number, showYear: boolean) => {
	const isoTime = new Date(timestamp * 1000).toJSON();
	if (showYear) {
		return DateTime.fromISO(isoTime).toFormat('LLL dd, yyyy');
	} else {
		return DateTime.fromISO(isoTime).toFormat('LLLL dd');
	}
};

export const calcNextPossiblePayoutDate = (instance: number) => {
	let dt = DateTime.now();
	let cache = Number(dt.toFormat('dd'));

	let newDate = dt.set({ day: 15, hour: 23, minute: 59, second: 59 });
	if (cache >= 15) {
		if (instance === 1) {
			return newDate.plus({ months: 1 });
		} else {
			return newDate.plus({ months: -1 });
		}
	}
};

export const calcNextPayoutDate = (date: number) => {
	const isoTime = new Date(date * 1000).toJSON();
	let dt = DateTime.fromISO(isoTime).plus({ months: 2 });
	let cache = Number(dt.toFormat('dd'));
	let newDate = dt.set({ hour: 23, minute: 59, second: 59 });
	if (cache >= 15) {
		return newDate.set({ day: 15 }).plus({ months: 1 });
	} else {
		return newDate.set({ day: 15 });
	}
};
