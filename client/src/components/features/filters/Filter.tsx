import React, { useState, useRef, useEffect, useCallback } from 'react';

// redux
import { useAppSelector, useAppDispatch } from '@utils/hooks';
import { removeAllAlerts, setAlert } from '@features/alert/alertSlice';
import { clearFilters, createFilter } from '@features/filters/filtersSlice';
import { getFeedLeads } from '@features/leads/leadsSlice';

// components
import Button from '@components/utils/Button';
import SelectComponent from '@components/utils/Select';
import Spinner from '@components/utils/Spinner';

// utils
import { useOutsideMousedown } from '@utils/utils';
import { User } from '@utils/interfaces/User';

interface FilterProps {
	filterActive: boolean;
	setFilterActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const Filter: React.FC<FilterProps> = ({ filterActive, setFilterActive }) => {
	const dispatch = useAppDispatch();
	// auth state
	const user = useAppSelector((state) => state.auth.user);
	const filters = useAppSelector((state) => state.filters);
	// local state
	const [addFilter, setAddFilter] = useState(false);
	const [categoryActive, setCategoryActive] = useState(false);
	const [filter, setFilter] = useState<{
		typeIs: {
			type: string;
			title: string;
			value: string;
		};
		valueIs: {
			type: string;
			title: string;
			value: string;
		};
		value: string | number;
	}>({
		typeIs: {
			type: typeOptions[0].type,
			title: typeOptions[0].title,
			value: typeOptions[0].value,
		},
		valueIs: {
			type: '',
			title:
				typeOptions[0].type === 'numeric'
					? numericValueOptions[0].title
					: textValueOptions[0].title,
			value:
				typeOptions[0].type === 'numeric'
					? numericValueOptions[0].value
					: textValueOptions[0].value,
		},
		value: '',
	});
	const [filterDescription, setFilterDescription] = useState(false);
	const [typeActive, setTypeActive] = useState(false);
	const [valueActive, setValueActive] = useState(false);

	// close modal handlers
	const wrapperRef = useRef(null);
	useOutsideMousedown(wrapperRef, setFilterActive, null);
	// close modal on esc key
	const keyPress = useCallback(
		(e) => {
			if (e.key === 'Escape' && filterActive) {
				setFilterActive(false);
			}
		},
		[setFilterActive, filterActive]
	);
	useEffect(() => {
		document.addEventListener('keydown', keyPress);
		return () => document.removeEventListener('keydown', keyPress);
	}, [keyPress]);

	const handleClearFilters = () => {
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
		setFilterActive(false);
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

	const handleFilterSubmit = (user: User) => {
		// make sure an empty string isn't being passed as a value
		if (!filter.value) {
			return dispatch(
				setAlert({
					title: 'Error creating filter',
					message: 'Please enter a valid number',
					alertType: 'danger',
				})
			);
		}
		// make sure the max filter isn't smaller than the min filter
		if (
			filter.typeIs.type === 'numeric' &&
			filter.valueIs.value === 'lte' &&
			filters[filter.typeIs.value].min > filter.value
		) {
			return dispatch(
				setAlert({
					title: 'Error creating filter',
					message:
						"The minimum filter can't be smaller than the maximum filter",
					alertType: 'danger',
				})
			);
		}
		// clear all alerts if we've made it past the checks
		dispatch(removeAllAlerts());
		// create the filter
		dispatch(
			createFilter({
				type: filter.typeIs.value,
				operator: filter.valueIs.value,
				value: filter.value,
			})
		);
		// get the newly filtered leads
		return getFeedLeads({
			user: {
				id: user._id,
				role: user.role,
			},
			page: 1,
			filters,
		});
	};

	console.log(filter.typeIs, filter.valueIs, filter.value);

	return user ? (
		<article
			ref={wrapperRef}
			className='absolute top-0 right-0 z-10 w-80 transform translate-y-12 -translate-x-48 pt-4 pb-1 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-900'
		>
			<div className='relative'>
				<header className='pb-2 px-4 flex items-center justify-between border-b border-gray-200'>
					<h5 className='inline-block font-bold text-lg'>Filters</h5>
					<button
						onClick={(e) => {
							e.stopPropagation();
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
							<div>
								<SelectComponent
									title={'Type'}
									options={typeOptions}
									selectedOption={filter.typeIs.title}
									openState={typeActive}
									setOpenState={setTypeActive}
									handleClick={(option: {
										type: string;
										title: string;
										value: string;
									}) =>
										setFilter({
											...filter,
											typeIs: {
												type: option.type,
												title: option.title,
												value: option.value,
											},
											valueIs: {
												type: option.type,
												title:
													option.type === 'numeric'
														? numericValueOptions[0].title
														: textValueOptions[0].title,
												value:
													option.type === 'numeric'
														? numericValueOptions[0].value
														: textValueOptions[0].value,
											},
											value:
												option.value === 'category'
													? 'Appliances'
													: typeof filter.value === 'number'
													? filter.value
													: '',
										})
									}
								/>
							</div>
							<div className='mt-2'>
								<SelectComponent
									title={'Value'}
									options={
										filter.typeIs.type === 'numeric'
											? numericValueOptions
											: textValueOptions
									}
									selectedOption={filter.valueIs.title}
									openState={valueActive}
									setOpenState={setValueActive}
									handleClick={(option: {
										type: string;
										title: string;
										value: string;
									}) =>
										setFilter({
											...filter,
											valueIs: {
												type: option.type,
												title: option.title,
												value: option.value,
											},
										})
									}
								/>
							</div>
							{filter.typeIs.value === 'category' ? (
								<div className='mt-2'>
									<SelectComponent
										title={'Item'}
										options={categoryOptions}
										selectedOption={filter.value}
										openState={categoryActive}
										setOpenState={setCategoryActive}
										handleClick={(option: { title: string }) =>
											setFilter({
												...filter,
												value: option.title,
											})
										}
									/>
								</div>
							) : (
								<input
									type='text'
									className='mt-2 form-field'
									onChange={(e) =>
										setFilter({
											...filter,
											value: +e.target.value,
										})
									}
									placeholder='Enter a value...'
								/>
							)}

							<div className='flex items-center justify-end'>
								<div className='mt-2'>
									<Button
										text={'Cancel'}
										onClick={() => {
											setAddFilter(false);
										}}
										width={'w-20'}
										margin={false}
										path={null}
										conditional={null}
										conditionalDisplay={null}
										size={'xs'}
										cta={false}
									/>
								</div>

								<div className='mt-2 ml-4'>
									<Button
										text={'Apply'}
										onClick={() => {
											handleFilterSubmit(user);
										}}
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

const emptyFilters = {
	count: 0,
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
	source: [],
	prep: {
		unit: null,
		lb: null,
	},
	itemLimit: 15,
	dateLimits: { min: null, max: null, selected: null },
};

const typeOptions = [
	{ type: 'numeric', title: 'Profit', value: 'netProfit' },
	{ type: 'numeric', title: 'Buy price', value: 'buyPrice' },
	{ type: 'numeric', title: 'Sell price', value: 'sellPrice' },
	{ type: 'numeric', title: 'Return on investment', value: 'roi' },
	{ type: 'numeric', title: "Best seller's rank", value: 'bsr' },
	{ type: 'numeric', title: 'Monthly sales', value: 'monthlySales' },
	{ type: 'numeric', title: 'Weight', value: 'weight' },
	{ type: 'text', title: 'Category', value: 'category' },
];

const numericValueOptions = [
	{
		type: 'numeric',
		title: 'Greater than',
		value: 'gte',
	},
	{
		type: 'numeric',
		title: 'Less than',
		value: 'lte',
	},
];

const textValueOptions = [
	{
		type: 'text',
		title: 'Equals',
		value: 'eq',
	},
];

const categoryOptions = [
	{ title: 'Appliances' },
	{ title: 'Arts, Crafts, & Sewing' },
	{ title: 'Automotive Parts & Accessories' },
	{ title: 'Baby' },
	{ title: 'Beauty & Personal Care' },
	{ title: 'Books' },
	{ title: 'CDs & Vinyl' },
	{ title: 'Cell Phones & Accessories' },
	{ title: 'Clothing, Shoes & Jewelry' },
	{ title: 'Computers' },
	{ title: 'Electronics' },
	{ title: 'Garden & Outdoor' },
	{ title: 'Grocery & Gourmet Food' },
	{ title: 'Handmade' },
	{ title: 'Health, Household & Baby Care' },
	{ title: 'Home & Kitchen' },
	{ title: 'Industrial & Scientific' },
	{ title: 'Luggage & Travel Gear' },
	{ title: 'Movies & TV' },
	{ title: 'Musical Instruments' },
	{ title: 'Office Products' },
	{ title: 'Pet Supplies' },
	{ title: 'Sports & Outdoors' },
	{ title: 'Tools & Home Improvement' },
	{ title: 'Toys & Games' },
	{ title: 'Video Games' },
];

export default Filter;
