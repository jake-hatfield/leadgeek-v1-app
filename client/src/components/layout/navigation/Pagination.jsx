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
	} = pagination;
	const buttonClasses =
		'py-2 px-3 rounded-lg shadow-sm text-sm font-semibold text-gray-500 hover:text-gray-600 transition duration-100 ease-in-out ring-purple';
	const itemsFrom = previousPage
		? previousPage * (itemLimit || 15) + 1
		: previousPage + 1;
	const itemsTo =
		totalItems < page * (itemLimit || 15)
			? totalItems
			: page * (itemLimit || 15);
	const [selectValue, setSelectValue] = useState(itemLimit || 15);
	const pageLimits = [10, 15, 25, 50, 100];
	return (
		!loading && (
			<article
				className={`flex items-center justify-between mt-4 ${
					!noPadding && 'container'
				} text-gray-600`}
			>
				{totalItems && (
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
				)}

				<div className='flex items-center'>
					{totalItems ? (
						<div className='text-sm'>
							Showing {itemsFrom} to {itemsTo} of {totalItems} results
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
