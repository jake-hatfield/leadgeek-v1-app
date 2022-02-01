import React, { useState, useRef } from 'react';

// packages
import { useHotkeys } from 'react-hotkeys-hook';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// redux
import { useAppSelector, useAppDispatch } from '@hooks/hooks';
import { removeAlert, setAlert } from '@features/alert/alertSlice';
import {
	clearSortCriterion,
	clearSortCriteria,
	createSortCriterion,
	setReorderedSortCriteria,
} from '@features/filters/filtersSlice';
import { getFeedLeads } from '@features/leads/leadsSlice';

// components
import Button from '@components/utils/Button';
import SelectComponent from '@components/utils/Select';
import Spinner from '@components/utils/Spinner';

// utils
import { useOutsideMousedown } from '@utils/utils';
import {
	SortCriterion,
	SortValues,
	SortTitles,
	SortTypes,
} from '@utils/interfaces/Filter';

interface SortComponentProps {
	sortActive: boolean;
	setSortActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const SortComponent: React.FC<SortComponentProps> = ({
	sortActive,
	setSortActive,
}) => {
	const dispatch = useAppDispatch();
	// alert state
	const alert = useAppSelector((state) => state.alert);
	// auth state
	const user = useAppSelector((state) => state.auth.user);
	const filters = useAppSelector((state) => state.filters);
	// local state
	const [addSortCriteria, setAddSortCriteria] = useState(false);
	const [sortCriteria, setSortCriteria] = useState<{
		typeIs: {
			title: SortTitles;
			value: SortTypes;
		};
		valueIs: {
			title: string;
			value: SortValues;
		};
	}>({
		typeIs: {
			title: typeOptions[0].title,
			value: typeOptions[0].value,
		},
		valueIs: {
			title: valueOptions[0].title,
			value: valueOptions[0].value,
		},
	});
	const [filterDescription, setFilterDescription] = useState(false);
	const [typeActive, setTypeActive] = useState(false);
	const [valueActive, setValueActive] = useState(false);

	// close modal handlers
	const wrapperRef = useRef(null);
	useOutsideMousedown(wrapperRef, setSortActive, null);

	// hotkeys
	// close details on escape key
	useHotkeys(
		'Escape',
		() => {
			sortActive && setSortActive(false);
		},
		{ keyup: true }
	);

	const handleClearFilters = () => {
		const keysToRemove = [
			'titleSortCriteria',
			'categorySortCriteria',
			'netProfitSortCriteria',
			'roiSortCriteria',
			'bsrCurrentSortCriteria',
			'monthlySalesSortCriteria',
			'dateSortCriteria',
		];
		keysToRemove.forEach((key) => localStorage.removeItem(key));
		dispatch(clearSortCriteria());
		setSortActive(false);
		user &&
			dispatch(
				getFeedLeads({
					page: 1,
					filters: {
						...filters,
						sortCriteria: [],
					},
				})
			);
		return dispatch(
			setAlert({
				title: 'Success',
				message: 'All sort criteria were removed',
				alertType: 'success',
			})
		);
	};

	const handleSortCriteriaSubmit = () => {
		// check if there's an alert
		if (alert) {
			// clear all alerts if we've made it past the checks
			dispatch(removeAlert());
		}

		// create the sort crtieria
		dispatch(
			createSortCriterion({
				title: sortCriteria.typeIs.title,
				type: sortCriteria.typeIs.value,
				value: sortCriteria.valueIs.value,
			})
		);

		// reset local sort criteria state
		setSortCriteria({
			...sortCriteria,
			typeIs: {
				title: typeOptions[0].title,
				value: typeOptions[0].value,
			},
			valueIs: {
				title: valueOptions[0].title,
				value: valueOptions[0].value,
			},
		});

		// get the newly filtered leads
		return getFeedLeads({
			page: 1,
			filters,
		});
	};

	const reorder = (
		list: SortCriterion[],
		startIndex: number,
		endIndex: number
	) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);
		return result;
	};

	const onDragEnd = (result: any) => {
		const { destination, source } = result;

		// dragging outside the droppable area
		if (!destination) {
			return;
		}

		// dropping in the same spot
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		const items = reorder(
			filters.sortCriteria,
			source.index,
			destination.index
		);
		dispatch(setReorderedSortCriteria(items));
	};

	return user ? (
		<article
			ref={wrapperRef}
			className='absolute top-0 right-0 z-30 w-80 pt-4 pb-1 cs-light-400 card-200 text-300 transform translate-y-12 -translate-x-56'
		>
			<div className='relative'>
				<header className='pb-2 px-4 center-between border-b border-200'>
					<div className='flex items-center'>
						<h5 className='inline-block font-bold text-lg'>Sort</h5>
						{Object.keys(filters.sortCriteria).length > 0 && (
							<div className='ml-4 py-1 px-2 cs-teal rounded-main text-xs font-semibold'>
								<span>{Object.keys(filters.sortCriteria).length}</span>
								<span className='ml-1'>active</span>
							</div>
						)}
					</div>
					<button
						onClick={(e) => {
							e.stopPropagation();
							setAddSortCriteria(true);
						}}
						onMouseEnter={() => setFilterDescription(true)}
						onMouseLeave={() => setFilterDescription(false)}
						className='relative icon-button'
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
								Add sort criterion
							</div>
						)}
					</button>
				</header>
				{filters.sortCriteria.length > 0 || addSortCriteria ? (
					<div>
						{addSortCriteria && (
							<div className='pt-6 pb-2 px-4'>
								<div>
									<SelectComponent
										title={'Type'}
										options={typeOptions}
										selectedOption={sortCriteria.typeIs.title}
										openState={typeActive}
										setOpenState={setTypeActive}
										handleClick={(option: { title: string; value: string }) =>
											setSortCriteria({
												...sortCriteria,
												typeIs: {
													title: option.title as SortTitles,
													value: option.value as SortTypes,
												},
												valueIs: {
													title: valueOptions[0].title,
													value: valueOptions[0].value,
												},
											})
										}
									/>
								</div>
								<div className='mt-2'>
									<SelectComponent
										title={'Value'}
										options={valueOptions as any}
										selectedOption={sortCriteria.valueIs.title}
										openState={valueActive}
										setOpenState={setValueActive}
										handleClick={(option: {
											title: SortTitles;
											value: SortValues;
										}) =>
											setSortCriteria({
												...sortCriteria,
												valueIs: {
													title: option.title,
													value: option.value,
												},
											})
										}
									/>
								</div>
								<div className='flex items-center justify-end'>
									<div className='mt-2'>
										<Button
											text={'Cancel'}
											onClick={() => {
												setAddSortCriteria(false);
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
												handleSortCriteriaSubmit();
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
						{filters.sortCriteria.length > 0 && (
							<div className='font-semibold text-sm text-gray-700'>
								<DragDropContext onDragEnd={onDragEnd}>
									<Droppable droppableId={'export-headers'}>
										{(provided: any) => (
											<ul
												{...provided.droppableProps}
												ref={provided.innerRef}
												className='py-2 px-4'
											>
												{filters.sortCriteria.map(
													(sortCriterion: SortCriterion, i: number) => (
														<ActiveSortCriterion
															key={i}
															sortCriterion={sortCriterion}
															index={i}
														/>
													)
												)}
												<span className='bg-gray-100'>
													{provided.placeholder}
												</span>
											</ul>
										)}
									</Droppable>
								</DragDropContext>
							</div>
						)}
						<div className='border-t border-200'>
							<div className='flex justify-end py-2 px-4'>
								<button
									onClick={() => {
										handleClearFilters();
									}}
									className='py-1 px-2 font-semibold text-sm hover:bg-red-100 dark:hover:bg-red-400 text-red-500 dark:text-red-300 hover:text-red-600 dark:hover:text-white rounded-main transition-main ring-red'
								>
									Clear all
								</button>
							</div>
						</div>
					</div>
				) : (
					<div className='py-6 px-4 font-semibold text-sm text-gray-700 dark:text-gray-400'>
						You haven't added any sort criteria. Click the "+" in the top right
						corner to get started. You can sort the criteria by changing their
						order in this list.
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

interface ActiveSortCriterionProps {
	sortCriterion: SortCriterion;
	index: number;
}

const ActiveSortCriterion: React.FC<ActiveSortCriterionProps> = ({
	sortCriterion,
	index,
}) => {
	const dispatch = useAppDispatch();
	// local state
	const [filterDescription, setFilterDescription] = useState(false);

	// return appropriate value
	const valueProcessor = (value: SortValues) => {
		if (value === 1) {
			return 'low to high ';
		} else {
			return 'high to low';
		}
	};

	return (
		<Draggable
			key={sortCriterion.type}
			draggableId={sortCriterion.type}
			index={index}
		>
			{(provided, snapshot) => (
				<li
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
					className='first:mt-0 mt-2 w-full py-2 pl-4 pr-3 center-between cs-bg-light border border-200 shadow-sm rounded-main text-200 transition-colors-main focus:outline-none'
				>
					<div className='flex items-center truncate mr-2'>
						<span className='flex-none'>
							{sortCriterion.title} from {valueProcessor(sortCriterion.value)}
						</span>
					</div>
					<button
						onClick={(e) => {
							e.stopPropagation();
							dispatch(clearSortCriterion({ type: sortCriterion.type }));
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
								Clear sort criterion
							</div>
						)}
					</button>
				</li>
			)}
		</Draggable>
	);
};

interface TypeOption {
	title: SortTitles;
	value: SortTypes;
}

const typeOptions: TypeOption[] = [
	{ title: 'Title', value: 'title' },
	{ title: 'Category', value: 'category' },
	{ title: 'Profit', value: 'netProfit' },
	{ title: 'Return on investment', value: 'roi' },
	{ title: "Best seller's rank", value: 'bsrCurrent' },
	{ title: 'Monthly sales', value: 'monthlySales' },
	{ title: 'Date', value: 'date' },
];

interface ValueOptions {
	title: 'Low to high' | 'High to low';
	value: SortValues;
}

const valueOptions: ValueOptions[] = [
	{
		title: 'Low to high',
		value: 1,
	},
	{
		title: 'High to low',
		value: -1,
	},
];

export default SortComponent;
