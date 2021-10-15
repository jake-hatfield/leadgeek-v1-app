import React, { useState, useEffect } from 'react';

// packages
import { NavLink, Redirect, useLocation } from 'react-router-dom';

// redux
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import { removeAlert, setAlert } from '@components/features/alert/alertSlice';
import { updatePassword, validateResetPwToken } from '@features/auth/authSlice';

// components
import Button from '@components/utils/Button';
import DefaultLayout from '@components/layout/DefaultLayout';
import PasswordFormField from '@components/utils/PasswordFormField';
import Spinner from '@components/utils/Spinner';

// utils
import { passwordList } from '@utils/utils';

const ResetPasswordPage: React.FC = () => {
	const dispatch = useAppDispatch();
	const location = useLocation();

	// auth selectors
	const status = useAppSelector((state) => state.auth.status);
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const validatedResetPwToken = useAppSelector(
		(state) => state.auth.validatedResetPwToken
	);

	// local state
	const [email, setEmail] = useState(localStorage.getItem('email'));
	const [resetPwToken] = useState<string | null>(
		new URLSearchParams(location.search).get('t')
	);
	const [formData, setFormData] = useState({
		password_1: '',
		password_2: '',
	});

	// destructure necessary items
	const { password_1, password_2 } = formData;

	// check for valid token on page load
	useEffect(() => {
		resetPwToken && dispatch(validateResetPwToken({ resetPwToken }));
	}, [resetPwToken, dispatch]);

	// handle form input change
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleUpdatePassword = (
		email: string,
		password_1: string,
		password_2: string
	) => {
		if (!email) {
			return dispatch(
				setAlert({
					title: 'Required information missing',
					message: '',
					alertType: 'danger',
				})
			);
		}

		// error for empty password
		if (!password_1 || !password_2) {
			return dispatch(
				setAlert({
					title: 'Required field missing',
					message: "Password field can't be empty",
					alertType: 'danger',
				})
			);
		}

		// error for password not matching
		if (password_1 !== password_2) {
			return dispatch(
				setAlert({
					title: "Passwords don't match",
					message: 'Check spelling or case sensitivity',
					alertType: 'danger',
				})
			);
		}

		// error for password too short
		if (password_1.length < 7) {
			return dispatch(
				setAlert({
					title: 'Password is too short',
					message: 'Password must be at least 7 characters',
					alertType: 'danger',
				})
			);
		}

		// error for if password contains email string
		const stringBeforeAt = (string: string) => {
			let splitString = string.split('@');
			return splitString[0];
		};
		let emailBeforeAt = stringBeforeAt(email);
		if (password_1.includes(emailBeforeAt)) {
			return dispatch(
				setAlert({
					title: 'Password is too similar to your email',
					message: 'Please choose another password',
					alertType: 'danger',
				})
			);
		}

		// error for if password is from a list of common passwords
		if (passwordList.includes(password_1)) {
			return dispatch(
				setAlert({
					title: 'Password is too common',
					message: 'Please pick a more unique password',
					alertType: 'danger',
				})
			);
		} else {
			dispatch(removeAlert());
			// password passes, update in DB
			const password = password_1;
			return dispatch(updatePassword({ email, password, redirect: true }));
		}
	};

	// if user is authenticated, redirect to app
	if (isAuthenticated) {
		return <Redirect to='/' />;
	}

	return status === 'idle' ? (
		<DefaultLayout>
			{resetPwToken && validatedResetPwToken ? (
				<section className={classes.content}>
					<article className={classes.card}>
						<header className='pb-4 border-b border-gray-200'>
							<h1 className={classes.title}>Reset Password</h1>
						</header>
						<form className='card-padding-x'>
							<PasswordFormField
								label='New Password'
								placeholder='Create a new password'
								name='password_1'
								value={password_1}
								onChange={(e) => onChange(e)}
								required={true}
								styles={null}
								lightOnly={true}
							/>
							<PasswordFormField
								label='Confirm Password'
								placeholder='Enter the password again'
								name='password_2'
								value={password_2}
								onChange={(e) => onChange(e)}
								required={true}
								styles={null}
								lightOnly={true}
							/>
						</form>
						<div className='mt-4 card-padding-x'>
							<Button
								text={'Reset password'}
								onClick={() => {
									setEmail(localStorage.getItem('email'));
									email && handleUpdatePassword(email, password_1, password_2);
								}}
								width={'w-full'}
								margin={false}
								size={'sm'}
								cta={true}
								path={null}
								conditional={null}
								conditionalDisplay={null}
								lightOnly={true}
							/>
						</div>
					</article>
				</section>
			) : (
				<section className={classes.content}>
					<article className={classes.card}>
						<header className='pb-4 border-b border-gray-200'>
							<h1 className={classes.title}>Uh-oh!</h1>
						</header>
						<div className='mt-4 card-padding-x'>
							Your password could not be reset. Please request a{' '}
							<NavLink to='/reset/forgot-password/' className={'link-light'}>
								new password reset link
							</NavLink>{' '}
							or{' '}
							<a href='https://leadgeek.io/contact/' className={'link-light'}>
								contact support
							</a>
							.
							<NavLink
								to='/login'
								className='block bg-purple-500 mt-4 py-2 w-full rounded-md text-white text-center shadow-md hover:bg-purple-600 transition-colors-main ring-purple'
							>
								Return to log in
							</NavLink>
						</div>
					</article>
				</section>
			)}
		</DefaultLayout>
	) : (
		<Spinner
			divWidth={null}
			center={true}
			spinnerWidth={null}
			margin={false}
			text={null}
		/>
	);
};

const classes = {
	card: 'max-w-md w-full mt-12 md:mt-0 mx-auto card-200 card-padding-y bg-white',
	content: 'h-full w-full md:flex md:flex-col md:justify-center container',
	title: 'card-padding-x font-bold text-xl text-gray-900',
};

export default ResetPasswordPage;
