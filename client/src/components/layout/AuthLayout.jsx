import React, { Fragment } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Alert from '../layout/Alert';
import Navbar from './navigation/Navbar';

const AuthLayout = ({ user, isAuthenticated, loading, children }) => {
	return (
		<Fragment>
			<Alert />
			<div className='min-h-screen relative flex'>
				{user && isAuthenticated && (
					<Navbar _id={user._id} role={user.role} loading={loading} />
				)}
				<main className='h-full w-full content'>{children}</main>
			</div>
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

export default connect(mapStateToProps)(AuthLayout);
