import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLeads } from 'redux/actions/leads';

import AuthLayout from 'components/layout/AuthLayout';
import Leads from 'components/leads/Leads';

const Search = ({ user, search }) => {
	return (
		<AuthLayout>
			<section className='my-6'>
				<Leads
					leads={search.pageByIds}
					type={'search'}
					user={user}
					headerTitle={'Search results'}
					search={true}
				/>
			</section>
		</AuthLayout>
	);
};

Search.propTypes = {
	user: PropTypes.object.isRequired,
	search: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
	const { user } = state.auth;
	const { search } = state.leads;
	return { user, search };
};

export default connect(mapStateToProps, { getLeads })(Search);
