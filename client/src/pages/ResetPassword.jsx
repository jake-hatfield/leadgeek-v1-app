import React, { Fragment, useEffect } from 'react';

import { Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { resetPasswordValidation, updatePassword } from '../redux/actions/auth';
import { setAlert } from '../redux/actions/alert';

import Layout from '../components/layout/Layout';
import ResetPassword from './ResetPassword';
import LoginImage from '../components/auth/login/LoginImage';
import { ReactComponent as LeadGeekLogo } from '../assets/images/svgs/leadgeek-logo-light.svg';

const ResetPasswordPage = ({
	auth: { isAuthenticated, loading, validatedResetPasswordToken },
	resetPasswordValidation,
}) => {
	const resetPasswordToken = localStorage.resetPasswordToken;
	// check for valid token
	useEffect(() => {
		resetPasswordValidation(resetPasswordToken);
	}, [resetPasswordToken, resetPasswordValidation]);
	if (isAuthenticated) {
		return <Redirect to='/' />;
	}
	return (
		<Layout>
			{!loading && validatedResetPasswordToken ? (
				<section className='h-screen relative flex justify-center bg-gray-100'>
					<div className='lg:hidden h-2 absolute inset-x-0 top-0 bg-purple-300' />
					<div className='xl:h-screen w-full xl:w-3/5 md:flex md:flex-col md:justify-between bg-gray-100'>
						<div className='mt-6 hidden md:block container'>
							<a href='https://leadgeek.io'>
								<LeadGeekLogo className='inline-block w-16' />
							</a>
						</div>
						<div className='container'>
							<div className='mt-12 md:mt-0 mx-auto py-4 lg:py-6 px-6 md:px-8 lg:px-12 w-full max-w-md bg-white rounded-md shadow-lg'>
								<h1 className='text-2xl md:text-3xl lg:text-4xl font-black text-gray-900'>
									Reset password
								</h1>
								<ResetPassword fullWidthButton={true} />
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
								<LeadGeekLogo className='inline-block w-16' />
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
						<div className='mt-6 xl:mt-0 mb-6 container'>
							&copy; 2020 - {new Date().getFullYear()} LeadGeek, Inc. All rights
							reserved.
						</div>
					</div>
					<LoginImage />
				</section>
			)}
		</Layout>
	);
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	setAlert: state.alert,
});

export default connect(mapStateToProps, {
	resetPasswordValidation,
	updatePassword,
	setAlert,
})(ResetPasswordPage);
