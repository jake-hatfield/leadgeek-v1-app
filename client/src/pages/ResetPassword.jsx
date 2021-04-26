import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { resetPwValidation } from 'redux/actions/auth';

import Layout from 'components/layout/Layout';
import ResetPassword from 'components/auth/login/password/ResetPassword';
import LoginImage from 'components/auth/login/LoginImage';
import Spinner from 'components/layout/Spinner';
import UnAuthFooter from 'components/layout/navigation/UnAuthFooter';
import { ReactComponent as LeadGeekLogo } from 'assets/images/svgs/leadgeek-logo-light.svg';

const ResetPasswordPage = ({
	user,
	loading,
	isAuthenticated,
	validatedResetPwToken,
	resetPwValidation,
}) => {
	const [resetPwToken] = useState(localStorage.resetPwToken);
	// check for valid token
	useEffect(() => {
		resetPwValidation(resetPwToken);
	}, []);
	if (isAuthenticated) {
		return <Redirect to='/leads' />;
	}
	return !loading ? (
		<Layout>
			{validatedResetPwToken ? (
				<section className='h-screen relative flex justify-center bg-gray-100'>
					<div className='lg:hidden h-2 absolute inset-x-0 top-0 bg-purple-300' />
					<div className='xl:h-screen w-full xl:w-3/5 md:flex md:flex-col md:justify-between bg-gray-100'>
						<div className='mt-6 hidden md:block container'>
							<a href='https://leadgeek.io'>
								<LeadGeekLogo className='inline-block w-12' />
							</a>
						</div>
						<div className='container'>
							<div className='mt-12 md:mt-0 mx-auto py-4 lg:py-6 px-6 md:px-8 lg:px-12 w-full max-w-md bg-white rounded-md shadow-lg'>
								<h1 className='text-xl md:text-2xl lg:text-3xl font-black text-gray-900'>
									Reset password
								</h1>
								<ResetPassword
									email={user.email}
									loading={loading}
									fullWidthButton={true}
								/>
							</div>
						</div>
						<div className='mt-6 xl:mt-0 mb-6 container'>
							&copy; 2020 - {new Date().getFullYear()} LeadGeek, Inc. All rights
							reserved.
						</div>
					</div>
					<LoginImage />
				</section>
			) : (
				<section className='h-screen relative flex justify-center bg-gray-100'>
					<div className='lg:hidden h-2 absolute inset-x-0 top-0 bg-purple-300' />
					<div className='xl:h-screen w-full xl:w-3/5 md:flex md:flex-col md:justify-between bg-gray-100'>
						<div className='mt-6 hidden md:block container'>
							<a href='https://leadgeek.io'>
								<LeadGeekLogo className='inline-block w-12' />
							</a>
						</div>
						<div className='container'>
							<div className='mt-12 md:mt-0 mx-auto py-4 lg:py-6 px-6 md:px-8 lg:px-12 w-full max-w-md bg-white rounded-md shadow-lg'>
								<header>
									<LeadGeekLogo className='md:hidden w-16' />
									<h1 className='text-2xl md:text-3xl lg:text-4xl font-black text-gray-900'>
										Uh-oh!
									</h1>
									<div className='my-3 inline-block'>
										Your password could not be reset. Please try to{' '}
										<NavLink to='/reset/forgot-password' className='link'>
											get a new password reset link
										</NavLink>{' '}
										or{' '}
										<a href='https://leadgeek.io/contact' className='link'>
											contact support
										</a>
										.
										<NavLink
											to='/login'
											className='block bg-purple-600 mt-4 py-2 w-full rounded-md text-white text-center shadow-md hover:bg-purple-500 transition-colors duration-200 focus:outline-none focus:shadow-outline'
										>
											Return to log in
										</NavLink>
									</div>
								</header>
							</div>
						</div>
						<UnAuthFooter />
					</div>
					<LoginImage />
				</section>
			)}
		</Layout>
	) : (
		<Spinner />
	);
};

ResetPasswordPage.propTypes = {
	isAuthenticated: PropTypes.bool.isRequired,
	loading: PropTypes.bool.isRequired,
	validatedResetPwToken: PropTypes.bool.isRequired,
	resetPwValidation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
	const { user, loading, isAuthenticated, validatedResetPwToken } = state.auth;
	return { user, loading, isAuthenticated, validatedResetPwToken };
};

export default connect(mapStateToProps, {
	resetPwValidation,
})(ResetPasswordPage);
