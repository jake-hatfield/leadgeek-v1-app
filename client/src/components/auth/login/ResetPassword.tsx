import React, { useState, useEffect } from 'react';

// redux
import { useAppDispatch, useAppSelector } from '@hooks/hooks';
import { updatePassword } from '@features/auth/authSlice';
import { setAlert } from '@features/alert/alertSlice';

// components
import PasswordFormField from '@components/utils/PasswordFormField';

// utils
import { passwordList } from '@utils/utils';

interface ResetPasswordProps {
	email: string;
	flex: boolean;
	fullWidthButton: boolean;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({
	email,
	flex,
	fullWidthButton,
}) => {
	const dispatch = useAppDispatch();

	// auth state
	const authStatus = useAppSelector((state) => state.auth.status);

	// local state
	const [commonPasswordValidated, setCommonPasswordValidated] = useState(false);
	const [emailValidated, setEmailValidated] = useState(false);
	const [formData, setFormData] = useState({
		password_1: '',
		password_2: '',
	});
	const [lengthValidated, setLengthValidated] = useState(false);
	const [terriblePasswords] = useState(passwordList);

	// destructure necessary items
	const { password_1, password_2 } = formData;

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

	// handle form input change
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		if (password_1 || password_2) {
			setCommonPasswordValidated(false);
			const stringBeforeAt = (string: string) => {
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
					setAlert({
						title: 'Something went wrong',
						message:
							'The password is too similar to your email. Please choose another password.',
						alertType: 'danger',
					});
				} else if (
					!terriblePasswords.includes(password_1) ||
					!terriblePasswords.includes(password_2)
				) {
					setCommonPasswordValidated(true);
				} else {
					setCommonPasswordValidated(false);
					setAlert({
						title: 'Something went wrong',
						message:
							'The provided password is too common. Please pick a more unique password.',
						alertType: 'danger',
					});
				}
			} else {
				setEmailValidated(true);
			}
			if (password_1.length < 7 || password_2.length < 7) {
				return setLengthValidated(false);
			}
		}
	}, [password_1, password_2, terriblePasswords, email]);

	const handleUpdatePassword = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// error for empty password
		if (!password_1 || !password_2) {
			return setAlert({
				title: 'Please enter a password',
				message:
					"The password field can't be empty. Please enter a password and try again.",
				alertType: 'danger',
			});
		}
		// error for password not matching
		if (password_1 !== password_2) {
			return setAlert({
				title: "The passwords don't match",
				message:
					"The passwords don't match up. Please check spelling or case sensitivity and try again.",
				alertType: 'danger',
			});
		} else {
			// error for password too short
			if (!lengthValidated) {
				return setAlert({
					title: 'The password is too short',
					message: 'The password needs to be at least 7 characters.',
					alertType: 'danger',
				});
			} else {
				// password passes, update in DB
				const password = password_1;
				return updatePassword({ email, password });
			}
		}
	};

	// handle form submit
	const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (lengthValidated && emailValidated && commonPasswordValidated) {
			handleUpdatePassword(e);
		}
	};

	return authStatus === 'idle' ? (
		<form
			onSubmit={(e) => onFormSubmit(e)}
			className={flex ? 'flex items-center' : ''}
		>
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
	) : (
		<div />
	);
};

export default ResetPassword;
