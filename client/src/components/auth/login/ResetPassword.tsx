import React, { useState, useEffect } from 'react';

// redux
import { useAppDispatch, useAppSelector } from '@hooks/hooks';

// components
import PasswordFormField from '@components/utils/PasswordFormField';

// utils
import { passwordList, handleUpdatePassword } from '@utils/utils';

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
	const user = useAppSelector((state) => state.auth.user);

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

	// handle form submit
	const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		user?.email && handleUpdatePassword(e, user?.email, password_1, password_2);
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
