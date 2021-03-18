import React, { useState } from 'react';
import { connect } from 'react-redux';
import { exportLeads } from '../redux/actions/leads';

import AuthLayout from '../components/layout/AuthLayout';

import Spinner from '../components/layout/Spinner';

const Admin = ({ user, loading, exportLeads }) => {
	const [popup, setPopup] = useState(false);
	return (
		<AuthLayout>
			{!loading ? (
				user.role === 'admin' ? (
					<section className='container'>
						<button onClick={() => setPopup(true)}>Export all leads</button>
						{popup && (
							<div>
								<p>Please confirm the leads you're adding aren't duplicates.</p>
								<button
									onClick={(e) => {
										e.stopPropagation();
										exportLeads();
										setPopup(false);
									}}
								>
									Confirm and export
								</button>
							</div>
						)}
					</section>
				) : (
					<div>You aren't allowed to access this page.</div>
				)
			) : (
				<Spinner />
			)}
		</AuthLayout>
	);
};

const mapStateToProps = (state) => {
	const { user, loading } = state.auth;
	return { user, loading };
};

export default connect(mapStateToProps, { exportLeads })(Admin);
