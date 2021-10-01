import React, { useState } from 'react';

// packages
import axios from 'axios';
import { NavLink } from 'react-router-dom';

// redux
import { useAppDispatch } from '@hooks/hooks';
import { setAlert } from '@features/alert/alertSlice';

// components
import Button from '@components/utils/Button';
import DefaultFooter from '@components/layout/navigation/DefaultFooter';
import DefaultLayout from '@components/layout/DefaultLayout';
import FormField from '@components/utils/FormField';
import { ReactComponent as LeadGeekLogo } from '@assets/images/svgs/logo-app.svg';

// utils
import { setResetPwToken } from '@utils/authTokens';
import { config } from '@utils/utils';

const ForgotPassword: React.FC = () => {
	const dispatch = useAppDispatch();

	// local state
	const [formData, setFormData] = useState({
		email: '',
	});

	// destructure necessary items
	const { email } = formData;

	// on form input change
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
		setFormData({ ...formData, [e.target.name]: e.target.value });

	// forgot password handler
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
							title: 'Success',
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
						title: 'Success',
						message: `An email has been sent to ${email} if an account is associated.`,
						alertType: 'success',
					})
				);
			} else {
				dispatch(
					setAlert({
						title: 'Error sending email',
						message: 'Please contact support',
						alertType: 'danger',
					})
				);
			}
		}
	};

	// submit handler
	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// error for empty email
		if (email === '') {
			dispatch(
				setAlert({
					title: 'Required field missing',
					message: 'Please enter your email',
					alertType: 'danger',
				})
			);
		} else {
			forgotPassword(email);
		}
	};
	return (
		<DefaultLayout>
			<section className={classes.content}>
				<article className='mt-12 md:mt-0 mx-auto w-full max-w-md card-300 bg-white card-padding-y'>
					<header className='pb-4 border-b border-gray-200'>
						<h1 className='card-padding-x font-bold text-xl text-gray-900'>
							Reset password
						</h1>
					</header>
					<div className='card-padding-x'>
						<div className='mt-4'>
							<p className='inline-block'>
								Don't worry, it happens to the best of us.
							</p>
							<p className='mt-2 inline-block'>
								Receive password reset instructions to the email below.
							</p>
						</div>
						<form onSubmit={(e) => onSubmit(e)}>
							<FormField
								label='Email'
								type='email'
								placeholder='dsaunders@gmail.com'
								name='email'
								value={email}
								onChange={onChange}
								required={true}
								styles={null}
								lightOnly={true}
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
									lightOnly={true}
								/>
							</div>
							<div className='mt-4 text-sm text-gray-400'>
								<NavLink exact to={'/login'} className='link-light'>
									Back to log in
								</NavLink>
							</div>
						</form>
					</div>
				</article>
			</section>
		</DefaultLayout>
	);
};

const classes = {
	card: 'max-w-md w-full mt-12 md:mt-0 mx-auto card-200 card-padding-y bg-white',
	content: 'h-full w-full md:flex md:flex-col md:justify-center container',
	contentHeader: 'mt-8 hidden md:block container',
	logoLg: 'default-logo-lg text-purple-500',
	logoSm: 'default-logo-sm',
	signup: 'flex items-center mt-4 card-padding-x text-sm',
	subheaderLink: 'block md:inline-block ml-2 link',
	title: 'card-padding-x font-bold text-xl text-gray-900',
};

export default ForgotPassword;
