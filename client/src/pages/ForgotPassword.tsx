import React, { useState } from 'react';

import { NavLink } from 'react-router-dom';
import axios from 'axios';

import { setAlert } from '@features/alert/alertSlice';

import DefaultLayout from '@components/layout/DefaultLayout';
import FormField from '@components/utils/FormField';
// import LoginImage from '@components/auth/login/LoginImage';
import DefaultFooter from '@components/layout/navigation/DefaultFooter';
import { ReactComponent as LeadGeekLogo } from '@assets/images/svgs/leadgeek-logo-light.svg';
import Button from '@components/utils/Button';

import { setResetPwToken } from '@utils/authTokens';
import { config } from '@utils/utils';
import { useAppDispatch } from '@utils/hooks';

const ForgotPassword = () => {
	const dispatch = useAppDispatch();
	const [formData, setFormData] = useState({
		email: '',
	});
	const { email } = formData;
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	const forgotPassword = async (email: string) => {
		const emailToLowerCase = email.toLowerCase();
		const body = JSON.stringify({ email: emailToLowerCase });
		try {
			const { data } = await axios.post(
				'/api/auth/forgot-password',
				body,
				config
			);
			if (data.message === 'Password recovery email sent successfully') {
				dispatch(
					dispatch(
						setAlert({
							title: 'Email sent',
							message: `An email has been sent to ${email} if an account is associated.`,
							alertType: 'success',
						})
					)
				);
				const { token } = data;
				setResetPwToken(token);
			}
		} catch (error: any) {
			// make sure people can't guess user's password by trial and error
			const errorMsg = error?.response.data;
			if (errorMsg === 'Email not found in database') {
				dispatch(
					setAlert({
						title: 'Email sent',
						message: `An email has been sent to ${email} if an account is associated.`,
						alertType: 'success',
					})
				);
			} else {
				dispatch(
					setAlert({
						title: 'Error sending email',
						message:
							'Email could not be sent. Please contact LeadGeek support.',
						alertType: 'danger',
					})
				);
			}
		}
	};

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (email === '') {
			dispatch(
				setAlert({
					title: 'Please enter your email',
					message:
						'The email field is required. Please enter one and try again.',
					alertType: 'danger',
				})
			);
		} else {
			forgotPassword(email);
		}
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
									required={true}
									styles={null}
								/>
								<div className='mt-4'>
									<Button
										text={'Send email'}
										onClick={onSubmit}
										width={'w-full'}
										margin={false}
										size={'sm'}
										path={null}
										cta={true}
										conditional={null}
										conditionalDisplay={null}
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
				{/* <LoginImage /> */}
			</section>
		</DefaultLayout>
	);
};

export default ForgotPassword;
