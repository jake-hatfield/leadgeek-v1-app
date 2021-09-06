import React, { useState, useEffect } from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updatePassword } from '@features/auth/authSlice';
import { setAlert } from '@features/alert/alertSlice';

import FormField from '@components/layout/utils/FormField';
import { ReactComponent as Check } from '@assets/images/svgs/check.svg';
import { ReactComponent as X } from '@assets/images/svgs/x.svg';

const ResetPassword = ({
	loading,
	email,
	fullWidthButton,
	updatePassword,
	setAlert,
}) => {
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

	// reset password validation
	// export const resetPwValidation = (resetPwToken) => async (dispatch) => {
	// 	const body = JSON.stringify({ resetPwToken });
	// 	try {
	// 		dispatch({
	// 			type: CHECK_RESET_PASSWORD_TOKEN,
	// 		});
	// 		const res = await axios.post(
	// 			'/api/users/reset-password-validation',
	// 			body,
	// 			config
	// 		);
	// 		if (res.data.message === 'Password reset link was validated') {
	// 			dispatch({
	// 				type: SET_RESET_PASSWORD_TOKEN,
	// 				payload: res.data.user,
	// 			});
	// 		} else {
	// 			return dispatch(
	// 				setAlert(
	// 					'Error resetting password',
	// 					"Your password couldn't be reset. Please request a new email link or contact support.",
	// 					'danger'
	// 				)
	// 			);
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	// update password x
	// export const updatePassword = (email, password) => async (dispatch) => {
	// 	const emailToLowerCase = email.toLowerCase();
	// 	console.log(emailToLowerCase);
	// 	const body = JSON.stringify({ email: emailToLowerCase, password });
	// 	try {
	// 		axios.put('/api/users/update-password', body, config).then((res) => {
	// 			if (res.data === 'Password was successfully updated') {
	// 				dispatch(
	// 					setAlert(
	// 						'Reset success',
	// 						'Your password was successfully updated.',
	// 						'success'
	// 					)
	// 				);
	// 				dispatch({ type: REMOVE_RESET_PASSWORD_TOKEN });
	// 				dispatch(login(email, password));
	// 				dispatch({ type: LOGIN_SUCCESS });
	// 				localStorage.removeItem('resetPwToken');
	// 			} else {
	// 				dispatch(
	// 					setAlert(
	// 						'Error resetting password',
	// 						"Your password couldn't be updated. Please contact support.",
	// 						'danger'
	// 					)
	// 				);
	// 			}
	// 			return;
	// 		});
	// 	} catch (error) {
	// 		const errors = error.response.data.errors;
	// 		if (errors) {
	// 			errors.forEach((error) => dispatch(setAlert(error.message, 'danger')));
	// 		}
	// 	}
	// };

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
	const onChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const passwordList = [
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
	const [terriblePasswords] = useState(passwordList);
	useEffect(() => {
		if (password_1 || password_2) {
			setCommonPasswordValidated(false);
			const stringBeforeAt = (string) => {
				let splitString = string.split('@');
				return splitString[0];
			};
			let emailBeforeAt = stringBeforeAt(email);
			if (password_1.length >= 7 && password_2.length >= 7) {
				setLengthValidated(true);
				if (
					password_1.includes(emailBeforeAt) ||
					password_2.includes(emailBeforeAt)
				) {
					setEmailValidated(false);
					setAlert(
						'Something went wrong',
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
						'Something went wrong',
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
	}, [password_1, password_2, terriblePasswords, setAlert, email]);
	const handleUpdatePassword = (e) => {
		e.preventDefault();
		if (!password_1 || !password_2) {
			setAlert(
				'Please enter a password',
				"The password field can't be empty. Please enter a password and try again.",
				'danger'
			);
			return;
		}
		if (password_1 !== password_2) {
			setAlert(
				"The passwords don't match",
				"The passwords don't match up. Please check spelling or case sensitivity and try again.",
				'danger'
			);
			return;
		} else {
			if (!lengthValidated) {
				setAlert(
					'The password is too short',
					'The password needs to be at least 7 characters.',
					'danger'
				);
				return;
			} else {
				const password = password_1;
				updatePassword(email, password);
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
	return (
		!loading && (
			<article className='pt-2'>
				<header>
					<div className='inline-block'>
						In order to protect your account, please make sure your password:
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
					/>
					<FormField
						label='Confirm Password'
						type='password'
						placeholder='Enter the password again'
						name='password_2'
						onChange={(e) => onChange(e)}
						minLength={7}
					/>
					<button
						type='submit'
						className={`mt-4 py-2 px-4 ${
							fullWidthButton && 'w-full'
						} rounded-md text-white shadow-md bg-purple-500 hover:bg-purple-600 transition-colors duration-200 focus:outline-none focus:shadow-outline`}
					>
						Reset password
					</button>
				</form>
			</article>
		)
	);
};

ResetPassword.propTypes = {
	loading: PropTypes.bool.isRequired,
	email: PropTypes.string.isRequired,
	fullWidthButton: PropTypes.bool,
	updatePassword: PropTypes.func.isRequired,
	setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
	const { setAlert } = state.alert;
	const { loading, email, fullWidthButton } = ownProps;
	return { loading, email, fullWidthButton, setAlert };
};

export default connect(mapStateToProps, {
	updatePassword,
	setAlert,
})(ResetPassword);
