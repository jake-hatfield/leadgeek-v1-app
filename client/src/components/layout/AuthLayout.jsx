import React, { Fragment } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { removeAlert } from '@redux/actions/alert';

import Alert from './utils/Alert';
import Navbar from './navigation/Navbar';

const AuthLayout = ({
	user,
	isAuthenticated,
	loading,
	removeAlert,
	children,
}) => {
	return (
		<Fragment>
			<Alert removeAlert={removeAlert} />
			{!loading && user && isAuthenticated && (
				<div className='min-h-screen relative flex'>
					<Navbar
						_id={user._id}
						role={user.role}
						name={user.name}
						loading={loading}
					/>
					<main className='h-full w-full content'>{children}</main>
				</div>
			)}
		</Fragment>
	);
};

AuthLayout.propTypes = {
	user: PropTypes.object.isRequired,
	loading: PropTypes.bool.isRequired,
	children: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
	const { user, isAuthenticated, loading } = state.auth;
	const { children } = ownProps;
	return { user, isAuthenticated, loading, children };
};

export default connect(mapStateToProps, { removeAlert })(AuthLayout);
