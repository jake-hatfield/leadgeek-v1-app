import React, { useState, useRef, useEffect, useCallback } from 'react';

// redux
import { useAppSelector, useAppDispatch } from '@utils/hooks';
import { setAlert } from '@features/alert/alertSlice';
import { clearFilters } from '@features/filters/filtersSlice';
import { getFeedLeads } from '@features/leads/leadsSlice';

// components
import Button from '@components/utils/Button';
import Spinner from '@components/utils/Spinner';

// utils
import { useOutsideMousedown } from '@utils/utils';

interface FilterProps {
	filter: boolean;
	setFilter: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filter: React.FC<FilterProps> = ({ filter, setFilter }) => {
	const dispatch = useAppDispatch();
	// auth state
	const user = useAppSelector((state) => state.auth.user);
	const filters = useAppSelector((state) => state.filters);
	// local state
	const [addFilter, setAddFilter] = useState(false);
	const [clear, setClear] = useState(false);
	const [filterDescription, setFilterDescription] = useState(false);
	const [typeActive, setTypeActive] = useState(false);
	const [valueActive, setValueActive] = useState(false);

	// destructure necessary items
	const { netProfit, buyPrice, sellPrice, roi, bsr, monthlySales, weight } =
		filters;

	// close modal handlers
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

	const handleClearFilters = () => {
		setClear(true);
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
		dispatch(clearFilters());
		setFilter(false);
		user &&
			dispatch(
				getFeedLeads({
					user: {
						id: user._id,
						role: user.role,
					},
					page: 1,
					filters: emptyFilters,
				})
			);
		return dispatch(
			setAlert({
				title: 'All filters were removed',
				message: 'Unfiltered leads are now showing.',
				alertType: 'success',
			})
		);
	};

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
			min: bsr.min,
			max: bsr.max,
			val: 'bsr',
		},
		{
			title: 'Monthly sales',
			subtitle: 'Sales / mo.',
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
			min: null,
			max: null,
		},
	];

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
		itemLimit: 15,
		dateLimits: { min: null, max: null, selected: null },
	};

	const typeOptions = [{ type: 'numeric', title: 'Net profit' }];

	const valueOptions = [
		{
			value: 'gte',
			text: 'Greater than or equal to',
		},
		{
			value: 'gte',
			text: 'Less than or equal to',
		},
	];

	return user ? (
		<article
			ref={wrapperRef}
			className='absolute top-0 right-0 z-10 w-80 transform translate-y-12 -translate-x-48 pt-4 pb-1 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-900'
		>
			<div className='relative'>
				<header className='pb-2 px-4 flex items-center justify-between border-b border-gray-200'>
					<div>
						<h5 className='inline-block font-bold text-lg'>Filters</h5>
					</div>
					{/* <button
						onClick={() => {
							setFilter(false);
							setFilterCount();
							getFeedLeads({
								user: {
									id: user._id,
									role: user.role,
								},
								page: 1,
								filters,
							});
						}}
						className='font-semibold text-sm text-purple-500 rounded-sm hover:text-purple-600 transition-colors duration-100 ease-in-out ring-purple'
					>
						Apply
					</button> */}
					<button
						onClick={(e) => {
							e.stopPropagation();
							// setToggleItem((prev) => !prev);
							setAddFilter(true);
						}}
						onMouseEnter={() => setFilterDescription(true)}
						onMouseLeave={() => setFilterDescription(false)}
						className='relative p-0.5 rounded-md hover:bg-purple-500 text-gray-500 hover:text-white transition duration-100 ease-in-out ring-gray'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
							fill='currentColor'
							className='h-4 w-4'
						>
							<path
								fillRule='evenodd'
								d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z'
								clipRule='evenodd'
							/>
						</svg>
						{filterDescription && (
							<div className='absolute top-0 right-0 z-10 min-w-max mt-2 mr-6 p-2 transform translate-y-5 translate-x-6 rounded-md shadow-md bg-gray-900 text-left text-white text-xs'>
								Add a filter
							</div>
						)}
					</button>
				</header>
				{addFilter ? (
					<div>
						<div className='py-6 px-4'>
							<div className='relative flex items-center shadow-sm rounded-lg text-sm'>
								<div className='w-16 py-2 px-2 bg-gray-100 rounded-l-lg font-semibold text-center text-gray-700 border border-gray-200'>
									Type
								</div>
								<button
									type='button'
									className='relative w-full pl-2 pr-10 py-2 bg-white border-t border-b border-r border-gray-200 rounded-r-lg text-left cursor-default ring-purple ring-inset'
									aria-haspopup='listbox'
									aria-expanded='true'
									aria-labelledby='listbox-label'
									onClick={() => setTypeActive((prev) => !prev)}
								>
									<span className='flex items-center'>
										<span className='ml-2 block truncate'>
											Greater than or equal to
										</span>
									</span>
									<span className='ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
										<svg
											className='h-4 w-4 text-gray-400'
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 20 20'
											fill='currentColor'
											aria-hidden='true'
										>
											<path
												fill-rule='evenodd'
												d='M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
												clip-rule='evenodd'
											/>
										</svg>
									</span>
								</button>
								{typeActive && (
									<ul
										className='absolute right-0 z-10 max-h-56 w-full mt-1 py-1 bg-white border border-gray-200 shadow-md rounded-lg text-sm overflow-auto focus:outline-none transform translate-y-12'
										tabIndex={-1}
										role='listbox'
										aria-labelledby='listbox-label'
										aria-activedescendant='listbox-option-3'
									>
										{typeOptions.map((typeOption, i) => (
											<li
												key={i}
												className=' py-2 pl-3 pr-9 text-gray-900 cursor-default select-none relative hover:bg-gray-100'
												id={`listbox-option-${i - 1}`}
												role='option'
											>
												{typeOption.title}
											</li>
										))}
									</ul>
								)}
							</div>
							<div className='relative mt-2 flex items-center shadow-sm rounded-lg text-sm'>
								<div className='w-16 py-2 px-2 bg-gray-100 rounded-l-lg font-semibold text-center text-gray-700 border border-gray-200'>
									Value
								</div>
								<button
									type='button'
									className='relative w-full pl-2 pr-10 py-2 bg-white border-t border-b border-r border-gray-200 rounded-r-lg text-left cursor-default ring-purple ring-inset'
									aria-haspopup='listbox'
									aria-expanded='true'
									aria-labelledby='listbox-label'
									onClick={() => setValueActive((prev) => !prev)}
								>
									<span className='flex items-center'>
										<span className='ml-2 block truncate'>
											Greater than or equal to
										</span>
									</span>
									<span className='ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
										<svg
											className='h-4 w-4 text-gray-400'
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 20 20'
											fill='currentColor'
											aria-hidden='true'
										>
											<path
												fill-rule='evenodd'
												d='M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
												clip-rule='evenodd'
											/>
										</svg>
									</span>
								</button>
								{valueActive && (
									<ul
										className='absolute right-0 z-10 max-h-56 w-full mt-1 py-1 bg-white border border-gray-200 shadow-md rounded-lg text-sm overflow-auto focus:outline-none transform translate-y-16'
										tabIndex={-1}
										role='listbox'
										aria-labelledby='listbox-label'
										aria-activedescendant='listbox-option-3'
									>
										{valueOptions.map((valueOption, i) => (
											<li
												key={i}
												className=' py-2 pl-3 pr-9 text-gray-900 cursor-default select-none relative hover:bg-gray-100'
												id={`listbox-option-${i - 1}`}
												role='option'
											>
												{valueOption.text}
											</li>
										))}
									</ul>
								)}
							</div>
							<input
								type='text'
								className='mt-2 form-field'
								placeholder='Enter a value...'
							/>
							<div className='mt-2'>
								<Button
									text={'Apply'}
									onClick={() => console.log('hello')}
									width={'w-20'}
									margin={false}
									path={null}
									conditional={null}
									conditionalDisplay={null}
									size={'xs'}
									cta={true}
								/>
							</div>
						</div>
						<div className='border-t border-gray-200'>
							<div className='flex justify-end py-2 px-4'>
								<button
									onClick={() => {
										handleClearFilters();
									}}
									className='font-semibold text-sm text-red-500 hover:text-red-600 rounded-sm transition-colors duration-100 ease-in-out ring-red'
								>
									Clear all
								</button>
							</div>
						</div>
					</div>
				) : (
					<div className='py-6 px-4 font-semibold text-sm text-gray-700'>
						You haven't set any filters. Click the "+" in the top right corner
						to get started.
					</div>
				)}
			</div>
		</article>
	) : (
		<Spinner
			divWidth={null}
			center={false}
			spinnerWidth={null}
			margin={false}
			text={''}
		/>
	);
};

export default Filter;
