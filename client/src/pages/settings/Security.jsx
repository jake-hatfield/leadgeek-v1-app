import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import AuthLayout from 'components/layout/AuthLayout';
import SettingsLayout from 'components/layout/SettingsLayout';
import ResetPassword from 'components/auth/login/password/ResetPassword';
import Spinner from 'components/layout/utils/Spinner';

const Dashboard = ({ auth: { user, loading, isAuthenticated } }) => {
	return (
		<AuthLayout>
			<SettingsLayout
				title={'Security & password'}
				desc={'Change your password & other security settings'}
				loading={loading}
				isAuthenticated={isAuthenticated}
				user={user}
			>
				<section className='my-6'>
					{loading ? (
						<Spinner />
					) : (
						<div className='w-full max-w-3xl'>
							<article>
								<h3 className='font-bold text-lg text-gray-800'>
									Reset Password
								</h3>
								<div className='max-w-md'>
									<ResetPassword email={user && user.email} />
								</div>
							</article>
						</div>
					)}
				</section>
			</SettingsLayout>
		</AuthLayout>
	);
};

Dashboard.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProps)(Dashboard);
