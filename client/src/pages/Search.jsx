import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getSearchResults } from 'redux/actions/leads';

import AuthLayout from 'components/layout/AuthLayout';
import Leads from 'components/leads/Leads';

const Search = ({ user, loading, search, getSearchResults }) => {
	const { page } = search.pagination;
	const { searchValue } = search;
	const { role, dateCreated } = Object(user);
	useEffect(() => {
		!loading &&
			user &&
			searchValue &&
			getSearchResults(searchValue, role, dateCreated, page);
	}, [page]);

	return (
		<AuthLayout>
			<Leads
				leads={search.pageByIds}
				pagination={search.pagination}
				type={'search'}
				user={user}
				loading={loading}
				headerTitle={'Search results'}
				search={true}
			/>
		</AuthLayout>
	);
};

Search.propTypes = {
	user: PropTypes.object.isRequired,
	search: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
	const { user, loading } = state.auth;
	const { search } = state.leads;
	return { user, loading, search };
};

export default connect(mapStateToProps, { getSearchResults })(Search);
