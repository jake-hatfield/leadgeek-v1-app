import React, { useState } from 'react';

import { ReactComponent as EyeOpen } from 'assets/images/svgs/eye-open.svg';
import { ReactComponent as EyeClosed } from 'assets/images/svgs/eye-closed.svg';

const PasswordFormField = ({
	label,
	placeholder,
	onChange,
	required,
	width,
}) => {
	const [passwordShown, setPasswordShown] = useState(false);
	const togglePasswordVisibility = () => {
		setPasswordShown(passwordShown ? false : true);
	};
	return (
		<div className={`pt-4 ${width} flex-col items-center`}>
			<label htmlFor='password' className='form-field-label'>
				{label}
			</label>
			<div className='relative'>
				<input
					name='password'
					type={passwordShown ? 'text' : 'password'}
					placeholder={placeholder}
					required={required}
					onChange={onChange}
					className='form-field'
				/>
				<button
					onClick={togglePasswordVisibility}
					type='button'
					className='mt-4 mr-2 absolute right-0 rounded-md text-gray-400 ring-purple'
				>
					{passwordShown ? (
						<EyeClosed className='h-4' />
					) : (
						<EyeOpen className='h-4' />
					)}
				</button>
			</div>
		</div>
	);
};

export default PasswordFormField;
