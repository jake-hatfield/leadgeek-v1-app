import React, { Fragment, useEffect } from 'react';
import { connect } from 'react-redux';
import { getLeads } from '../redux/actions/leads';

import Leads from '../components/leads/Leads';

const Feed = ({ user, isAuthenticated, loading, leads, page, getLeads }) => {
	// const date = localStorage.getItem('lastLogout');
	// let lastLogout = new Date(date);
	// lastLogout.setDate(date.getDate() + 7);
	useEffect(() => {
		// console.log(lastLogout);
		!loading && isAuthenticated && user && getLeads(user, page);
	}, [loading, isAuthenticated, user && page]);
	return (
		<Fragment>
			<Leads leads={leads} />
			<div>hello</div>
		</Fragment>
	);
};

const mapStateToProps = (state) => {
	const { user, isAuthenticated, loading } = state.auth;
	const {
		feed: leads,
		pagination: { page },
	} = state.leads;
	return { user, isAuthenticated, leads, page };
};

export default connect(mapStateToProps, { getLeads })(Feed);
