import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getArchivedLeads } from '../redux/actions/leads';

import AuthLayout from '../components/layout/AuthLayout';
import Leads from '../components/leads/Leads';

const Archived = ({ user, loading, archived, getArchivedLeads }) => {
	useEffect(() => {
		!loading && user && getArchivedLeads(user.archivedLeads, archived.page);
	}, [user.archivedLeads, archived.page]);
	return (
		<AuthLayout>
			<Leads
				leads={archived.pageByIds}
				pagination={archived.pagination}
				type={'archived'}
				user={user}
				loading={loading}
			/>
		</AuthLayout>
	);
};

Archived.propTypes = {
	user: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
	archived: PropTypes.object.isRequired,
	getArchivedLeads: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
	const { user, loading } = state.auth;
	const { archived } = state.leads;
	return { user, loading, archived };
};

export default connect(mapStateToProps, { getArchivedLeads })(Archived);
