import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { populateArchivedLeads } from '../redux/actions/leads';

import Leads from '../components/leads/Leads';

const Archived = ({
	user,
	loading,
	archived,
	pagination,
	populateArchivedLeads,
}) => {
	useEffect(() => {
		!loading &&
			user &&
			populateArchivedLeads(user.archivedLeads, pagination.archived.page);
	}, [user.archivedLeads, pagination.archived.page]);
	return (
		<Leads
			leads={pagination.archived.active}
			pagination={pagination.archived}
			type={'archived'}
		/>
	);
};

const mapStateToProps = (state) => {
	const { user, loading } = state.auth;
	const { archived, pagination } = state.leads;
	return { user, loading, archived, pagination };
};

export default connect(mapStateToProps, { populateArchivedLeads })(Archived);
