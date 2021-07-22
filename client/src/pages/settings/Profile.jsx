import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';

import AuthLayout from 'components/layout/AuthLayout';
import SettingsLayout from 'components/layout/SettingsLayout';
import FormField from 'components/layout/utils/FormField';
import Spinner from 'components/layout/utils/Spinner';

const Dashboard = ({ auth: { user, loading, isAuthenticated } }) => {
	return (
		<AuthLayout>
			<SettingsLayout
				title={'Profile'}
				desc={'Edit your Leadgeek profile'}
				pill={{
					active: true,
					text:
						!loading &&
						`Member since ${DateTime.fromISO(user.dateCreated).toFormat(
							'LLL dd, yyyy'
						)}`,
				}}
				loading={loading}
				isAuthenticated={isAuthenticated}
				user={user}
			>
				<section>
					{loading ? (
						<Spinner />
					) : (
						<div className='w-full max-w-3xl'>
							<article className='w-full max-w-md mt-6'>
								<header>
									<h2 className='font-bold text-lg text-gray-800'>
										Basic information
									</h2>
								</header>
								<div className='mt-4'>
									<FormField
										padding='pt-0'
										label='Name'
										labelSize='text-base'
										placeholder={user.name}
										value={user.name}
									/>
									<FormField
										label='Email'
										labelSize='text-base'
										placeholder={user.email}
										value={user.email}
									/>
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
