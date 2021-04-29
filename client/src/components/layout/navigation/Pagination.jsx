import React from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Pagination = ({ pagination, type, loading, noPadding, setPage }) => {
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
	const itemsFrom = previousPage ? previousPage * 20 + 1 : previousPage + 1;
	const itemsTo = page * 20;
	return (
		!loading &&
		(hasPreviousPage || hasNextPage) && (
			<article
				className={`flex items-center justify-between mt-4 ${
					!noPadding && 'container'
				}`}
			>
				<div />
				<div className='flex items-center text-gray-600'>
					{totalItems ? (
						<div className='text-sm'>
							Showing {itemsFrom} to {itemsTo} of {totalItems} items
						</div>
					) : (
						<div />
					)}
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
