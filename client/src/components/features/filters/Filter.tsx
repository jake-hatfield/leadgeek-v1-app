import React, { useState, useRef, useEffect } from 'react';

// packages
import axios from 'axios';
import { useHotkeys } from 'react-hotkeys-hook';

// redux
import { useAppSelector, useAppDispatch } from '@hooks/hooks';
import { removeAlert, setAlert } from '@features/alert/alertSlice';
import { setUserFilterGroup } from '@features/auth/authSlice';
import {
	clearFilter,
	clearFilters,
	createFilter,
	setFilters,
} from '@features/filters/filtersSlice';
import { getFeedLeads } from '@features/leads/leadsSlice';

// components
import Button from '@components/utils/Button';
import FormField from '@components/utils/FormField';
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
	const [editFilter, setEditFilter] = useState(false);
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
	const [filterGroup, setFilterGroup] = useState<{
		id: string;
		title: string;
		filters: Filter[];
		count: number;
		options: { title: string; filters: Filter[] }[];
	}>({
		id: '',
		title: '',
		filters: [],
		count: 0,
		options: [],
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
		dispatch(removeAlert());

		if (!filterGroup.title) {
			return dispatch(
				setAlert({
					title: 'Input error',
					message: 'Please enter a name for this filter group',
					alertType: 'danger',
				})
			);
		}

		validateFilter(filterGroup.options, filters.filters);

		const body = JSON.stringify({
			title: filterGroup.title,
			filters: filters.filters,
		});

		const { data } = await axios.post<{
			message:
				| 'Required information is missing'
				| 'No user data found'
				| 'Filter group name taken'
				| 'Filter group was created';
		}>('/api/users/settings/filter', body, config);

		if (data.message === 'Filter group name taken') {
			return dispatch(
				setAlert({
					title: 'Error',
					message: `Filter group with the name "${filterGroup.title}" already exists`,
					alertType: 'danger',
				})
			);
		}

		if (data.message === 'Filter group was created') {
			setSaveFilter(false);
			dispatch(
				setUserFilterGroup([
					...filterGroup.options,
					{ title: filterGroup.title, filters: filterGroup.filters },
				])
			);
			setFilterGroup((prevState) => ({
				...prevState,
				options: [
					...prevState.options,
					{
						title: filterGroup.title,
						filters: filterGroup.filters,
					},
				],
				count: prevState.count++,
			}));
			dispatch(
				setAlert({
					title: 'Success',
					message: 'Filter group was created',
					alertType: 'success',
				})
			);
		}
	};

	const handleDeleteFilter = async () => {
		dispatch(removeAlert());

		const { data } = await axios.delete<{
			message:
				| 'Required information is missing'
				| 'No user data found'
				| 'Filter group was deleted';
		}>(`/api/users/settings/filter?title=${filterGroup.title}`);

		if (data.message === 'No user data found') {
			return dispatch(
				setAlert({
					title: 'Error',
					message: "Filter group couldn't be deleted",
					alertType: 'danger',
				})
			);
		}

		const newFilterGroupOptions: any = filterGroup.options.filter(
			(f) => f.title !== filterGroup.title
		);

		setFilterGroup((prevState) => ({
			...prevState,
			options: newFilterGroupOptions,
			count: prevState.count--,
		}));

		if (filterGroup.options.length === 0) {
			setImportFilter(false);
			setSaveFilter(false);
			setAddFilter(true);
		}

		dispatch(setUserFilterGroup(newFilterGroupOptions));

		return dispatch(
			setAlert({
				title: 'Success',
				message: 'Filter group was deleted',
				alertType: 'success',
			})
		);
	};

	const handleEditFilter = async (id: string) => {
		dispatch(removeAlert());

		const { data } = await axios.put(
			`/api/users/settings/filter?id=${filterGroup.id}`
		);
	};

	const handleFilterSubmit = () => {
		// make sure an empty string isn't being passed as a value
		if (!filter.value) {
			return dispatch(
				setAlert({
					title: 'Validation error',
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
							title: 'Validation error',
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
							title: 'Validation error',
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

	const validateFilter = (
		existingFilterGroups:
			| {
					title: string;
					filters: Filter[];
			  }[]
			| undefined,
		newFilterGroup: Filter[]
	) => {
		console.log(existingFilterGroups);
		console.log(newFilterGroup);
		const evaluateArrays = (
			existingFilterGroups:
				| {
						title: string;
						filters: Filter[];
				  }[]
				| undefined,
			newFilterGroup: Filter[]
		) => {
			// if there are no filter groups return false
			if (!existingFilterGroups)
				return {
					title: '',
					isDuplicate: false,
				};

			const lengthMatches = existingFilterGroups.filter(
				(group) => group.filters.length === newFilterGroup.length
			);

			let isDuplicate: boolean = false;
			let title;

			for (let i = 0; i < lengthMatches.length; i++) {
				if (!isDuplicate) {
					const currentFilter = lengthMatches[i];
					for (let i = 0; i < currentFilter.filters.length; i++) {
						if (
							currentFilter.filters[i].title === newFilterGroup[i].title &&
							currentFilter.filters[i].operator ===
								newFilterGroup[i].operator &&
							currentFilter.filters[i].value === newFilterGroup[i].value
						) {
							isDuplicate = true;
							title = currentFilter.title;
						}
					}
				}
			}

			return {
				title,
				isDuplicate,
			};
		};

		const result = evaluateArrays(existingFilterGroups, newFilterGroup);

		if (result.isDuplicate) {
			return dispatch(
				setAlert({
					title: 'Validation error',
					message: `Duplicate filter "${result.title}" has these exact criteria already`,
					alertType: 'danger',
				})
			);
		}

		setEditFilter(false);
		setImportFilter(false);
		setAddFilter(false);
		setSaveFilter(true);
	};

	useEffect(() => {
		user &&
			user?.settings.filterGroups.length > 0 &&
			setFilterGroup((prevState) => ({
				...prevState,
				title: user?.settings.filterGroups[0].title,
				filters: user?.settings.filterGroups[0].filters,
				count: user.settings.filterGroups[0].filters.length,
				options: user?.settings.filterGroups,
			}));
	}, [user, setFilterGroup]);

	useEffect(() => {
		if (filters.count === 0) {
			return setSaveFilter(false);
		}
	}, [filters.count]);

	useEffect(() => {
		if (filterGroup.options.length === 0) {
			return setImportFilter(false);
		}
	}, [filterGroup.options]);

	// TODO: Edit filter
	// TODO: Update new/deleted filters in state
	// TODO: Double validate on new filter creation

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
								setFilterGroup((prevState) => ({
									...prevState,
									title:
										user.settings.filterGroups.length > 0
											? user.settings.filterGroups[0].title
											: prevState.title,
								}));
								setImportFilter(true);
								setImportDescription(false);
								setAddFilter(false);
								setEditFilter(false);
								setSaveFilter(false);
							}}
							onMouseEnter={() => !importFilter && setImportDescription(true)}
							onMouseLeave={() => setImportDescription(false)}
							disabled={filterGroup.options.length === 0}
							className={`relative ${
								importFilter || filterGroup.options.length === 0
									? 'icon-button-disabled'
									: 'icon-button'
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
									Apply filter group
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
								setEditFilter(false);
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
					<div>
						{filters.count === 0 && !addFilter && !importFilter && !saveFilter && (
							<div className='font-semibold text-sm text-gray-700 dark:text-gray-400'>
								<p className='p-4'>
									You haven't added any filters yet. Click the + in the top
									right corner to get started. You can also create or apply a
									filter group.
								</p>
								<Actions
									buttonOne={{
										title: 'Create group',
										onClick: () => {
											setFilterGroup((prevState) => ({
												...prevState,
												title: '',
											}));
											validateFilter(filterGroup.options, filters.filters);
										},
										disabled: filters.count === 0,
									}}
									buttonTwo={{
										title: 'Clear all',
										onClick: () => handleClearFilters(),
										disabled: filters.count === 0,
									}}
								/>
							</div>
						)}
						{/* add filter */}
						{addFilter && (
							<div>
								<div
									className={`p-4 ${
										filters.count > 0 ? 'border-b border-200' : ''
									}`}
								>
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
												text={'Add'}
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
								{filters.count > 0 && (
									<div className='py-2'>
										<FilterList
											title='Active filters'
											filters={filters.filters}
											clearable={true}
										/>
									</div>
								)}
								<Actions
									buttonOne={{
										title: 'Create group',
										onClick: () => {
											setFilterGroup((prevState) => ({
												...prevState,
												title: '',
											}));
											validateFilter(filterGroup.options, filters.filters);
										},
										disabled: filters.count === 0,
									}}
									buttonTwo={{
										title: 'Clear all',
										onClick: () => handleClearFilters(),
										disabled: filters.count === 0,
									}}
								/>
							</div>
						)}
						{/* save filter */}
						{saveFilter && (
							<div>
								<div
									className={`${
										filters.count > 0 ? 'border-b border-200' : ''
									} p-4`}
								>
									<div>
										<FormField
											label={'Filter group name'}
											type={'text'}
											name={'filterGroup'}
											placeholder={'e.g. "Standard criteria"'}
											value={filterGroup.title}
											onChange={(e) =>
												setFilterGroup({
													...filterGroup,
													title: e.target.value,
												})
											}
											required={true}
											styles={'pt-0'}
											lightOnly={false}
										/>
										<div className='flex items-center justify-end'>
											<div className='mt-2'>
												<Button
													text={'Cancel'}
													onClick={() => {
														setSaveFilter(false);
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
													text={'Save'}
													onClick={() => {
														handleSaveFilters();
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
								</div>
								{filters.count > 0 && (
									<div className='py-2'>
										<FilterList
											title='Filters to be grouped'
											filters={filters.filters}
											clearable={true}
										/>
									</div>
								)}
								<Actions
									buttonOne={{
										title: 'Create group',
										onClick: () => {},
										disabled: true,
									}}
									buttonTwo={{
										title: 'Clear all',
										onClick: () => handleClearFilters(),
										disabled: filters.count === 0,
									}}
								/>
							</div>
						)}
						{/* edit filter */}
						{editFilter && (
							<div>
								<div
									className={`${
										filterGroup.count > 0 ? 'border-b border-200' : ''
									} p-4`}
								>
									<div>
										<FormField
											label={'Filter group name'}
											type={'text'}
											name={'filterGroup'}
											placeholder={'e.g. "Standard criteria"'}
											value={filterGroup.title}
											onChange={(e) =>
												setFilterGroup({
													...filterGroup,
													title: e.target.value,
												})
											}
											required={true}
											styles={'pt-0'}
											lightOnly={false}
										/>
										<div className='flex items-center justify-end'>
											<div className='mt-2'>
												<Button
													text={'Cancel'}
													onClick={() => {
														setEditFilter(false);
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
													text={'Save'}
													onClick={() => {
														handleEditFilter(filterGroup.id);
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
								</div>
								{filterGroup.count > 0 && (
									<div className='py-2'>
										<FilterList
											title='Filters to be grouped'
											filters={filterGroup.filters}
											clearable={true}
										/>
									</div>
								)}
								<Actions
									buttonOne={{
										title: 'Create group',
										onClick: () => {},
										disabled: true,
									}}
									buttonTwo={{
										title: 'Clear all',
										onClick: () => handleClearFilters(),
										disabled: filters.count === 0,
									}}
								/>
							</div>
						)}
						{/* import filter */}
						{importFilter && (
							<div>
								<div
									className={`${
										filterGroup.count > 0 ? 'border-b border-200' : ''
									} p-4`}
								>
									<SelectComponent
										title={'Group'}
										options={filterGroup.options}
										selectedOption={filterGroup.title}
										openState={importFilterDropdown}
										setOpenState={setImportFilterDropdown}
										handleClick={(option: {
											id: string;
											title: string;
											filters: Filter[];
										}) => {
											setFilterGroup((prevState) => ({
												...prevState,
												id: option.id,
												title: option.title,
												filters: option.filters,
												count: option.filters.length,
											}));
										}}
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
													dispatch(setFilters(filterGroup.filters));
													setImportFilter(false);
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
								{filterGroup.filters.length > 0 && filterGroup.filters && (
									<div className='py-2'>
										<FilterList
											title='Filters to be applied'
											filters={filterGroup.filters}
											clearable={false}
										/>
									</div>
								)}
								<Actions
									buttonOne={{
										title: 'Edit group',
										onClick: () => {
											if (importFilter) {
												setAddFilter(false);
												setImportFilter(false);
												setSaveFilter(false);
												setEditFilter(true);
												setFilterGroup((prevState) => ({
													...prevState,
													filters: filterGroup.filters,
												}));
											}
										},
										disabled: false,
									}}
									buttonTwo={{
										title: 'Delete group',
										onClick: () => handleDeleteFilter(),
										disabled: false,
									}}
								/>
							</div>
						)}
						{/* filters list */}
						{filters.count > 0 &&
							!addFilter &&
							!importFilter &&
							!saveFilter &&
							!editFilter && (
								<div>
									<div className='pb-2'>
										<FilterList
											title={null}
											filters={filters.filters}
											clearable={true}
										/>
									</div>
									<Actions
										buttonOne={{
											title: 'Create group',
											onClick: () => {
												setFilterGroup((prevState) => ({
													...prevState,
													title: '',
												}));
												validateFilter(filterGroup.options, filters.filters);
											},
											disabled: false,
										}}
										buttonTwo={{
											title: 'Clear all',
											onClick: () => handleClearFilters(),
											disabled: filters.count === 0,
										}}
									/>
								</div>
							)}
					</div>
					{/* modal actions */}
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

interface FilterListProps {
	title: string | null;
	filters: Filter[];
	clearable: boolean;
}

const FilterList: React.FC<FilterListProps> = ({
	title,
	filters,
	clearable,
}) => {
	return (
		<div className='pt-2 px-4 font-semibold text-sm text-100'>
			{title && <h5>{title}</h5>}
			<ul className='py-2'>
				{filters.map((filter: Filter, i: number) => (
					<ActiveFilter key={i} filter={filter} clearable={clearable} />
				))}
			</ul>
		</div>
	);
};

interface ActionButton {
	title: string;
	onClick: () => void;
	disabled: boolean;
}

interface ActionsProps {
	buttonOne: ActionButton;
	buttonTwo: ActionButton;
}

const Actions: React.FC<ActionsProps> = ({ buttonOne, buttonTwo }) => {
	return (
		<div className='center-between py-2 px-3 border-t border-200'>
			<button
				onClick={buttonOne.onClick}
				disabled={buttonOne.disabled}
				className={`py-1 px-2 font-semibold text-sm ${
					buttonOne.disabled ? 'text-gray-200 cursor-default' : 'link-bubble'
				}`}
			>
				{buttonOne.title}
			</button>
			<button
				onClick={buttonTwo.onClick}
				disabled={buttonTwo.disabled}
				className={`py-1 px-2 font-semibold text-sm ${
					buttonTwo.disabled
						? 'text-gray-200 cursor-default'
						: 'hover:bg-red-100 dark:hover:bg-red-400 text-red-500 dark:text-red-300 hover:text-red-600 dark:hover:text-white rounded-main transition-main ring-red'
				}`}
			>
				{buttonTwo.title}
			</button>
		</div>
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
					onClick={() => {
						dispatch(clearFilter({ id: filter.id }));
					}}
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
