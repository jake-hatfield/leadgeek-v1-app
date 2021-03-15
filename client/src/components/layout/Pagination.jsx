import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setPage } from '../../redux/actions/leads';

const Pagination = ({
	pagination: { hasNextPage, hasPreviousPage, nextPage, previousPage },
	type,
	loading,
	setPage,
}) => {
	return (
		!loading && (
			<article className='mt-8 flex justify-between'>
				{hasPreviousPage ? (
					<Link
						to={`?page=${previousPage}`}
						onClick={() => setPage(previousPage, type)}
					>
						Previous page
					</Link>
				) : (
					<div />
				)}
				{hasNextPage && (
					<Link
						to={`?page=${nextPage}`}
						onClick={() => setPage(nextPage, type)}
					>
						Next page
					</Link>
				)}
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
