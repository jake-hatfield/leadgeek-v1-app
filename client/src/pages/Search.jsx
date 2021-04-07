import React from 'react';

import { connect } from 'react-redux';
import { getLeads } from '../redux/actions/leads';

import AuthLayout from '../components/layout/AuthLayout';
import Leads from '../components/leads/Leads';

const Search = ({ search }) => {
	return (
		<AuthLayout>
			<section className='my-6'>
				<Leads
					headerTitle={'Search results'}
					leads={search.pageByIds}
					totalItems={search.length}
					type={'search'}
					search={true}
				/>
			</section>
		</AuthLayout>
	);
};

const mapStateToProps = (state) => {
	const { search } = state.leads;
	return { search };
};

export default connect(mapStateToProps, { getLeads })(Search);
