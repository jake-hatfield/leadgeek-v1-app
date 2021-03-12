import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setPage } from '../../redux/actions/leads';

const Pagination = ({
	pagination: {
		page,
		hasNextPage,
		hasPreviousPage,
		nextPage,
		previousPage,
		lastPage,
	},
	loading,
	setPage,
}) => {
	const search = window.location.search;
	const params = new URLSearchParams(search);
	const newPage = params.get('page');
	return (
		!loading && (
			<article className='flex justify-between'>
				{hasPreviousPage && (
					<Link
						to={`?page=${previousPage}`}
						onClick={() => setPage(previousPage)}
					>
						Previous page
					</Link>
				)}
				{hasNextPage && (
					<Link to={`?page=${nextPage}`} onClick={() => setPage(nextPage)}>
						Next page
					</Link>
				)}
			</article>
		)
	);
};

const mapStateToProps = (state) => {
	const { pagination, loading } = state.leads;
	return {
		pagination,
		loading,
	};
};

export default connect(mapStateToProps, { setPage })(Pagination);
