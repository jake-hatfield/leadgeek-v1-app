import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { getLeads } from '../redux/actions/leads';

import AuthLayout from '../components/layout/AuthLayout';
import Header from '../components/layout/navigation/Header';

const Search = ({ user, loading, isAuthenticated, pagination, getLeads }) => {
	useEffect(() => {
		!loading && isAuthenticated && user && getLeads(user, pagination.feed.page);
	}, [loading, isAuthenticated, user && pagination.feed.page]);

	return (
		<AuthLayout>
			<section className='my-6'>
				<Header title={'Search'} user={user} leads={pagination.feed.active} />
			</section>
		</AuthLayout>
	);
};

const mapStateToProps = (state) => {
	const { user, loading, isAuthenticated } = state.auth;
	const { pagination } = state.leads;
	return { user, loading, isAuthenticated, pagination };
};

export default connect(mapStateToProps, { getLeads })(Search);
