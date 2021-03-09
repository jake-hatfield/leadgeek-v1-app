import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { populateLikedLeads } from '../redux/actions/leads';

import Leads from '../components/leads/Leads';

const Feed = ({ loading, leads }) => {
	return <Leads leads={leads} />;
};

const mapStateToProps = (state) => ({
	loading: state.leads.loading,
	leads: state.leads.feed,
});

export default connect(mapStateToProps, { populateLikedLeads })(Feed);
