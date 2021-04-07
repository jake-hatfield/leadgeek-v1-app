import React, { useRef, useEffect, useCallback } from 'react';

import { connect } from 'react-redux';

import FilterItem from './FilterItem';
import { useOutsideMousedown } from '../../../utils/utils';
import { getLeads } from '../../../redux/actions/leads';
import { clearFilters } from '../../../redux/actions/filters';

// TODO:
// Dropdown input on category field
// Category redux action/reducer
// Category filter in API

const Filter = ({
	user,
	filters,
	setFilter,
	filter,
	getLeads,
	clearFilters,
}) => {
	const wrapperRef = useRef(null);
	useOutsideMousedown(wrapperRef, setFilter);
	// close modal on esc key
	const keyPress = useCallback(
		(e) => {
			if (e.key === 'Escape' && filter) {
				setFilter(false);
			}
		},
		[setFilter, filter]
	);
	useEffect(() => {
		document.addEventListener('keydown', keyPress);
		return () => document.removeEventListener('keydown', keyPress);
	}, [keyPress]);

	const {
		netProfit,
		buyPrice,
		sellPrice,
		roi,
		bsr,
		monthlySales,
		weight,
		category,
	} = filters;
	const filterItems = [
		{
			title: 'Profit',
			subtitle: 'Profit',
			subtitleValue: '($)',
			min: netProfit.min,
			max: netProfit.max,
			val: 'netProfit',
		},
		{
			title: 'Buy price',
			subtitle: 'Buy price',
			subtitleValue: '($)',
			min: buyPrice.min,
			max: buyPrice.max,
			val: 'buyPrice',
		},
		{
			title: 'Sell price',
			subtitle: 'Sell price',
			subtitleValue: '($)',
			min: sellPrice.min,
			max: sellPrice.max,
			val: 'sellPrice',
		},
		{
			title: 'Return on investment',
			subtitle: 'ROI',
			subtitleValue: '(%)',
			min: roi.min,
			max: roi.max,
			val: 'roi',
		},
		{
			title: "Best seller's rank",
			subtitle: 'BSR',
			subtitleValue: null,
			min: bsr.min,
			max: bsr.max,
			val: 'bsr',
		},
		{
			title: 'Monthly sales',
			subtitle: 'Sales / mo.',
			subtitleValue: null,
			min: monthlySales.min,
			max: monthlySales.max,
			val: 'monthlySales',
		},
		{
			title: 'Weight',
			subtitle: 'Weight',
			subtitleValue: '(lb)',
			min: weight.min,
			max: weight.max,
			val: 'weight',
		},
		{
			title: 'Category',
			subtitle: 'Choose a category',
			subtitleValue: null,
		},
	];
	return (
		<article
			ref={wrapperRef}
			className='absolute top-0 right-0 z-10 w-64 transform translate-y-10 -translate-x-48 pt-4 pb-2 rounded-lg bg-white shadow-lg text-gray-900'
		>
			<div className='relative'>
				<header className='pb-2 px-4 flex items-center justify-between'>
					<div>
						<h5 className='inline-block font-bold text-lg'>Filters</h5>
					</div>
					<button
						onClick={() => getLeads(user, 1, filters)}
						className='font-semibold text-sm text-purple-600 hover:text-gray-700 transition-colors duration-100 ease-in-out'
					>
						Apply
					</button>
				</header>
				{filterItems.map((item, i) => (
					<FilterItem
						key={i}
						title={item.title}
						subtitle={item.subtitle}
						subtitleValue={item.subtitleValue}
						minDefault={item.min}
						maxDefault={item.max}
						val={item.val}
					/>
				))}
				<div className='border-t border-gray-200'>
					<div className='flex justify-end py-2 px-4'>
						<button
							onClick={() => {
								clearFilters();
								getLeads(user, 1, filters);
							}}
							className='font-semibold text-sm text-red-500'
						>
							Clear all
						</button>
					</div>
				</div>
			</div>
		</article>
	);
};

const mapStateToProps = (state) => {
	const { user } = state.auth;
	const { filters } = state;
	return { user, filters };
};

export default connect(mapStateToProps, { getLeads, clearFilters })(Filter);