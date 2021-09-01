import React, { useState, useRef, useEffect, useCallback } from 'react';

import FilterItem from './FilterItem';
import { useOutsideMousedown } from '@utils/utils';
import { getFeedLeads } from '@features/leads/leadsSlice';
import { setFilterCount, clearFilters } from '@features/filters/filtersSlice';

import { useAppSelector, useAppDispatch } from '@utils/hooks';

import { User } from '@utils/interfaces/User';

interface FilterProps {
	user: User;
	filters: any;
	filter: any;
	setFilter: React.Dispatch<React.SetStateAction<boolean>>;
	setFilterCount: React.Dispatch<React.SetStateAction<number>>;
}

const Filter: React.FC<FilterProps> = ({ filter, setFilter }) => {
	const dispatch = useAppDispatch();

	const user = useAppSelector((state) => state.auth.user);
	const filters = useAppSelector((state) => state.filters);

	const wrapperRef = useRef(null);
	useOutsideMousedown(wrapperRef, setFilter, null);
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

	const { netProfit, buyPrice, sellPrice, roi, bsr, monthlySales, weight } =
		filters;

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
			subtitle: 'Select a category',
		},
	];

	const [clear, setClear] = useState(false);
	const emptyFilters = {
		count: null,
		netProfit: {
			min: null,
			max: null,
		},
		buyPrice: {
			min: null,
			max: null,
		},
		sellPrice: {
			min: null,
			max: null,
		},
		roi: {
			min: null,
			max: null,
		},
		bsr: {
			min: null,
			max: null,
		},
		monthlySales: {
			min: null,
			max: null,
		},
		weight: {
			min: null,
			max: null,
		},
		category: [],
		prep: {
			unit: null,
			lb: null,
		},
		itemLimits: {
			leadsLimit: 15,
			searchLimit: 15,
			usersLimit: 15,
		},
		dateLimits: { min: null, max: null, selected: null },
	};

	return (
		<article
			ref={wrapperRef}
			className='absolute top-0 right-0 z-10 w-64 transform translate-y-12 -translate-x-48 pt-4 pb-1 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-900'
		>
			<div className='relative'>
				<header className='pb-2 px-4 flex items-center justify-between border-b border-gray-200'>
					<div>
						<h5 className='inline-block font-bold text-lg'>Filters</h5>
					</div>
					<button
						onClick={() => {
							setFilter(false);
							setFilterCount();
							getFeedLeads(user, 1, filters);
						}}
						className='font-semibold text-sm text-purple-500 rounded-sm hover:text-purple-600 transition-colors duration-100 ease-in-out ring-purple'
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
						clear={clear}
					/>
				))}
				<div className='border-t border-gray-200'>
					<div className='flex justify-end py-2 px-4'>
						<button
							onClick={() => {
								setClear(true);
								clearFilters();
								setFilter(false);
								getFeedLeads(user, 1, emptyFilters);
							}}
							className='font-semibold text-sm text-red-500 hover:text-red-600 rounded-sm transition-colors duration-100 ease-in-out ring-red'
						>
							Clear all
						</button>
					</div>
				</div>
			</div>
		</article>
	);
};

export default Filter;
