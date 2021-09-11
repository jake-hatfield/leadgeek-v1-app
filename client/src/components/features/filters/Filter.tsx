import React, { useState, useRef, useEffect, useCallback } from 'react';

// redux
import { useAppSelector, useAppDispatch } from '@utils/hooks';
import { removeAllAlerts, setAlert } from '@features/alert/alertSlice';
import {
	clearFilter,
	clearFilters,
	createFilter,
} from '@features/filters/filtersSlice';
import { getFeedLeads } from '@features/leads/leadsSlice';

// components
import Button from '@components/utils/Button';
import SelectComponent from '@components/utils/Select';
import Spinner from '@components/utils/Spinner';

// utils
import { numberWithCommas, useOutsideMousedown } from '@utils/utils';
import {
	Filter,
	FilterOperators,
	FilterTitles,
	FilterTypes,
} from '@utils/interfaces/Filter';
import { User } from '@utils/interfaces/User';

type NumericOrTextStrings = 'numeric' | 'text';

interface FilterComponentProps {
	filterActive: boolean;
	setFilterActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
	filterActive,
	setFilterActive,
}) => {
	const dispatch = useAppDispatch();
	// alert state
	const alert = useAppSelector((state) => state.alert);
	// auth state
	const user = useAppSelector((state) => state.auth.user);
	const filters = useAppSelector((state) => state.filters);
	// local state
	const [addFilter, setAddFilter] = useState(false);
	const [categoryActive, setCategoryActive] = useState(false);
	const [filter, setFilter] = useState<{
		typeIs: {
			type: 'numeric' | 'text';
			title: FilterTitles;
			value: FilterTypes;
		};
		valueIs: {
			type: string;
			title: string;
			value: FilterOperators;
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
					filters: {
						...filters,
						count: 0,
						filters: [],
					},
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

		// fn returns the current min or max value of a specified filter if it exists
		const getFilterValue = (type: string, operator: 'gte' | 'lte') => {
			const maxFilter = filters.filters.filter(
				(filter: Filter) => filter.type === type && filter.operator === operator
			)[0];

			if (maxFilter) {
				return maxFilter.value;
			} else {
				return null;
			}
		};

		// validation for all numeric filters
		if (filter.typeIs.type === 'numeric') {
			// check for creating a new max/lte filter
			if (filter.valueIs.value === 'lte') {
				// get the current minimum filter if one exists
				const minFilter = getFilterValue(filter.typeIs.value, 'gte');
				// make sure the min filter isn't larger than the max filter trying to be applied
				if (minFilter && minFilter >= filter.value) {
					return dispatch(
						setAlert({
							title: 'Error creating filter',
							message:
								"The maximum filter can't be smaller than the current minimum filter",
							alertType: 'danger',
						})
					);
				}
			} else {
				// check for creating a new min/gte filter
				// get the current maximum filter if one exists
				const maxFilter = getFilterValue(filter.typeIs.value, 'lte');
				// make sure the max filter isn't smaller than the current min filter trying to be applied
				if (maxFilter && maxFilter <= filter.value) {
					return dispatch(
						setAlert({
							title: 'Error creating filter',
							message:
								"The minimum filter can't be larger than the current maximum filter",
							alertType: 'danger',
						})
					);
				}
			}
		}

		// check if there's an alert
		if (alert.length > 0) {
			// clear all alerts if we've made it past the checks
			dispatch(removeAllAlerts());
		}

		// create the filter
		dispatch(
			createFilter({
				type: filter.typeIs.value,
				title: filter.typeIs.title,
				operator: filter.valueIs.value,
				value: filter.value,
			})
		);

		// reset local filter state
		setFilter({
			...filter,
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
		});

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

	// console.log(filter.typeIs, filter.valueIs, filter.value);

	return user ? (
		<article
			ref={wrapperRef}
			className='absolute top-0 right-0 z-10 w-80 transform translate-y-12 -translate-x-48 pt-4 pb-1 rounded-lg bg-white shadow-lg border border-gray-200 text-gray-900'
		>
			<div className='relative'>
				<header className='pb-2 px-4 flex items-center justify-between border-b border-gray-200'>
					<div className='flex items-center'>
						<h5 className='inline-block font-bold text-lg'>Filters</h5>
						{filters.count > 0 && (
							<div className='ml-2 py-1 px-2 bg-teal-200 text-xs font-semibold text-teal-600 rounded-lg'>
								<span>{filters.count}</span>
								<span className='ml-1'>active</span>
							</div>
						)}
					</div>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setAddFilter(true);
						}}
						onMouseEnter={() => setFilterDescription(true)}
						onMouseLeave={() => setFilterDescription(false)}
						className='relative p-1 rounded-md hover:bg-purple-500 text-gray-500 hover:text-white transition duration-100 ease-in-out ring-gray'
					>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
							fill='currentColor'
							className='h-4 w-4'
						>
							<path
								fillRule='evenodd'
								d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
								clipRule='evenodd'
							/>
						</svg>
						{filterDescription && (
							<div className='absolute top-0 right-0 z-10 min-w-max p-2 transform -translate-y-1.5 -translate-x-8 rounded-md shadow-md bg-gray-900 text-left text-white text-xs'>
								Add filter
							</div>
						)}
					</button>
				</header>
				{filters.filters.length > 0 || addFilter ? (
					<div>
						{addFilter && (
							<div className='pt-6 pb-2 px-4'>
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
													type: option.type as NumericOrTextStrings,
													title: option.title as FilterTitles,
													value: option.value as FilterTypes,
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
													value: option.value as FilterOperators,
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
										placeholder='Enter an amount...'
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
						)}
						{filters.filters.length > 0 && (
							<div className='font-semibold text-sm text-gray-700'>
								<ul className='py-2 px-4'>
									{filters.filters.map((filter: Filter, i: number) => (
										<ActiveFilter key={i} filter={filter} />
									))}
								</ul>
							</div>
						)}
						<div className='border-t border-gray-200'>
							<div className='flex justify-end py-2 px-4'>
								<button
									onClick={() => {
										handleClearFilters();
									}}
									className='py-1 px-2 font-semibold text-sm hover:bg-red-100 text-red-500 hover:text-red-600 rounded-lg transition-main duration-100 ease-in-out ring-red'
								>
									Clear all
								</button>
							</div>
						</div>
					</div>
				) : (
					<div className='py-6 px-4 font-semibold text-sm text-gray-700'>
						You haven't added any filters. Click the "+" in the top right corner
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

interface ActiveFilterProps {
	filter: Filter;
}

const ActiveFilter: React.FC<ActiveFilterProps> = ({ filter }) => {
	const dispatch = useAppDispatch();
	// local state
	const [filterDescription, setFilterDescription] = useState(false);

	// return appropriate indicator before the value
	const valuePreproccesor = (type: FilterTypes) => {
		if (type === 'netProfit' || type === 'buyPrice' || type === 'sellPrice') {
			return '$';
		} else {
			return '';
		}
	};

	// return appropriate value
	const valueProcessor = (type: FilterTypes, value: string | number) => {
		if (type === 'roi') {
			return numberWithCommas(100 * +value);
		} else if (type === 'bsr') {
			return numberWithCommas(+value);
		} else {
			return value;
		}
	};

	// return appropriate indicator after the value
	const valuePostproccesor = (type: FilterTypes) => {
		if (type === 'roi') {
			return '%';
		} else if (type === 'weight') {
			return ' lb';
		} else {
			return '';
		}
	};

	return (
		<li className='first:mt-0 mt-2 w-full py-2 px-4 flex items-center justify-between bg-gray-100 rounded-lg transition-colors-main focus:outline-none'>
			<div className='flex items-center pr-2'>
				<span className='truncate'>{filter.title}</span>
				<span className='ml-1'>
					{filter.operator === 'gte'
						? '>'
						: filter.operator === 'lte'
						? '<'
						: filter.operator === 'eq'
						? '='
						: 'is'}
				</span>
				<span className='ml-1'>
					{`${valuePreproccesor(filter.type)}${valueProcessor(
						filter.type,
						filter.value
					)}${valuePostproccesor(filter.type)}`}
				</span>
			</div>
			<button
				onClick={() =>
					dispatch(
						clearFilter({ type: filter.type, operator: filter.operator })
					)
				}
				onMouseEnter={() => setFilterDescription(true)}
				onMouseLeave={() => setFilterDescription(false)}
				className='relative p-1 rounded-md hover:bg-purple-500 text-gray-500 hover:text-white transition duration-100 ease-in-out ring-gray'
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					className='h-4 w-4'
				>
					<path
						fillRule='evenodd'
						d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
						clipRule='evenodd'
					/>
				</svg>
				{filterDescription && (
					<div className='absolute top-0 right-0 z-10 min-w-max p-2 transform -translate-y-1 -translate-x-8 rounded-md shadow-md bg-gray-900 text-left text-white text-xs'>
						Clear filter
					</div>
				)}
			</button>
		</li>
	);
};

interface TypeOption {
	type: 'numeric' | 'text';
	title: FilterTitles;
	value: FilterTypes;
}

const typeOptions: TypeOption[] = [
	{ type: 'numeric', title: 'Profit', value: 'netProfit' },
	{ type: 'numeric', title: 'Buy price', value: 'buyPrice' },
	{ type: 'numeric', title: 'Sell price', value: 'sellPrice' },
	{ type: 'numeric', title: 'Return on investment', value: 'roi' },
	{ type: 'numeric', title: "Best seller's rank", value: 'bsr' },
	{ type: 'numeric', title: 'Monthly sales', value: 'monthlySales' },
	{ type: 'numeric', title: 'Weight', value: 'weight' },
	{ type: 'text', title: 'Category', value: 'category' },
];

interface NumericOption {
	type: 'numeric';
	title: string;
	value: 'gte' | 'lte';
}

const numericValueOptions: NumericOption[] = [
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

interface TextOption {
	type: 'text';
	title: string;
	value: 'eq';
}

const textValueOptions: TextOption[] = [
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

export default FilterComponent;