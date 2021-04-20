import React, { useEffect } from 'react';

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

export function capitalize(s) {
	return s[0].toUpperCase() + s.slice(1);
}

export function truncate(str, n) {
	return str.length > n ? str.substr(0, n - 1) + '...' : str;
}

export function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

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
	let bsrPercentage = ((currentRank / totalItems) * 100).toFixed(3);
	return bsrPercentage;
};

export const lengthChecker = (array) => {
	return array.length > 99 ? '99+' : array.length;
};

export const openLinkHandler = (e, retailerLink, amzLink) => {
	e.preventDefault();
	window.open(retailerLink);
	window.open(amzLink);
};

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
