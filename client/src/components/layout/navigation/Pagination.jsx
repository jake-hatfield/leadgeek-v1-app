import React from 'react';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setPage } from '../../../redux/actions/leads';

const Pagination = ({
	pagination: { hasNextPage, hasPreviousPage, nextPage, previousPage },
	type,
	loading,
	setPage,
}) => {
	const buttonClasses =
		'ml-4 py-2 px-3 rounded-lg shadow-sm text-sm font-semibold text-gray-500 hover:text-gray-600 transition-all duration-100 ease-in-out focus:outline-none focus:shadow-outline';
	return (
		!loading &&
		(hasPreviousPage || hasNextPage) && (
			<article className='flex justify-end mt-4 container'>
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
						} ${buttonClasses}`}
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
