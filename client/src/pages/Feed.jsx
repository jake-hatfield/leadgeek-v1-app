import React, { useEffect } from 'react';

import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { getLeads } from '../redux/actions/leads';

import AuthLayout from '../components/layout/AuthLayout';
import Leads from '../components/leads/Leads';
import Spinner from '../components/layout/Spinner';

const Feed = ({ user, loading, isAuthenticated, feed, filters, getLeads }) => {
	const componentReady = !loading && user && isAuthenticated;
	const { page } = feed.pagination;
	const userAndPage = user && page;
	useEffect(() => {
		!loading && isAuthenticated && user && getLeads(user, page, filters);
	}, [loading, isAuthenticated, userAndPage]);
	return componentReady ? (
		<AuthLayout>
			<Leads
				leads={feed.pageByIds}
				pagination={feed.pagination}
				type={'feed'}
				user={user}
				loading={loading}
			/>
		</AuthLayout>
	) : (
		<Spinner text='Loading...' />
	);
};

Feed.propTypes = {
	user: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
	isAuthenticated: PropTypes.bool,
	feed: PropTypes.object.isRequired,
	filters: PropTypes.object,
	getLeads: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
	const { user, loading, isAuthenticated } = state.auth;
	const { feed } = state.leads;
	const { filters } = state;
	return { user, loading, isAuthenticated, feed, filters };
};

export default connect(mapStateToProps, { getLeads })(Feed);
