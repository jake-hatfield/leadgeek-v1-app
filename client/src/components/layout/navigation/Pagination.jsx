import React from 'react';

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Pagination = ({ pagination, type, loading, noPadding, setPage }) => {
	const {
		hasNextPage,
		hasPreviousPage,
		nextPage,
		previousPage,
		totalItems,
	} = pagination;
	const buttonClasses =
		'py-2 px-3 rounded-lg shadow-sm text-sm font-semibold text-gray-500 hover:text-gray-600 transition duration-100 ease-in-out ring-purple';
	return (
		!loading &&
		(hasPreviousPage || hasNextPage) && (
			<article
				className={`flex items-center justify-between mt-4 ${
					!noPadding && 'container'
				}`}
			>
				{totalItems ? (
					<div className='text-sm font-semibold'>Total items: {totalItems}</div>
				) : (
					<div />
				)}

				<div className='flex items-center'>
					<Link
						to={`${hasPreviousPage && `?page=${previousPage}`}`}
						onClick={() => setPage(previousPage, type)}
						className={`${
							hasPreviousPage
								? 'hover:shadow-md hover:text-gray-700'
								: 'pointer-events-none opacity-50'
						} ${buttonClasses}`}
					>
						Previous page
					</Link>
					<Link
						to={`?page=${nextPage}`}
						onClick={() => setPage(nextPage, type)}
						className={`${
							hasNextPage
								? 'hover:shadow-md hover:text-gray-700'
								: 'pointer-events-none opacity-50'
						} ${buttonClasses} ml-4`}
					>
						Next page
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
