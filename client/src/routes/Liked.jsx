import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { populateLikedLeads } from '../redux/actions/leads';

import Leads from '../components/leads/Leads';

const Liked = ({ user, liked, populateLikedLeads }) => {
	useEffect(() => {
		liked.length === 0 && populateLikedLeads(user.likedLeads);
	}, [user]);
	return <Leads leads={liked} />;
};

const mapStateToProps = (state) => {
	const { user } = state.auth;
	const { liked } = state.leads;
	return { user, liked };
};

export default connect(mapStateToProps, { populateLikedLeads })(Liked);
k;
