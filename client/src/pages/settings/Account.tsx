import React, { useState } from 'react';

// packages
import axios from 'axios';

// redux
import { useAppDispatch, useAppSelector, useDarkMode } from '@hooks/hooks';
import { removeAlert, setAlert } from '@features/alert/alertSlice';
import {
	getUserData,
	updatePassword,
} from '@components/features/auth/authSlice';

// components
import AuthLayout from '@components/layout/AuthLayout';
import Button from '@components/utils/Button';
import FormField from '@components/utils/FormField';
import PasswordFormField from '@components/utils/PasswordFormField';
import SettingsItem from '@components/utils/SettingsItem';
import SettingsLayout from '@components/layout/SettingsLayout';
import Spinner from '@components/utils/Spinner';
import Toggle from '@components/utils/Toggle';

// utils
import { config, passwordList } from '@utils/utils';

const AccountPage = () => {
	const dispatch = useAppDispatch();

	const { status, user } = useAppSelector((state) => ({
		status: state.auth.status,
		user: state.auth.user,
	}));

	// color theme
	const [colorTheme, setTheme] = useDarkMode();

	// local state
	const [formData, setFormData] = useState({
		name: user?.name || '',
		password_1: '',
		password_2: '',
	});

	// destructure necessary items
	const { password_1, password_2 } = formData;

	// handle form input change
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleUpdateProfile = async () => {
		if (!formData.name) {
			return dispatch(
				setAlert({
					title: 'Required field missing',
					message: "Name field can't be empty",
					alertType: 'danger',
				})
			);
		}

		if (formData.name === user?.name) {
			return dispatch(
				setAlert({
					title: 'Error updating name',
					message: 'The current and updated name are the same',
					alertType: 'warning',
				})
			);
		}

		const body = JSON.stringify({ name: formData.name });

		const { data } = await axios.put<{
			message:
				| 'Profile was successfully updated'
				| 'No user exists in the database to update';
		}>('/api/auth/profile', body, config);

		if (data.message === 'Profile was successfully updated') {
			dispatch(
				setAlert({
					title: 'Update success',
					message: 'Your profile was successfully updated',
					alertType: 'success',
				})
			);
			return dispatch(getUserData());
		} else {
			return dispatch(
				setAlert({
					title: 'Error updating profile',
					message: 'Please contact support',
					alertType: 'danger',
				})
			);
		}
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
					<section className='my-6'>
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
								<div className='pt-2 md:pt-4 lg:pt-6 cs-light-300 card-200'>
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
											value={formData.name || user.name}
											onChange={(e) => onChange(e)}
											required={true}
											styles={'w-1/2 pt-4'}
										/>
										<div className='w-1/2 ml-16' />
									</div>
									<div className='flex justify-end mt-4 py-2 card-padding-x cs-bg rounded-b-lg border-t border-300'>
										<Button
											text={'Save'}
											onClick={() => handleUpdateProfile()}
											width={null}
											margin={false}
											size={'sm'}
											cta={true}
											path={null}
											conditional={null}
											conditionalDisplay={null}
										/>
									</div>
								</div>
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
									<SettingsItem
										title={'Dark mode'}
										description={'Choose your preferred theme'}
										action={
											<Toggle
												itemLeft={null}
												itemRight={null}
												onChange={onToggle}
												defaultChecked={colorTheme === 'dark' ? false : true}
											/>
										}
									/>
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
