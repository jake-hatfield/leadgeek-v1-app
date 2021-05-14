import {
	CLEAR_FILTERS,
	SET_CATEGORY_FILTER,
	SET_FILTER_COUNT,
	SET_PREP_FILTER,
	CLEAR_PREP_FILTER,
	SET_ITEM_LIMIT,
} from './types';
import { setAlert } from './alert';

export const setMinMaxFilter = (min, max, val) => (dispatch) => {
	try {
		if (max && min >= max) {
			return dispatch(
				setAlert(
					'Error creating the filter',
					'Minimum value cannot be greater than maximum value.',
					'danger'
				)
			);
		}
		let calculatedMinValue;
		let calculatedMaxValue;
		if (min > 0) {
			if (val === 'roi') {
				calculatedMinValue = min / 100;
			} else {
				calculatedMinValue = min;
			}
			let key = `${val}Min`;
			localStorage.setItem(key, calculatedMinValue);
		}
		if (max > 0) {
			if (val === 'roi') {
				calculatedMaxValue = max / 100;
			} else {
				calculatedMaxValue = max;
			}
			let key = `${val}Max`;
			localStorage.setItem(key, calculatedMaxValue);
		}
		if (min || max) {
			return dispatch({
				type: `SET_${val.toUpperCase()}_FILTER`,
				payload: {
					min: +calculatedMinValue,
					max: +calculatedMaxValue,
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
				min: +min,
				max: +max,
			},
		});
	} catch (error) {
		console.log(error);
	}
};

export const setDropdownFilter = (newCategory) => (dispatch) => {
	try {
		return dispatch({
			type: SET_CATEGORY_FILTER,
			payload: { newCategory },
		});
	} catch (error) {
		console.log(error);
	}
};

export const setPrepFilter = (prepFee) => (dispatch) => {
	try {
		const key = Object.keys(prepFee)[0];
		const value = Object.values(prepFee)[0];
		if (!key) {
			return dispatch(
				setAlert(
					'Error creating the filter',
					'Please input a fee associated with your prep costs.',
					'warning'
				)
			);
		} else {
			localStorage.setItem(`${key}Fee`, value);
			dispatch({
				type: SET_PREP_FILTER,
				payload: { key, value },
			});
			return dispatch(
				setAlert(
					'Filter was created',
					'Item prep fees were added and adjusted product metrics are now showing.',
					'success'
				)
			);
		}
	} catch (error) {
		console.log(error);
	}
};

export const setFilterCount = () => (dispatch) => {
	try {
		dispatch({
			type: SET_FILTER_COUNT,
		});
	} catch (error) {
		console.log(error);
	}
};

export const clearPrepFilter = () => (dispatch) => {
	try {
		let keysToRemove = ['unitFee', 'lbFee'];
		keysToRemove.forEach((key) => localStorage.removeItem(key));
		dispatch({ type: CLEAR_PREP_FILTER });
		return dispatch(
			setAlert(
				'Filter was removed',
				'Prep costs were cleared and product metrics were returned to normal.',
				'success'
			)
		);
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
			'filterCount',
		];
		keysToRemove.forEach((key) => localStorage.removeItem(key));
		dispatch({ type: CLEAR_FILTERS });
		return dispatch(
			setAlert(
				'All filters were removed',
				'Unfiltered leads are now showing.',
				'success'
			)
		);
	} catch (error) {
		console.log(error);
	}
};

export const setItemLimit = (type, itemLimit) => async (dispatch) => {
	try {
		if (itemLimit) {
			let typeFilter;
			if (type === 'feed' || type === 'liked' || type === 'archived') {
				typeFilter = 'leadsLimit';
			} else {
				typeFilter = `${type}Limit`;
			}
			localStorage.setItem(typeFilter, itemLimit);
			return dispatch({
				type: SET_ITEM_LIMIT,
				payload: { typeFilter, itemLimit },
			});
		}
	} catch (error) {
		console.log(error);
	}
};

export const setDateLimit = (min, max, selected) => async (dispatch) => {
	try {
		if (min || max) {
			return dispatch({
				type: `SET_DATE_FILTER`,
				payload: {
					min,
					max,
					selected,
				},
			});
		}
	} catch (error) {
		console.log(error);
	}
};
