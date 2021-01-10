import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { forgotPassword } from '../../../../redux/actions/auth';
import { setAlert } from '../../../../redux/actions/alert';
import FormField from '../../formField/FormField';
import LoginImage from '../LoginImage';
import { ReactComponent as LeadGeekLogo } from '../../../../assets/images/svgs/leadgeek-logo-light.svg';

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
		<Fragment>
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
									Reset password
								</h1>
								<p className='inline-block'>
									Don't worry, it happens to the best of us.
								</p>
								<p className='mt-2 inline-block'>
									We'll send password reset instructions to the email below.
								</p>
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
									className='bg-purple-600 mt-4 py-2 w-full rounded-md text-white shadow-md hover:bg-purple-500 transition-colors duration-200 focus:outline-none focus:shadow-outline'
								>
									Send email
								</button>
								<div className='mt-4 text-sm text-gray-400 link'>
									<NavLink exact to={'/login'}>
										Back to log in
									</NavLink>
								</div>
							</form>
						</div>
					</div>
					<div className='mt-6 xl:mt-0 mb-6 container'>
						&copy; 2020 - {new Date().getFullYear()} LeadGeek, Inc. All rights
						reserved.
					</div>
				</div>
				<LoginImage />
			</section>
		</Fragment>
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
