import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Redirect, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import {
	resetPasswordValidation,
	updatePassword,
} from '../../../../redux/actions/auth';
import { setAlert } from '../../../../redux/actions/alert';
import FormField from '../../formField/FormField';
import LoginImage from '../LoginImage';
import { ReactComponent as LeadGeekLogo } from '../../../../assets/images/svgs/leadgeek-logo-light.svg';
import { ReactComponent as Check } from '../../../../assets/images/svgs/check.svg';
import { ReactComponent as X } from '../../../../assets/images/svgs/x.svg';

const ResetPassword = ({
	auth: { isAuthenticated, user, loading, validatedResetPasswordToken },
	resetPasswordValidation,
	updatePassword,
	setAlert,
}) => {
	const resetPasswordToken = localStorage.resetPasswordToken;
	// check for valid token
	useEffect(() => {
		resetPasswordValidation(resetPasswordToken);
	}, [resetPasswordToken, resetPasswordValidation]);
	const [formData, setFormData] = useState({
		password_1: '',
		password_2: '',
	});
	const { password_1, password_2 } = formData;
	const [lengthValidated, setLengthValidated] = useState(false);
	const [emailValidated, setEmailValidated] = useState(false);
	const [commonPasswordValidated, setCommonPasswordValidated] = useState(false);
	const checkSyles =
		'inline-block h-4 w-4 text-teal-500 bg-teal-200 rounded-full';
	const xStyles = 'inline-block h-4 w-4 text-red-500 bg-red-200 rounded-full';
	const securityMeasureBullets = [
		{
			svg: (
				<span>
					{lengthValidated ? (
						<Check className={checkSyles} />
					) : (
						<X className={xStyles} />
					)}
				</span>
			),
			content: 'Is 7 characters or longer',
		},
		{
			svg: (
				<span>
					{emailValidated ? (
						<Check className={checkSyles} />
					) : (
						<X className={xStyles} />
					)}
				</span>
			),
			content: `Does not match or significantly contain your email, e.g. don't use "email123"`,
		},
		{
			svg: (
				<span>
					{commonPasswordValidated ? (
						<Check className={checkSyles} />
					) : (
						<X className={xStyles} />
					)}
				</span>
			),
			content: (
				<span>
					Is not a member of this{' '}
					<a
						href='https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10k-most-common.txt'
						target='_blank'
						rel='noopener noreferrer'
						className='link'
					>
						list of common passwords
					</a>
				</span>
			),
		},
	];
	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const terriblePasswords = [
		'123456',
		'password',
		'12345678',
		'qwerty',
		'123456789',
		'12345',
		'1234',
		'111111',
		'1234567',
		'dragon',
		'123123',
		'baseball',
		'abc123',
		'football',
		'monkey',
		'letmein',
		'696969',
		'shadow',
		'master',
		'666666',
		'qwertyuiop',
		'123321',
		'mustang',
		'1234567890',
		'michael',
		'654321',
		'pussy',
		'superman',
		'1qaz2wsx',
		'7777777',
		'fuckyou',
		'121212',
		'000000',
		'qazwsx',
		'123qwe',
		'killer',
		'trustno1',
		'jordan',
		'jennifer',
		'zxcvbnm',
		'asdfgh',
		'hunter',
		'buster',
		'soccer',
		'harley',
		'batman',
		'andrew',
		'tigger',
		'sunshine',
		'iloveyou',
		'fuckme',
		'2000',
		'charlie',
		'robert',
		'thomas',
		'hockey',
		'ranger',
		'daniel',
		'starwars',
		'klaster',
		'112233',
		'george',
		'asshole',
		'computer',
		'michelle',
		'jessica',
		'pepper',
		'1111',
		'zxcvbn',
		'555555',
		'11111111',
		'131313',
		'freedom',
		'777777',
		'pass',
		'fuck',
		'maggie',
		'159753',
		'aaaaaa',
		'ginger',
		'princess',
		'joshua',
		'cheese',
		'amanda',
		'summer',
		'love',
		'ashley',
		'6969',
		'nicole',
		'chelsea',
		'biteme',
		'matthew',
		'access',
		'yankees',
		'987654321',
		'dallas',
		'austin',
		'thunder',
		'taylor',
		'matrix',
		'minecraft',
	];
	useEffect(() => {
		if (password_1 || password_2) {
			setCommonPasswordValidated(false);
			const stringBeforeAt = (string) => {
				let splitString = string.split('@');
				return splitString[0];
			};
			let emailBeforeAt = stringBeforeAt(user.email);
			if (password_1.length >= 7 && password_2.length >= 7) {
				setLengthValidated(true);
				if (
					password_1.includes(emailBeforeAt) ||
					password_2.includes(emailBeforeAt)
				) {
					setEmailValidated(false);
					setAlert(
						'The password is too similar to your email. Please choose another password.',
						'danger'
					);
				} else if (
					!terriblePasswords.includes(password_1) ||
					!terriblePasswords.includes(password_2)
				) {
					setCommonPasswordValidated(true);
				} else {
					setCommonPasswordValidated(false);
					setAlert(
						'The provided password is too common. Please pick a more unique password.',
						'danger'
					);
				}
			} else {
				setEmailValidated(true);
			}
			if (password_1.length < 7 || password_2.length < 7) {
				setLengthValidated(false);
				return;
			}
		}
	}, [password_1, password_2]);
	const handleUpdatePassword = (e) => {
		e.preventDefault();
		if (!password_1 || !password_2) {
			setAlert('Please enter a password.', 'danger');
			return;
		}
		if (password_1 !== password_2) {
			setAlert("The passwords don't match. Please try again.", 'danger');
			return;
		} else {
			if (!lengthValidated) {
				setAlert('The password needs to be at least 7 characters.', 'danger');
				return;
			} else {
				const password = password_1;
				updatePassword(user.email, password);
				return;
			}
		}
	};
	const onSubmit = (e) => {
		e.preventDefault();
		if (setLengthValidated && setEmailValidated && setCommonPasswordValidated) {
			handleUpdatePassword(e);
		}
	};
	if (isAuthenticated) {
		return <Redirect to='/' />;
	}
	return (
		<Fragment>
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
								<header>
									<LeadGeekLogo className='md:hidden w-16' />
									<h1 className='text-2xl md:text-3xl lg:text-4xl font-black text-gray-900'>
										Change password
									</h1>
									<div className='inline-block'>
										In order to protect your account, please make sure your
										password:
										<ul className='mt-4'>
											{securityMeasureBullets.map((bullet, i) => (
												<li key={i} className='mt-1 flex'>
													<span>{bullet.svg}</span>
													<span className='ml-2'>{bullet.content}</span>
												</li>
											))}
										</ul>
									</div>
								</header>
								<form className='my-3' onSubmit={(e) => onSubmit(e)}>
									<FormField
										label='New Password'
										type='password'
										placeholder='Create a new password'
										name='password_1'
										onChange={(e) => onChange(e)}
										minLength={7}
										// required
									/>
									<FormField
										label='Confirm Password'
										type='password'
										placeholder='Enter the password again'
										name='password_2'
										onChange={(e) => onChange(e)}
										minLength={7}
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
		</Fragment>
	);
};

ResetPassword.propTypes = {
	auth: PropTypes.object.isRequired,
	resetPasswordValidation: PropTypes.func.isRequired,
	updatePassword: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
	setAlert: state.alert,
});

export default connect(mapStateToProps, {
	resetPasswordValidation,
	updatePassword,
	setAlert,
})(ResetPassword);
