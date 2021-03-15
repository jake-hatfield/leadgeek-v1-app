import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { populateLikedLeads } from '../redux/actions/leads';

import Leads from '../components/leads/Leads';

const Liked = ({ user, loading, pagination, populateLikedLeads }) => {
	useEffect(() => {
		!loading &&
			user &&
			populateLikedLeads(user.likedLeads, pagination.liked.page);
	}, [user.likedLeads, pagination.liked.page]);
	return (
		<Leads
			leads={pagination.liked.active}
			pagination={pagination.liked}
			type={'liked'}
		/>
	);
};

const mapStateToProps = (state) => {
	const { user } = state.auth;
	const { loading, pagination } = state.leads;
	return { user, loading, pagination };
};

export default connect(mapStateToProps, { populateLikedLeads })(Liked);
