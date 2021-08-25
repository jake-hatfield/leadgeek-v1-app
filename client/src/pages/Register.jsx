import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { register } from '@redux/actions/auth';
import { setAlert } from '@redux/actions/alert';

import DefaultLayout from '@components/layout/DefaultLayout';
import { ReactComponent as LeadGeekLogo } from '@assets/images/svgs/leadgeek-logo-light.svg';

import FormField from '@components/layout/utils/FormField';
import PasswordFormField from '@components/layout/utils/PasswordFormField';
import DefaultFooter from '@components/layout/navigation/DefaultFooter';
import { ReactComponent as Check } from '@assets/images/svgs/check.svg';
import { ReactComponent as X } from '@assets/images/svgs/x.svg';

const Register = ({ isAuthenticated, register, setAlert }) => {
	const [formData, setFormData] = useState({
		fName: '',
		lName: '',
		email: '',
		password: '',
	});

	const [passwordShown, setPasswordShown] = useState(false);
	const togglePasswordVisibility = () => {
		setPasswordShown(passwordShown ? false : true);
	};

	const [lengthValidated, setLengthValidated] = useState(false);
	const [emailValidated, setEmailValidated] = useState(false);
	const [pwEmailValidated, setpwEmailValidated] = useState(false);
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
					{pwEmailValidated ? (
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
						href='https://github.com/danielmiessler/SecLists/blob/master/Passwords/Common-Credentials/10-million-password-list-top-100.txt'
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

	const onChange = (e) =>
		setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
	const { fName, lName, email, password } = formData;

	useEffect(() => {
		if (email) {
			if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
				setAlert(
					'Invalid email address',
					"That doesn't look like a valid email address. Please try again.",
					'danger'
				);
				setEmailValidated(false);
			} else {
				setEmailValidated(true);
			}
		}
		if (password) {
			setCommonPasswordValidated(false);
			const stringBeforeAt = (string) => {
				let splitString = string.split('@');
				return splitString[0];
			};
			if (email) {
				let emailBeforeAt = stringBeforeAt(email);
				if (password.length >= 7) {
					setLengthValidated(true);
					if (password.includes(emailBeforeAt)) {
						setpwEmailValidated(false);
						setAlert(
							'The password is too similar to your email. Please choose another password.',
							'danger'
						);
					} else if (!terriblePasswords.includes(password)) {
						setCommonPasswordValidated(true);
					} else {
						setCommonPasswordValidated(false);
						setAlert(
							'The provided password is too common. Please pick a more unique password.',
							'danger'
						);
					}
				} else {
					setpwEmailValidated(true);
				}
				if (password.length < 7) {
					setLengthValidated(false);
					return;
				}
			} else {
				setAlert('Please enter your email first', 'warning');
			}
		} else {
			setpwEmailValidated(false);
			setLengthValidated(false);
			setCommonPasswordValidated(false);
		}
	}, [password, email, setAlert]);
	const onSubmit = (e) => {
		e.preventDefault();
		const firstNameCapitalized =
			fName.charAt(0).toUpperCase() + fName.substring(1).toLowerCase();
		const lastNameCapitalized =
			lName.charAt(0).toUpperCase() + lName.substring(1).toLowerCase();
		const name = `${firstNameCapitalized} ${lastNameCapitalized}`;
		register(name, email, password);
	};

	if (isAuthenticated) {
		return <Redirect to='/leads' />;
	}
	return (
		<DefaultLayout>
			<section className='min-h-screen relative flex justify-center bg-gray-100'>
				<div className='h-2 absolute z-10 inset-x-0 top-0 bg-purple-300' />
				<div className='flex flex-col justify-between xl:h-screen w-full bg-gray-100'>
					<div className='mt-6 hidden md:block container'>
						<LeadGeekLogo className='inline-block w-16' />
					</div>
					<div className='container'>
						<div className='mt-12 md:mt-0 mx-auto py-4 lg:py-6 px-6 md:px-8 lg:px-12 w-full max-w-md bg-white rounded-md shadow-lg'>
							<header className='pb-2 border-b border-gray-100'>
								<LeadGeekLogo className='md:hidden w-12' />
								<h1 className='text-xl md:text-2xl lg:text-3xl font-black text-gray-900'>
									Create an account
								</h1>
								<h2>{fName}</h2>
							</header>
							<form className='form' onSubmit={(e) => onSubmit(e)}>
								<div className='md:flex justify-between'>
									<FormField
										name='fName'
										label='First name'
										type='text'
										placeholder='Dave'
										value={fName}
										onChange={onChange}
									/>
									<FormField
										name='lName'
										label='Last name'
										type='text'
										placeholder='Saunders'
										value={lName}
										width='md:ml-4'
										onChange={onChange}
									/>
								</div>
								<div className='form-group'>
									<FormField
										name='email'
										label='Email'
										type='email'
										placeholder='dsaunders@gmail.com'
										value={email}
										onChange={(e) => onChange(e)}
									/>
								</div>
								<PasswordFormField
									name='password'
									label='Password'
									placeholder={'Create a new password'}
									value={password}
									onChange={onChange}
									passwordShown={passwordShown}
									toggle={togglePasswordVisibility}
									required
								/>
								<div className='mt-6 text-xs md:text-sm text-gray-600'>
									In order to protect your account, please make sure your
									password:
									<ul className='mt-4'>
										{securityMeasureBullets.map((bullet, i) => (
											<li key={i} className='mt-2 flex'>
												<span>{bullet.svg}</span>
												<span className='ml-2'>{bullet.content}</span>
											</li>
										))}
									</ul>
								</div>
								<button
									disabled={
										!emailValidated ||
										!password ||
										!lengthValidated ||
										!pwEmailValidated ||
										!commonPasswordValidated
									}
									type='submit'
									className='mt-4 py-2 w-full rounded-md font-semibold text-white bg-purple-500 hover:bg-purple-600 shadow-sm hover:shadow-md disabled:bg-gray-200 disabled:text-gray-500 transition-colors duration-100  ease-in-out focus:outline-none focus:shadow-outline'
								>
									Register
								</button>
							</form>
							<p className='mt-4 text-sm'>
								Already have an account?{' '}
								<Link to='/login' className='link'>
									Sign In
								</Link>
							</p>
						</div>
					</div>
					<DefaultFooter />
				</div>
			</section>
		</DefaultLayout>
	);
};

Register.propTypes = {
	isAuthenticated: PropTypes.bool,
	register: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
	isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { register, setAlert })(Register);
