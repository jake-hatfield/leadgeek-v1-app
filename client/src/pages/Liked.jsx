import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLikedLeads } from 'redux/actions/leads';

import AuthLayout from 'components/layout/AuthLayout';
import Leads from 'components/leads/Leads';

const Liked = ({
	user,
	loading,
	pageByIds,
	pagination,
	itemLimit,
	getLikedLeads,
}) => {
	console.log(pagination.page);
	const { likedLeads } = Object(user);
	useEffect(() => {
		!loading && user && getLikedLeads(likedLeads, pagination.page, itemLimit);
	}, [likedLeads, pagination.page, itemLimit]);
	return (
		<AuthLayout>
			<Leads
				leads={pageByIds}
				pagination={pagination}
				type={'liked'}
				itemLimit={itemLimit}
				user={user}
				loading={loading}
			/>
		</AuthLayout>
	);
};

Liked.propTypes = {
	user: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
	liked: PropTypes.object.isRequired,
	getLikedLeads: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
	const { user, loading } = state.auth;
	const { pageByIds, pagination } = state.leads.liked;
	const { leadsLimit: itemLimit } = state.filters.itemLimits;
	return { user, loading, pageByIds, pagination, itemLimit };
};

export default connect(mapStateToProps, { getLikedLeads })(Liked);
