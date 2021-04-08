import React, { Fragment } from 'react';

import { connect } from 'react-redux';

import Alert from '../layout/Alert';
import Navbar from './navigation/Navbar';

const AuthLayout = ({ user, children }) => {
	return (
		<Fragment>
			<Alert />
			<div className='relative flex'>
				{user && <Navbar />}
				<main className='w-full content'>{children}</main>
			</div>
		</Fragment>
	);
};

const mapStateToProps = (state, ownProps) => {
	const { user } = state.auth;
	const { children } = ownProps;
	return { user, children };
};

export default connect(mapStateToProps)(AuthLayout);
