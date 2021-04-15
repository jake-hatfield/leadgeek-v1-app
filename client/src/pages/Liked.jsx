import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLikedLeads } from 'redux/actions/leads';

import AuthLayout from 'components/layout/AuthLayout';
import Leads from 'components/leads/Leads';

const Liked = ({ user, loading, liked, getLikedLeads }) => {
	useEffect(() => {
		!loading && user && getLikedLeads(user.likedLeads, liked.page);
	}, [user.likedLeads, liked.page]);
	return (
		<AuthLayout>
			<Leads
				leads={liked.pageByIds}
				pagination={liked.pagination}
				type={'liked'}
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
	const { liked } = state.leads;
	return { user, loading, liked };
};

export default connect(mapStateToProps, { getLikedLeads })(Liked);
