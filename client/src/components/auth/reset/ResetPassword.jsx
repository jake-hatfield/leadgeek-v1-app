import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import { resetPasswordValidation } from '../../../redux/actions/auth';
import { setAlert } from '../../../redux/actions/alert';

import FormField from '../formField/FormField';
import LoginImage from '../../layout/LoginImage';
import { ReactComponent as LeadGeekLogo } from '../../../assets/images/svgs/leadgeek-logo-light.svg';

const ResetPassword = ({ auth: { loading }, resetPasswordValidation }) => {
	const resetPasswordToken = localStorage.resetPasswordToken;
	useEffect(() => {
		resetPasswordValidation(resetPasswordToken);
	}, []);

	const [formData, setFormData] = useState({
		email: '',
	});
	// const { email, password_1, password_2 } = formData;
	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });
	const updatePassword = (e) => {
		e.preventDefault();
		axios.put('/users/updatePassword', {});
	};
	const onSubmit = (e) => {
		e.preventDefault();
		updatePassword(e);
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
					<div className='mt-12 md:mt-0 mx-4 md:mx-auto pt-2 pb-3 lg:pt-6 px-6 md:px-8 lg:px-12 w-full max-w-md bg-white rounded-md shadow-lg'>
						<header>
							<LeadGeekLogo className='md:hidden w-16' />
							<h1 className='text-4xl font-black text-gray-900'>
								Change password
							</h1>
							<p className='inline-block'>
								Please enter a new, secure password.
							</p>
							{/* <div className='inline-block'>
								In order to protect your account, please make sure your
								password:
								<ul className='mt-4'>
									<li>Is longer than 8 characters</li>
								</ul>
							</div> */}
						</header>
						<form className='my-3' onSubmit={(e) => onSubmit(e)}>
							<FormField
								label='New Password'
								type='text'
								placeholder='Create a new password'
								name='password_1'
								onChange={onChange}
								// required
							/>
							<FormField
								label='Confirm Password'
								type='text'
								placeholder='Enter the password again'
								name='password_2'
								onChange={onChange}
								// required
							/>
							<button
								type='submit'
								className='bg-purple-600 mt-4 py-2 w-full rounded-md text-white shadow-md hover:bg-purple-500 transition-colors duration-200 focus:outline-none focus:shadow-outline'
							>
								Reset password
							</button>
						</form>
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

ResetPassword.propTypes = {
	auth: PropTypes.object.isRequired,
	resetPasswordValidation: PropTypes.func.isRequired,
	// updatePassword: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	// updatePassword: state.auth.updatePassword,
	setAlert: state.alert,
});

export default connect(mapStateToProps, {
	resetPasswordValidation,
	// updatePassword,
	setAlert,
})(ResetPassword);
