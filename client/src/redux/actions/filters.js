import { CLEAR_FILTERS } from './types';
import { setAlert } from './alert';

export const setMinMaxFilter = (min, max, val) => (dispatch) => {
	try {
		if (max && min >= max) {
			return dispatch(
				setAlert(
					'Minimum filter cannot be greater than maximum filter.',
					'danger'
				)
			);
		}
		if (min > 0) {
			let key = `${val}Min`;
			localStorage.setItem(key, min);
		}
		if (max > 0) {
			let key = `${val}Max`;
			localStorage.setItem(key, max);
		}
		if (min || max) {
			return dispatch({
				type: `SET_${val.toUpperCase()}_FILTER`,
				payload: {
					min,
					max,
				},
			});
		}
	} catch (error) {
		console.log(error);
	}
};

export const clearMinMaxFilter = (min, max, val, minMax) => (dispatch) => {
	try {
		let key = `${val}${minMax}`;
		localStorage.removeItem(key);
		return dispatch({
			type: `CLEAR_${val.toUpperCase()}_FILTER`,
			payload: {
				min,
				max,
			},
		});
	} catch (error) {
		console.log(error);
	}
};

export const clearFilters = () => (dispatch) => {
	try {
		let keysToRemove = [
			'netProfitMin',
			'netProfitMax',
			'buyPriceMin',
			'buyPriceMax',
			'sellPriceMin',
			'sellPriceMax',
			'roiMin',
			'roiMax',
			'bsrMin',
			'bsrMax',
			'monthlySalesMin',
			'monthlySalesMax',
			'weightMin',
			'weightMax',
		];
		keysToRemove.forEach((key) => localStorage.removeItem(key));
		dispatch({ type: CLEAR_FILTERS });
		return dispatch(setAlert('All filters cleared!', 'success'));
	} catch (error) {
		console.log(error);
	}
};
