import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { getLeads } from '../redux/actions/leads';

import AuthLayout from '../components/layout/AuthLayout';
import Leads from '../components/leads/Leads';

const Feed = ({ user, loading, isAuthenticated, feed, filters, getLeads }) => {
	useEffect(() => {
		!loading && isAuthenticated && user && getLeads(user, feed.page, filters);
	}, [loading, isAuthenticated, user && feed.page]);

	return (
		<AuthLayout>
			<Leads
				leads={feed.pageByIds}
				pagination={feed}
				totalItems={feed.totalItems}
				type={'feed'}
			/>
		</AuthLayout>
	);
};

const mapStateToProps = (state) => {
	const { user, loading, isAuthenticated } = state.auth;
	const { feed } = state.leads;
	const { filters } = state;
	return { user, loading, isAuthenticated, feed, filters };
};

export default connect(mapStateToProps, { getLeads })(Feed);
