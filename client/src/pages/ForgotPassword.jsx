import React, { useState } from 'react';

import axios from 'axios';

import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../redux/actions/alert';

import DefaultLayout from '@components/layout/DefaultLayout';
import FormField from '@components/layout/utils/FormField';
import LoginImage from '@components/auth/login/LoginImage';
import DefaultFooter from '@components/layout/navigation/DefaultFooter';
import { ReactComponent as LeadGeekLogo } from '@assets/images/svgs/leadgeek-logo-light.svg';
import Button from '@components/layout/utils/Button';

import { setResetPwToken } from '@utils/authTokens';
import { config } from '@utils/utils';

const ForgotPassword = ({ setAlert }) => {
	const [formData, setFormData] = useState({
		email: '',
	});
	const { email } = formData;
	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const forgotPassword = (email) => async (dispatch) => {
		const emailToLowerCase = email.toLowerCase();
		const body = JSON.stringify({ email: emailToLowerCase });
		try {
			const res = await axios.post('/api/users/forgot-password', body, config);
			if (res.data.msg === 'Password recovery email sent successfully') {
				dispatch(
					setAlert(
						'Email sent',
						`An email has been sent to ${email} if an account is associated.`,
						'success'
					)
				);
				const { token } = res.data;
				setResetPwToken(token);
			}
		} catch (error) {
			// make sure people can't guess user's password by trial and error
			const errorMsg = error.response.data;
			if (errorMsg === 'Email not found in database') {
				dispatch(
					setAlert(
						'Email sent',
						`An email has been sent to ${email} if an account is associated.`,
						'success'
					)
				);
			} else {
				dispatch(
					setAlert(
						'Error sending email',
						'Email could not be sent. Please contact LeadGeek support.',
						'danger'
					)
				);
			}
		}
	};
	const sendEmail = (e) => {
		e.preventDefault();
		if (email === '') {
			setAlert(
				'Please enter your email',
				'The email field is required. Please enter one and try again.',
				'danger'
			);
		} else {
			forgotPassword(email);
		}
	};
	const onSubmit = (e) => {
		sendEmail(e);
	};
	return (
		<DefaultLayout>
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
								<LeadGeekLogo className='md:hidden w-12' />
								<h1 className='pb-2 text-xl md:text-2xl lg:text-3xl font-black text-gray-900 border-b border-gray-100'>
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
								/>
								<div className='mt-4'>
									<Button
										text={'Send email'}
										onClick={onSubmit}
										width={'w-full'}
										size={'sm'}
										cta={true}
									/>
								</div>
								<div className='mt-4 text-sm text-gray-400'>
									<NavLink exact to={'/login'} className='link'>
										Back to log in
									</NavLink>
								</div>
							</form>
						</div>
					</div>
					<DefaultFooter />
				</div>
				<LoginImage />
			</section>
		</DefaultLayout>
	);
};

ForgotPassword.propTypes = {
	setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	resetPassword: state.auth.resetPassword,
	setAlert: state.alert,
});

export default connect(mapStateToProps, { setAlert })(ForgotPassword);
