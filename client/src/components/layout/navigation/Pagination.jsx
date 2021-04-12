import React from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setPage } from '../../../redux/actions/leads';

const Pagination = ({
	pagination: {
		hasNextPage,
		hasPreviousPage,
		nextPage,
		previousPage,
		totalItems,
	},
	type,
	loading,
	setPage,
}) => {
	const buttonClasses =
		'py-2 px-3 rounded-lg shadow-sm text-sm font-semibold text-gray-500 hover:text-gray-600 transition duration-100 ease-in-out focus:outline-none focus:shadow-outline';
	return (
		!loading &&
		(hasPreviousPage || hasNextPage) && (
			<article className='flex items-center justify-between mt-4 container'>
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

const mapStateToProps = (state, ownProps) => {
	const { loading } = state.leads;
	const { pagination, type } = ownProps;
	return {
		pagination,
		type,
		loading,
	};
};

export default connect(mapStateToProps, { setPage })(Pagination);
