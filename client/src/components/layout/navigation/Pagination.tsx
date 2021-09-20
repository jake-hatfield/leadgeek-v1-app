import React, { useState } from 'react';

// packages
import { Link } from 'react-router-dom';

// redux
import { useAppDispatch } from '@utils/hooks';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';

// utils
import { numberWithCommas } from '@utils/utils';
import { Pagination } from '@utils/interfaces/Pagination';

interface PaginationProps {
	pagination: Pagination;
	type: string;
	itemLimit: number;
	status: string;
	padding: boolean;
	setPage: any;
	setItemLimit: ActionCreatorWithPayload<
		{ type: string; itemLimit: number },
		string
	>;
}

const PaginationComponent: React.FC<PaginationProps> = ({
	pagination,
	type,
	itemLimit,
	status,
	padding,
	setPage,
	setItemLimit,
}) => {
	const dispatch = useAppDispatch();
	// local state
	const [selectValue, setSelectValue] = useState(itemLimit || 15);
	const pageLimits = [10, 15, 25, 50, 100];
	const [filteredMessage, setFilteredMessage] = useState(false);

	// desctructure necessary items
	const {
		page,
		hasNextPage,
		hasPreviousPage,
		nextPage,
		previousPage,
		totalItems,
		filteredItems,
	} = pagination;

	const itemsFrom =
		previousPage !== null
			? previousPage * (itemLimit || 15) + 1
			: previousPage && previousPage + 1;
	const itemsTo =
		filteredItems && filteredItems < page * (itemLimit || 15)
			? filteredItems
			: page * (itemLimit || 15);

	return status === 'idle' ? (
		<article className={`mt-8 ${!padding && 'container'} `}>
			<div className='flex items-center justify-between bg-white dark:bg-darkGray-400 rounded-lg py-2 px-4 shadow-md text-gray-600 dark:text-gray-400 border border-gray-400 dark:border-darkGray-200'>
				{totalItems && totalItems > 0 ? (
					<div className='flex items-center text-sm'>
						<select
							value={selectValue}
							onChange={(e) => {
								dispatch(
									setItemLimit({ type, itemLimit: +e.currentTarget.value })
								);
								setSelectValue(+e.currentTarget.value);
							}}
							className='w-16 mr-2 p-2 bg-white rounded-lg text-sm border border-gray-200 shadow-sm cursor-pointer ring-purple minimal-scrollbar'
						>
							{pageLimits.map((category, i) => (
								<option
									key={i}
									value={category}
									className='hover:bg-purple-500'
								>
									{category}
								</option>
							))}
						</select>
						<span>results per page</span>
					</div>
				) : (
					<div />
				)}
				<div className='flex items-center justify-between text-sm'>
					{filteredItems ? (
						<div className='relative flex items-center'>
							{filteredItems > 0 && totalItems && totalItems > filteredItems && (
								<button
									onClick={() => setFilteredMessage((prev) => !prev)}
									onMouseEnter={() => setFilteredMessage(true)}
									onMouseLeave={() => setFilteredMessage(false)}
									className='mr-2 rounded-md text-gray-400 hover:text-gray-600 transition duration-100 ease-in-out ring-gray'
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
							{filteredItems && (
								<span>
									Showing {itemsFrom} to {itemsTo} of {filteredItems} results
								</span>
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
										? 'hover:shadow-md hover:text-gray-700'
										: 'pointer-events-none bg-gray-200 opacity-50'
								} ${classes.button} ml-8`}
							>
								Previous
							</button>
							<button
								onClick={() => dispatch(setPage({ page: nextPage, type }))}
								className={`${
									hasNextPage
										? 'hover:shadow-md hover:text-gray-700'
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
	) : (
		<div />
	);
};

// component classes
const classes = {
	button:
		'py-2 px-3 rounded-lg dark:bg-darkGray-200 dark:hover:bg-darkGray-100 shadow-sm text-sm font-semibold border border-gray-200 dark:border-darkGray-100 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-400 transition duration-100 ease-in-out ring-purple',
};

export default PaginationComponent;
