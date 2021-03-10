import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { populateArchivedLeads } from '../redux/actions/leads';

import Leads from '../components/leads/Leads';

const Archived = ({ user, archived, populateArchivedLeads }) => {
	useEffect(() => {
		archived.length === 0 && populateArchivedLeads(user.archivedLeads);
	}, [user]);
	return <Leads leads={archived} />;
};

const mapStateToProps = (state) => {
	const { user } = state.auth;
	const { archived } = state.leads;
	return { user, archived };
};

export default connect(mapStateToProps, { populateArchivedLeads })(Archived);
