import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setPage } from '../../redux/actions/leads';

const Pagination = ({
	page,
	hasNextPage,
	hasPreviousPage,
	nextPage,
	previousPage,
	lastPage,
	setPage,
}) => {
	const search = window.location.search;
	const params = new URLSearchParams(search);
	const newPage = params.get('page');
	return (
		<article>
			{page !== 1 && previousPage !== 1 && (
				<Link to={`?page=1`} onClick={() => setPage(1)}>
					1
				</Link>
			)}
			{hasPreviousPage && (
				<Link
					to={`?page=${previousPage}`}
					onClick={() => setPage(previousPage)}
				>
					{previousPage}
				</Link>
			)}
			<Link to={`?page=${page}`} onClick={() => setPage(page)}>
				{page}
			</Link>
			{hasNextPage && (
				<Link to={`?page=${nextPage}`} onClick={() => setPage(nextPage)}>
					{nextPage}
				</Link>
			)}
			{lastPage !== page && nextPage !== lastPage && (
				<Link to={`?page=${lastPage}`} onClick={() => setPage(lastPage)}>
					{lastPage}
				</Link>
			)}
		</article>
	);
};

const mapStateToProps = (state) => {
	const {
		page,
		hasNextPage,
		hasPreviousPage,
		nextPage,
		previousPage,
		lastPage,
	} = state.leads.pagination;
	return {
		page,
		hasNextPage,
		hasPreviousPage,
		nextPage,
		previousPage,
		lastPage,
	};
};

export default connect(mapStateToProps, { setPage })(Pagination);
