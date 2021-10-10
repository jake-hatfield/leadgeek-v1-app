import React, { useState, useRef } from 'react';

// packages
import ContentLoader from 'react-content-loader';
import { useHotkeys } from 'react-hotkeys-hook';

// redux
import { useAppDispatch } from '@hooks/hooks';
import { setItemLimit } from '@components/features/filters/filtersSlice';

// utils
import { numberWithCommas, useOutsideMousedown } from '@utils/utils';
import { Pagination } from '@utils/interfaces/Pagination';
import { LeadTypes } from '@utils/interfaces/Lead';
import { useDarkMode } from '@hooks/hooks';

interface PaginationProps {
	pagination: Pagination;
	type: LeadTypes;
	itemLimit: number;
	status: string;
	setPage: any;
}

const PaginationComponent: React.FC<PaginationProps> = ({
	pagination,
	type,
	itemLimit,
	status,
	setPage,
}) => {
	const dispatch = useAppDispatch();
	// local state
	const [colorTheme] = useDarkMode();
	const [selectOpen, setSelectOpen] = useState(false);
	const [selectValue, setSelectValue] = useState(itemLimit || 15);
	const [filteredMessage, setFilteredMessage] = useState(false);

	// destructure necessary items
	const {
		page,
		hasNextPage,
		hasPreviousPage,
		nextPage,
		previousPage,
		totalItems,
		filteredItems,
	} = pagination;

	// close modal handlers
	const ref = useRef(null);
	useOutsideMousedown(ref, setSelectOpen, null);
	// hotkeys
	// close details on escape key
	useHotkeys(
		'Escape',
		() => {
			selectOpen && setSelectOpen(false);
		},
		{ keyup: true }
	);

	const itemsFrom =
		previousPage !== null
			? previousPage * (itemLimit || 15) + 1
			: previousPage && previousPage + 1;
	const itemsTo =
		filteredItems && filteredItems < page * (itemLimit || 15)
			? filteredItems
			: page * (itemLimit || 15);

	// global values
	const bgColor = colorTheme === 'dark' ? '#F0F4F8' : '#1C2936';
	const fgColor = colorTheme === 'dark' ? '#E6EBF0' : '#1E2C3C';

	return (
		<article className='mt-8'>
			<div className='center-between py-2 px-4 cs-light-400 rounded-main shadow-md text-100 border border-300'>
				{totalItems && totalItems > 0 ? (
					<div className='relative flex items-center text-sm' ref={ref}>
						<button
							type='button'
							className='overflow-x-hidden relative w-full pl-2 pr-10 py-2 input border border-300 rounded-main text-left cursor-pointer transition-main ring-purple ring-inset'
							aria-haspopup='listbox'
							aria-expanded='true'
							aria-labelledby='listbox-label'
							onClick={() =>
								selectOpen ? setSelectOpen(false) : setSelectOpen(true)
							}
						>
							<span className='flex items-center'>
								<span className='ml-2 block truncate'>{selectValue}</span>
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
										fillRule='evenodd'
										d='M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z'
										clipRule='evenodd'
									/>
								</svg>
							</span>
						</button>
						{selectOpen && (
							<ul
								className='absolute top-0 right-0 z-10 max-h-56 w-full mt-1 py-1 cs-light-300 card-200 text-sm overflow-auto focus:outline-none transform -translate-y-40'
								tabIndex={-1}
								role='listbox'
								aria-labelledby='listbox-label'
								aria-activedescendant='listbox-option-3'
							>
								{selectOptions.map((option, i) => (
									<li
										key={i}
										className={`py-2 pl-3 pr-9 cursor-pointer select-none relative ${
											selectValue === option
												? 'cs-purple'
												: 'hover:bg-gray-100 dark:hover:bg-darkGray-100 text-300'
										}`}
										id={`listbox-option-${i}`}
										role='option'
										aria-selected='true'
										onClick={() => {
											dispatch(
												setItemLimit({
													type,
													itemLimit: option,
												})
											);
											setSelectValue(option);
											setSelectOpen(false);
										}}
									>
										{option}
									</li>
								))}
							</ul>
						)}
					</div>
				) : (
					<div />
				)}
				<div className='center-between text-sm'>
					{filteredItems ? (
						<div className='relative flex items-center'>
							{filteredItems > 0 && totalItems && totalItems > filteredItems && (
								<button
									onClick={() => setFilteredMessage((prev) => !prev)}
									onMouseEnter={() => setFilteredMessage(true)}
									onMouseLeave={() => setFilteredMessage(false)}
									className='mr-2 rounded-md text-gray-400 hover:text-gray-600 transition-main ring-gray'
								>
									<svg
										xmlns='http://www.w3.org/2000/svg'
										className='h-5 w-5'
										viewBox='0 0 20 20'
										fill='currentColor'
									>
										<path
											fillRule='evenodd'
											d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
											clipRule='evenodd'
										/>
									</svg>
									{filteredMessage && totalItems && (
										<div className='absolute z-10 bottom-0 py-2 px-4 transform -translate-y-8 rounded-md shadow-md bg-gray-900 text-left text-white text-sm'>
											<p>
												<span className='font-semibold text-purple-300'>
													{numberWithCommas(totalItems - filteredItems)}
												</span>{' '}
												leads aren't showing because of applied filters.
											</p>
										</div>
									)}
								</button>
							)}
							{status === 'idle' ? (
								filteredItems && (
									<span>
										Showing {itemsFrom} to {itemsTo} of {filteredItems} results
									</span>
								)
							) : (
								<div className='flex justify-end'>
									<ContentLoader
										speed={2}
										height={35}
										width={'70%'}
										backgroundColor={bgColor}
										foregroundColor={fgColor}
									>
										<rect
											x='0'
											y='7.5'
											rx='8'
											ry='8'
											width='100%'
											height={25}
										/>
									</ContentLoader>
								</div>
							)}
						</div>
					) : (
						<div />
					)}
					{(hasPreviousPage || hasNextPage) && (
						<nav>
							<button
								onClick={() => dispatch(setPage({ page: previousPage, type }))}
								className={`${
									hasPreviousPage
										? 'hover:shadow-md hover:text-gray-700 border border-300'
										: 'pointer-events-none bg-gray-200 opacity-50'
								} ${classes.button} ml-8`}
							>
								Previous
							</button>
							<button
								onClick={() => dispatch(setPage({ page: nextPage, type }))}
								className={`${
									hasNextPage
										? 'hover:shadow-md hover:text-gray-700 border border-300'
										: 'pointer-events-none bg-gray-200 opacity-50'
								} ${classes.button} ml-4`}
							>
								Next
							</button>
						</nav>
					)}
				</div>
			</div>
		</article>
	);
};

const selectOptions = [10, 20, 50, 100];

// component classes
const classes = {
	button:
		'py-2 px-3 rounded-lg dark:bg-darkGray-200 dark:hover:bg-darkGray-100 shadow-sm text-sm font-semibold border border-gray-200 dark:border-darkGray-100 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 transition duration-100 ease-in-out ring-purple',
};

export default PaginationComponent;
