import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import { getLikedLeads } from '../redux/actions/leads';

import AuthLayout from '../components/layout/AuthLayout';
import Leads from '../components/leads/Leads';

const Liked = ({ user, loading, liked, getLikedLeads }) => {
	useEffect(() => {
		!loading && user && getLikedLeads(user.likedLeads, liked.page);
	}, [user.likedLeads, liked.page]);
	return (
		<AuthLayout>
			<Leads leads={liked.pageByIds} pagination={liked} type={'liked'} />
		</AuthLayout>
	);
};

const mapStateToProps = (state) => {
	const { user } = state.auth;
	const { loading, liked } = state.leads;
	return { user, loading, liked };
};

export default connect(mapStateToProps, { getLikedLeads })(Liked);
