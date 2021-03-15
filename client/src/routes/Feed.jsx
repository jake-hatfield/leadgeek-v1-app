import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { getLeads } from '../redux/actions/leads';

import Leads from '../components/leads/Leads';
import Pagination from '../components/layout/Pagination';

const Feed = ({ user, loading, isAuthenticated, pagination, getLeads }) => {
	useEffect(() => {
		!loading && isAuthenticated && user && getLeads(user, pagination.feed.page);
	}, [loading, isAuthenticated, user && pagination.feed.page]);

	return (
		<Leads
			leads={pagination.feed.active}
			pagination={pagination.feed}
			type={'feed'}
		/>
	);
};

const mapStateToProps = (state) => {
	const { user, loading, isAuthenticated } = state.auth;
	const { pagination } = state.leads;
	return { user, loading, isAuthenticated, pagination };
};

export default connect(mapStateToProps, { getLeads })(Feed);
