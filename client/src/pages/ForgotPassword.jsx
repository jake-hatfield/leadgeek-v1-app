import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { forgotPassword } from '../redux/actions/auth';
import { setAlert } from '../redux/actions/alert';

import Layout from 'components/layout/Layout';
import FormField from 'components/layout/formField/FormField';
import LoginImage from 'components/auth/login/LoginImage';
import UnAuthFooter from 'components/layout/navigation/UnAuthFooter';
import { ReactComponent as LeadGeekLogo } from 'assets/images/svgs/leadgeek-logo-light.svg';

const ForgotPassword = ({ forgotPassword, setAlert }) => {
	const [formData, setFormData] = useState({
		email: '',
	});
	const { email } = formData;
	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });
	const sendEmail = (e) => {
		e.preventDefault();
		if (email === '') {
			setAlert('Please enter your email', 'danger');
		} else {
			forgotPassword(email);
		}
	};
	const onSubmit = (e) => {
		sendEmail(e);
	};
	return (
		<Layout>
			<section className='h-screen relative flex justify-center bg-gray-100'>
				<div className='h-2 absolute z-10 inset-x-0 top-0 bg-purple-300' />
				<div className='xl:h-screen w-full xl:w-3/5 md:flex md:flex-col md:justify-between bg-gray-100'>
					<div className='mt-6 hidden md:block container'>
						<a href='https://leadgeek.io'>
							<LeadGeekLogo className='inline-block w-12' />
						</a>
					</div>
					<div>
						<div className='mt-12 md:mt-0 mx-auto py-4 lg:py-6 px-6 md:px-8 lg:px-12 w-full max-w-md bg-white rounded-md shadow-lg'>
							<header>
								<LeadGeekLogo className='md:hidden w-16' />
								<h1 className='pb-2 text-xl md:text-2xl lg:text-3xl font-black text-gray-900 border-b border-gray-200'>
									Reset password
								</h1>
								<div className='mt-2'>
									<p className='inline-block'>
										Don't worry, it happens to the best of us.
									</p>
									<p className='mt-2 inline-block'>
										We'll send password reset instructions to the email below.
									</p>
								</div>
							</header>
							<form className='my-3' onSubmit={(e) => onSubmit(e)}>
								<FormField
									label='Email'
									type='email'
									placeholder='dsaunders@gmail.com'
									name='email'
									value={email}
									onChange={onChange}
									required
								/>
								<button
									type='submit'
									className='mt-4 py-2 w-full rounded-md font-semibold text-white bg-purple-500 hover:bg-purple-600 shadow-sm hover:shadow-md transition-colors duration-100 ease-in-out focus:outline-none focus:shadow-outline'
								>
									Send email
								</button>
								<div className='mt-4 text-sm text-gray-400'>
									<NavLink exact to={'/login'} className='link'>
										Back to log in
									</NavLink>
								</div>
							</form>
						</div>
					</div>
					<UnAuthFooter />
				</div>
				<LoginImage />
			</section>
		</Layout>
	);
};

ForgotPassword.propTypes = {
	setAlert: PropTypes.func.isRequired,
	forgotPassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	resetPassword: state.auth.resetPassword,
	setAlert: state.alert,
});

export default connect(mapStateToProps, { setAlert, forgotPassword })(
	ForgotPassword
);
