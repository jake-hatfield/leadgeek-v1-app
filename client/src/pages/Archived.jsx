import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { populateArchivedLeads } from '../redux/actions/leads';

import AuthLayout from '../components/layout/AuthLayout';
import Leads from '../components/leads/Leads';

const Archived = ({ user, loading, pagination, populateArchivedLeads }) => {
	useEffect(() => {
		!loading &&
			user &&
			populateArchivedLeads(user.archivedLeads, pagination.archived.page);
	}, [user.archivedLeads, pagination.archived.page]);
	return (
		<AuthLayout>
			<Leads
				leads={pagination.archived.active}
				pagination={pagination.archived}
				type={'archived'}
			/>
		</AuthLayout>
	);
};

const mapStateToProps = (state) => {
	const { user, loading } = state.auth;
	const { pagination } = state.leads;
	return { user, loading, pagination };
};

export default connect(mapStateToProps, { populateArchivedLeads })(Archived);
