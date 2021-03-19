import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { getLeads } from '../redux/actions/leads';

import AuthLayout from '../components/layout/AuthLayout';
import Leads from '../components/leads/Leads';

const Feed = ({ user, loading, isAuthenticated, pagination, getLeads }) => {
	useEffect(() => {
		!loading && isAuthenticated && user && getLeads(user, pagination.feed.page);
	}, [loading, isAuthenticated, user && pagination.feed.page]);

	return (
		<AuthLayout>
			<Leads
				leads={pagination.feed.active}
				pagination={pagination.feed}
				totalItems={pagination.feed.totalItems}
				type={'feed'}
			/>
		</AuthLayout>
	);
};

const mapStateToProps = (state) => {
	const { user, loading, isAuthenticated } = state.auth;
	const { pagination } = state.leads;
	return { user, loading, isAuthenticated, pagination };
};

export default connect(mapStateToProps, { getLeads })(Feed);
