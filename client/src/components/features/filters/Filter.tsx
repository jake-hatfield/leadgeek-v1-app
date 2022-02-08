import React, { useState, useRef } from 'react';

// packages
import axios from 'axios';
import { useHotkeys } from 'react-hotkeys-hook';

// redux
import { useAppSelector, useAppDispatch } from '@hooks/hooks';
import { removeAlert, setAlert } from '@features/alert/alertSlice';
import {
	clearFilter,
	clearFilters,
	createFilter,
	setFilters,
} from '@features/filters/filtersSlice';
import { getFeedLeads } from '@features/leads/leadsSlice';

// components
import Button from '@components/utils/Button';
import SelectComponent from '@components/utils/Select';
import Spinner from '@components/utils/Spinner';

// utils
import { config, numberWithCommas, useOutsideMousedown } from '@utils/utils';
import {
	Filter,
	FilterOperators,
	FilterTitles,
	FilterTypes,
} from '@utils/interfaces/Filter';

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
	const [filterPreset, setFilterPreset] = useState<{
		title: string;
		filters: Filter[];
	}>({
		title: '',
		filters: [],
	});
	const [importDescription, setImportDescription] = useState(false);
	const [importFilter, setImportFilter] = useState(false);
	const [importFilterDropdown, setImportFilterDropdown] = useState(false);
	const [saveFilter, setSaveFilter] = useState(false);
	const [sourceActive, setSourceActive] = useState(false);
	const [typeActive, setTypeActive] = useState(false);
	const [valueActive, setValueActive] = useState(false);

	// close modal handlers
	const wrapperRef = useRef(null);
	useOutsideMousedown(wrapperRef, setFilterActive, null);

	// hotkeys
	// close details on escape key
	useHotkeys(
		'Escape',
		() => {
			filterActive && setFilterActive(false);
		},
		{ keyup: true }
	);

	useHotkeys(
		'Enter',
		() => {
			handleFilterSubmit();
		},
		{ keyup: true }
	);

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
				title: 'Success',
				message: 'All filters were removed',
				alertType: 'success',
			})
		);
	};

	const handleSaveFilters = async () => {
		setSaveFilter(true);
		setImportFilter(false);
		setAddFilter(false);
		dispatch(removeAlert());

		if (!filterPreset.title) {
			return dispatch(
				setAlert({
					title: 'Error',
					message: 'Please enter a name for this filter preset',
					alertType: 'danger',
				})
			);
		}

		// TODO: Logic for checking duplicate presets

		const body = JSON.stringify({
			name: filterPreset.title,
			filters: filters.filters,
		});

		await axios.post('/api/users/settings/filters', body, config);

		setSaveFilter(false);
	};

	const handleDeleteFilter = async () => {
		dispatch(removeAlert());

		await axios.delete(
			`/api/users/settings/filter?title=${filterPreset.title}`
		);

		dispatch(
			setAlert({
				title: 'Success',
				message: 'Filter preset was successfully deleted',
				alertType: 'success',
			})
		);
	};

	const handleFilterSubmit = () => {
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
							message: 'The max value must be larger than the min value',
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
		if (alert) {
			// clear all alerts if we've made it past the checks
			dispatch(removeAlert());
		}

		// create the filter
		dispatch(
			createFilter(
				filter.typeIs.type,
				filter.typeIs.value,
				filter.typeIs.title,
				filter.valueIs.value,
				filter.value
			)
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
			page: 1,
			filters,
		});
	};

	return user ? (
		<article
			ref={wrapperRef}
			className='absolute top-0 right-0 z-30 w-80 pt-4 pb-1 cs-light-400 card-200 text-300 mt-12 mr-32'
		>
			<div className='relative'>
				<header className='pb-2 px-4 center-between border-b border-200'>
					<div className='flex items-center'>
						<h5 className='inline-block font-bold text-lg'>Filters</h5>
						{filters.count > 0 && (
							<div className='ml-4 py-1 px-2 cs-teal rounded-main text-xs font-semibold'>
								<span>{filters.count}</span>
								<span className='ml-1'>active</span>
							</div>
						)}
					</div>
					<div>
						<button
							onClick={() => {
								if (importFilter) return;
								setImportFilter(true);
								setImportDescription(false);
								setAddFilter(false);
								setSaveFilter(false);
							}}
							onMouseEnter={() => !importFilter && setImportDescription(true)}
							onMouseLeave={() => setImportDescription(false)}
							className={`relative ${
								importFilter ? 'icon-button-disabled' : 'icon-button'
							}`}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='svg-sm'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								<path d='M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z' />
							</svg>
							{importDescription && (
								<div className='absolute top-0 right-0 z-10 min-w-max p-2 transform -translate-y-1.5 -translate-x-8 rounded-md shadow-md bg-gray-900 text-left text-white text-xs'>
									Apply preset
								</div>
							)}
						</button>

						<button
							onClick={() => {
								if (addFilter) return;
								setAddFilter(true);
								setFilterDescription(false);
								setImportFilter(false);
								setSaveFilter(false);
							}}
							onMouseEnter={() => !addFilter && setFilterDescription(true)}
							onMouseLeave={() => setFilterDescription(false)}
							className={`ml-2 relative ${
								addFilter ? 'icon-button-disabled' : 'icon-button'
							}`}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								viewBox='0 0 20 20'
								fill='currentColor'
								className='svg-sm'
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
					</div>
				</header>
				{/* filter information */}
				<div>
					<div className='p-4'>
						{filters.count === 0 &&
							!addFilter &&
							!importFilter &&
							!saveFilter && (
								<div className='font-semibold text-sm text-gray-700 dark:text-gray-400'>
									You haven't added any filters yet. Click the + in the top
									right corner to get started. You can also create or apply a
									filter preset.
								</div>
							)}
						{saveFilter && (
							<div className='p-4'>
								<input
									type='text'
									className='mt-2 form-field input'
									onChange={(e) =>
										setFilterPreset({
											...filterPreset,
											title: e.target.value,
										})
									}
									value={filterPreset.title}
									placeholder='Enter a name for this preset...'
								/>
								<div className='flex items-center justify-end'>
									<div className='mt-2'>
										<Button
											text={'Cancel'}
											onClick={() => {
												setImportFilter(false);
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
												dispatch(
													setFilters(
														user.settings.filterPresets.filter(
															(f) =>
																f.title === user.settings.filterPresets[0].title
														)[0].filters
													)
												);
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
						{importFilter && (
							<div>
								<SelectComponent
									title={'Preset'}
									options={user.settings.filterPresets}
									selectedOption={
										filterPreset.title || user.settings.filterPresets[0].title
									}
									openState={importFilterDropdown}
									setOpenState={setImportFilterDropdown}
									handleClick={(option: {
										title: string;
										filters: Filter[];
									}) => {
										setFilterPreset((prevState) => ({
											...prevState,
											title: option.title,
											filters: option.filters,
										}));
									}}
								/>
								<div
									className={`flex items-center justify-end ${
										filterPreset.filters.length > 0 ? 'pb-4' : ''
									}`}
								>
									<div className='mt-2'>
										<Button
											text={'Cancel'}
											onClick={() => {
												setImportFilter(false);
												setFilterPreset((prevState) => ({
													...prevState,
													title: '',
													filters: [],
												}));
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
												dispatch(
													setFilters(
														user.settings.filterPresets.filter(
															(preset) => preset.title === filterPreset.title
														)[0].filters
													)
												);
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
								{filterPreset.filters.length > 0 && (
									<div className='font-semibold text-sm text-100'>
										<h6>Filters to be applied</h6>
										<ul className='py-2'>
											{filterPreset.filters.map((f, i) => (
												<ActiveFilter key={i} filter={f} clearable={false} />
											))}
										</ul>
									</div>
								)}
							</div>
						)}
						{addFilter && (
							<div className={filters.count > 0 ? 'pb-4' : ''}>
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
														: option.value === 'source'
														? '511 Tactical'
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
								) : filter.typeIs.value === 'source' ? (
									<div className='mt-2'>
										<SelectComponent
											title={'Item'}
											options={sourceOptions}
											selectedOption={filter.value}
											openState={sourceActive}
											setOpenState={setSourceActive}
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
										className='mt-2 form-field input'
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
												handleFilterSubmit();
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
						{filters.count > 0 && !importFilter && (
							<div>
								{/* list active filters */}
								{filters.count > 0 && (
									<div className='font-semibold text-sm text-100'>
										{(saveFilter || addFilter) && (
											<h5>
												{saveFilter ? 'Filters to be saved' : 'Active filters'}
											</h5>
										)}
										<ul className='py-2'>
											{filters.filters.map((filter: Filter, i: number) => (
												<ActiveFilter
													key={i}
													filter={filter}
													clearable={true}
												/>
											))}
										</ul>
									</div>
								)}
							</div>
						)}
					</div>
					{/* save/clear filters */}
					<div className='center-between py-2 px-3 border-t border-200'>
						<button
							onClick={() => {
								handleSaveFilters();
							}}
							disabled={!importFilter || !filters.count}
							className={`py-1 px-2 font-semibold text-sm ${
								importFilter || filters.count > 0
									? 'link'
									: 'text-gray-200 cursor-default'
							}`}
						>
							{importFilter
								? 'Edit preset'
								: filterPreset.title
								? 'Save changes'
								: 'Create preset'}
						</button>
						<button
							onClick={() => {
								importFilter ? handleDeleteFilter() : handleClearFilters();
							}}
							disabled={!importFilter || !filters.count}
							className={`py-1 px-2 font-semibold text-sm ${
								importFilter || filters.count > 0
									? 'hover:bg-red-100 dark:hover:bg-red-400 text-red-500 dark:text-red-300 hover:text-red-600 dark:hover:text-white rounded-main transition-main ring-red'
									: 'text-gray-200 cursor-default'
							}`}
						>
							{importFilter ? 'Delete preset' : 'Clear all'}
						</button>
					</div>
				</div>
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
	clearable: boolean;
}

const ActiveFilter: React.FC<ActiveFilterProps> = ({ filter, clearable }) => {
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
		} else if (type === 'bsrCurrent') {
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
		<li className='first:mt-0 mt-2 w-full py-2 pl-4 pr-3 center-between bg-gray-100 dark:bg-darkGray-100 card-100 text-200 transition-colors-main focus:outline-none'>
			<div className='flex items-center truncate mr-2'>
				<span className='flex-none'>{filter.title}</span>
				<span className='ml-1'>
					{filter.operator === 'gte'
						? '>'
						: filter.operator === 'lte'
						? '<'
						: filter.operator === 'eq'
						? '='
						: 'is'}
				</span>
				<span className='ml-1 overflow-ellipsis'>
					{`${valuePreproccesor(filter.type)}${valueProcessor(
						filter.type,
						filter.value
					)}${valuePostproccesor(filter.type)}`}
				</span>
			</div>
			{clearable && (
				<button
					onClick={() => dispatch(clearFilter({ id: filter.id }))}
					onMouseEnter={() => setFilterDescription(true)}
					onMouseLeave={() => setFilterDescription(false)}
					className='relative icon-button'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 20 20'
						fill='currentColor'
						className='svg-sm'
					>
						<path
							fillRule='evenodd'
							d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
							clipRule='evenodd'
						/>
					</svg>
					{filterDescription && (
						<div className='absolute top-0 right-0 z-10 min-w-max p-2 rounded-md shadow-md bg-gray-900 text-left text-white text-xs transform -translate-y-1 -translate-x-8'>
							Clear filter
						</div>
					)}
				</button>
			)}
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
	{ type: 'numeric', title: "Best seller's rank", value: 'bsrCurrent' },
	{ type: 'numeric', title: 'Monthly sales', value: 'monthlySales' },
	{ type: 'numeric', title: 'Weight', value: 'weight' },
	{ type: 'text', title: 'Category', value: 'category' },
	{ type: 'text', title: 'Source', value: 'source' },
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

const sourceOptions = [
	{ title: '511 Tactical' },
	{ title: '6 PM' },
	{ title: 'Academy' },
	{ title: 'Ace Hardware' },
	{ title: 'American Eagle' },
	{ title: 'Albee Baby' },
	{ title: 'Amazon' },
	{ title: 'American Apparel' },
	{ title: 'Art Supply Warehouse' },
	{ title: 'Backcountry' },
	{ title: 'Barnes and Noble' },
	{ title: 'Bath and Body Works' },
	{ title: 'BB Toy Store' },
	{ title: "Beall's Florida" },
	{ title: 'Beauty Brands' },
	{ title: 'Bed, Bath, and Beyond' },
	{ title: 'Belk' },
	{ title: 'Belkin' },
	{ title: "Bergner's" },
	{ title: 'Best Buy' },
	{ title: 'Big 5 Sporting Goods' },
	{ title: 'Big Bad Toy Store' },
	{ title: 'Big Lots' },
	{ title: 'Bits and Pieces' },
	{ title: "BJ's" },
	{ title: "Bloomingdale's" },
	{ title: 'Body Building' },
	{ title: 'Books-a-Million' },
	{ title: "Boscov's" },
	{ title: 'Buy Buy Baby' },
	{ title: 'Century 21' },
	{ title: 'Camping World' },
	{ title: "Carter's" },
	{ title: 'Chewy' },
	{ title: 'Christian Book' },
	{ title: "Claire's" },
	{ title: 'Columbia' },
	{ title: 'Costco' },
	{ title: 'Crayola' },
	{ title: 'DC Shoes' },
	{ title: 'Dickies' },
	{ title: "Dick's Sporting Goods" },
	{ title: "Dillard's" },
	{ title: 'Dollar General' },
	{ title: 'Dollar Tree' },
	{ title: 'Drug Supply Store' },
	{ title: 'DSW' },
	{ title: 'Easton' },
	{ title: 'Element Outfitters' },
	{ title: 'Eastern Mountain Sports' },
	{ title: 'Entirely Pets' },
	{ title: 'Everything Kitchens' },
	{ title: 'eVitamins' },
	{ title: 'Fat Brain Toys' },
	{ title: 'Fleet Farm' },
	{ title: 'FootSmart' },
	{ title: 'Forbidden Planet' },
	{ title: 'Fun' },
	{ title: 'FYE' },
	{ title: 'Game Nerdz' },
	{ title: 'Gamestop' },
	{ title: 'GNC' },
	{ title: 'Guitar Center' },
	{ title: 'Hasbro Pulse' },
	{ title: 'Healthy Pets' },
	{ title: "Herberger's" },
	{ title: 'Hobby Lobby' },
	{ title: 'Home Depot' },
	{ title: 'Hot Topic' },
	{ title: 'iHerb' },
	{ title: 'JCPenney' },
	{ title: "Journey's" },
	{ title: 'KatVonD Beauty' },
	{ title: 'Keurig' },
	{ title: 'Kmart' },
	{ title: "Kohl's" },
	{ title: 'Lakeside' },
	{ title: 'LEGO' },
	{ title: 'Logitech' },
	{ title: "Lowe's" },
	{ title: 'LTD Commodities' },
	{ title: 'Lucky Brand' },
	{ title: "Macy's" },
	{ title: 'Marvel' },
	{ title: 'Mattel' },
	{ title: 'Mernards' },
	{ title: 'Merrell' },
	{ title: 'Michaels' },
	{ title: 'Michaels Kids' },
	{ title: 'Micro Center' },
	{ title: 'Miniature Market' },
	{ title: 'Moosejaw' },
	{ title: 'NBC Store' },
	{ title: 'Netrition' },
	{ title: 'Newegg' },
	{ title: 'Nike' },
	{ title: 'Nordstrom Rack' },
	{ title: 'Office Depot' },
	{ title: 'Office Supply' },
	{ title: 'Oriental Trading' },
	{ title: 'OshKosh' },
	{ title: 'Overstock' },
	{ title: 'Pampered Chef' },
	{ title: 'Party City' },
	{ title: 'PishPosh Baby' },
	{ title: 'Puma' },
	{ title: 'Quiksilver' },
	{ title: 'RadioShack' },
	{ title: 'REI' },
	{ title: 'Restaurant Supply' },
	{ title: "Rogan's Shoes" },
	{ title: 'Sally Beauty' },
	{ title: "Sam's Club" },
	{ title: 'Saucony' },
	{ title: 'Sears' },
	{ title: 'Sears Outlet' },
	{ title: 'Sephora' },
	{ title: 'Shoe Carnival' },
	{ title: 'Shop Bop' },
	{ title: 'Shop Disney' },
	{ title: 'Sierra' },
	{ title: "Spencer's" },
	{ title: 'Sperry' },
	{ title: 'Staples' },
	{ title: 'Steep and Cheap' },
	{ title: 'Sun & Ski' },
	{ title: 'Sur La Table' },
	{ title: 'Target' },
	{ title: 'Tin Toy Arcade' },
	{ title: 'Too Faced' },
	{ title: 'Tower Hobbies' },
	{ title: 'Toy Tokyo' },
	{ title: 'Toy Wiz' },
	{ title: 'True Value' },
	{ title: "Uncle Dan's" },
	{ title: 'Ulta' },
	{ title: 'US Toy' },
	{ title: 'Vitacost' },
	{ title: 'Vitamin Shoppe' },
	{ title: 'Vitamin World' },
	{ title: 'Walgreens' },
	{ title: 'Walmart' },
	{ title: 'Williams-Sonoma' },
	{ title: 'World Market' },
	{ title: 'Zappos' },
	{ title: 'Zumiez' },
];

export default FilterComponent;
