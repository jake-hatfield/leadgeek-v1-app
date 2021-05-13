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
			<label
				htmlFor='password'
				className='block text-sm font-medium text-gray-700'
			>
				{label}
			</label>
			<div className='relative'>
				<input
					name='password'
					type={passwordShown ? 'text' : 'password'}
					placeholder={placeholder}
					required={required}
					onChange={onChange}
					className='mt-1 p-2 w-full rounded-md  text-sm border border-gray-100 shadow-xs placeholder-gray-300 ring-purple'
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
