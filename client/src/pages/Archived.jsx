import React, { useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getArchivedLeads } from 'redux/actions/leads';

import AuthLayout from 'components/layout/AuthLayout';
import Leads from 'components/leads/Leads';

const Archived = ({
	user,
	loading,
	pageByIds,
	pagination,
	itemLimit,
	getArchivedLeads,
}) => {
	const { archivedLeads } = Object(user);
	useEffect(() => {
		!loading &&
			user &&
			getArchivedLeads(archivedLeads, pagination.page, itemLimit);
	}, [archivedLeads, pagination.page, itemLimit]);
	return (
		<AuthLayout>
			<Leads
				leads={pageByIds}
				pagination={pagination}
				type={'archived'}
				itemLimit={itemLimit}
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
	const { pageByIds, pagination } = state.leads.archived;
	const { leadsLimit: itemLimit } = state.filters.itemLimits;
	return { user, loading, pageByIds, pagination, itemLimit };
};

export default connect(mapStateToProps, { getArchivedLeads })(Archived);
