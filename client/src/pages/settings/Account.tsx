import React, { useState } from 'react';

// redux
import { useAppDispatch, useAppSelector, useDarkMode } from '@hooks/hooks';
import { removeAlert, setAlert } from '@features/alert/alertSlice';
import { updatePassword } from '@components/features/auth/authSlice';

// components
import AuthLayout from '@components/layout/AuthLayout';
import Button from '@components/utils/Button';
import PasswordFormField from '@components/utils/PasswordFormField';
import SettingsLayout from '@components/layout/SettingsLayout';
import Spinner from '@components/utils/Spinner';
import Toggle from '@components/utils/Toggle';

// utils
import { passwordList } from '@utils/utils';

const AccountPage = () => {
	const dispatch = useAppDispatch();

	// auth state
	const status = useAppSelector((state) => state.auth.status);
	const user = useAppSelector((state) => state.auth.user);

	// color theme
	const [colorTheme, setTheme] = useDarkMode();

	// local state
	const [formData, setFormData] = useState({
		password_1: '',
		password_2: '',
	});

	// destructure necessary items
	const { password_1, password_2 } = formData;

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
			return;
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
		if (password_1.length < 7 && password_2.length < 7) {
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
		if (
			password_1.includes(emailBeforeAt) ||
			password_2.includes(emailBeforeAt)
		) {
			return dispatch(
				setAlert({
					title: 'Password is too similar to your email',
					message: 'Please choose another password',
					alertType: 'danger',
				})
			);
		}

		// error for if password is from a list of common passwords
		if (
			passwordList.includes(password_1) ||
			passwordList.includes(password_2)
		) {
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
			return dispatch(updatePassword({ email, password, redirect: false }));
		}
	};

	const onToggle = () => {
		localStorage.setItem('theme', colorTheme);
		setTheme(colorTheme);
	};

	return (
		user && (
			<AuthLayout>
				<SettingsLayout
					title={'Account'}
					description={'Change your account preferences'}
				>
					<section>
						{status === 'loading' ? (
							<Spinner
								divWidth={null}
								center={false}
								spinnerWidth={'sm'}
								margin={false}
								text={null}
							/>
						) : (
							<>
								{/* <div className='mt-4 pt-2 md:pt-4 lg:pt-6 cs-light-300 card-200'>
									<div className='pb-4 border-b border-200'>
										<header className='card-padding-x'>
											<h2 className='font-bold text-lg text-300'>Profile</h2>
										</header>
									</div>
									<div className='flex items-center card-padding-x'>
										<FormField
											label={'Name'}
											type={'text'}
											name={'name'}
											placeholder={user.name}
											value={user.name}
											required={true}
											styles={'w-1/2'}
										/>
										<FormField
											label={'Email'}
											type={'email'}
											name={'email'}
											placeholder={user.email}
											value={user.email}
											required={true}
											styles={'w-1/2 ml-16'}
										/>
									</div>
									<div className='flex justify-end mt-4 py-2 card-padding-x cs-bg rounded-b-lg border-t border-300'>
										<Button
											text={'Save'}
											onClick={() => alert('hello')}
											width={null}
											margin={false}
											size={'sm'}
											cta={true}
											path={null}
											conditional={null}
											conditionalDisplay={null}
										/>
									</div>
								</div> */}
								<article className='mt-4 pt-2 md:pt-4 lg:pt-6 cs-light-300 card-200'>
									<div className='pb-4 border-b border-200'>
										<header className='card-padding-x'>
											<h2 className='font-bold text-lg text-300'>Security</h2>
										</header>
									</div>
									<form className='flex items-center card-padding-x'>
										<PasswordFormField
											label='New Password'
											placeholder='Create a new password'
											name='password_1'
											value={password_1}
											onChange={(e) => onChange(e)}
											required={true}
											styles={'w-1/2'}
										/>
										<PasswordFormField
											label='Confirm Password'
											placeholder='Enter the password again'
											name='password_2'
											value={password_2}
											onChange={(e) => onChange(e)}
											required={true}
											styles={'w-1/2 ml-16'}
										/>
									</form>
									<div className='flex justify-end mt-4 py-2 card-padding-x cs-bg rounded-b-lg border-t border-300'>
										<Button
											text={'Save'}
											onClick={() =>
												user?.email &&
												handleUpdatePassword(
													user?.email,
													password_1,
													password_2
												)
											}
											width={null}
											margin={false}
											size={'sm'}
											cta={true}
											path={null}
											conditional={null}
											conditionalDisplay={null}
										/>
									</div>
								</article>
								<article className='mt-4 py-2 md:py-4 lg:py-6 cs-light-300 card-200'>
									<div className='pb-4 border-b border-200'>
										<header className='card-padding-x'>
											<h2 className='font-bold text-lg text-300'>Appearance</h2>
										</header>
									</div>
									<div className='mt-4 card-padding-x'>
										<div className='center-between text-200'>
											<div>Theme</div>
											<Toggle
												itemLeft={
													<span aria-label='light'>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='svg-base'
															fill='none'
															viewBox='0 0 24 24'
															stroke='currentColor'
														>
															<path
																strokeLinecap='round'
																strokeLinejoin='round'
																strokeWidth={2}
																d='M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z'
															/>
														</svg>
													</span>
												}
												itemRight={
													<span aria-label='dark'>
														<svg
															xmlns='http://www.w3.org/2000/svg'
															className='svg-base'
															viewBox='0 0 20 20'
															fill='currentColor'
														>
															<path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
														</svg>
													</span>
												}
												onChange={onToggle}
												defaultChecked={colorTheme === 'dark' ? false : true}
											/>
										</div>
									</div>
								</article>
							</>
						)}
					</section>
				</SettingsLayout>
			</AuthLayout>
		)
	);
};

export default AccountPage;
