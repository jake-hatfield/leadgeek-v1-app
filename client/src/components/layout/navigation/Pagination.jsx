import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Pagination = ({
	pagination,
	type,
	itemLimit,
	loading,
	noPadding,
	setPage,
	setItemLimit,
}) => {
	const {
		page,
		hasNextPage,
		hasPreviousPage,
		nextPage,
		previousPage,
		totalItems,
		filteredItems,
	} = pagination;
	const buttonClasses =
		'py-2 px-3 rounded-lg shadow-sm text-sm font-semibold text-gray-600 hover:text-gray-700 transition duration-100 ease-in-out ring-purple';
	const itemsFrom = previousPage
		? previousPage * (itemLimit || 15) + 1
		: previousPage + 1;
	const itemsTo =
		filteredItems < page * (itemLimit || 15)
			? filteredItems
			: page * (itemLimit || 15);
	const [selectValue, setSelectValue] = useState(itemLimit || 15);
	const pageLimits = [10, 15, 25, 50, 100];
	const [filteredMessage, setFilteredMessage] = useState(false);
	return (
		!loading && (
			<article
				className={`flex items-center justify-between mt-4 ${
					!noPadding && 'container'
				} text-gray-600`}
			>
				{filteredItems > 0 ? (
					<div className='flex items-center text-sm'>
						<span>View</span>
						<select
							value={selectValue}
							onChange={(e) => {
								setItemLimit(type, e.currentTarget.value);
								setSelectValue(e.currentTarget.value);
							}}
							className='w-16 mx-2 p-2 bg-white rounded-lg text-sm border border-gray-200 shadow-sm cursor-pointer ring-purple minimal-scrollbar'
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
							{filteredItems > 0 && totalItems > filteredItems && (
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
											d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z'
											clipRule='evenodd'
										/>
									</svg>
									{filteredMessage && (
										<div className='absolute z-10 bottom-0 py-2 px-4 transform -translate-y-8 rounded-md shadow-md bg-gray-800 text-left text-white text-sm'>
											<p>
												<span className='font-semibold text-teal-400'>
													{totalItems - filteredItems}
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
						<div>
							<Link
								to={`${hasPreviousPage && `?page=${previousPage}`}`}
								onClick={() => setPage(previousPage, type)}
								className={`${
									hasPreviousPage
										? 'hover:shadow-md hover:text-gray-700'
										: 'pointer-events-none bg-gray-200 opacity-50'
								} ${buttonClasses} ml-8`}
							>
								Previous
							</Link>
							<Link
								to={`?page=${nextPage}`}
								onClick={() => setPage(nextPage, type)}
								className={`${
									hasNextPage
										? 'hover:shadow-md hover:text-gray-700'
										: 'pointer-events-none bg-gray-200 opacity-50'
								} ${buttonClasses} ml-4`}
							>
								Next
							</Link>
						</div>
					)}
				</div>
			</article>
		)
	);
};

Pagination.propTypes = {
	pagination: PropTypes.object.isRequired,
	type: PropTypes.string.isRequired,
	loading: PropTypes.bool.isRequired,
	setPage: PropTypes.func.isRequired,
};

export default Pagination;
