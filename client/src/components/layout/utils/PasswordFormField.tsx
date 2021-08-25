import React, { useState } from 'react';

import { ReactComponent as EyeOpen } from '@assets/images/svgs/eye-open.svg';
import { ReactComponent as EyeClosed } from '@assets/images/svgs/eye-closed.svg';

interface PasswordFormFieldProps {
	label: string;
	placeholder: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required: boolean;
	styles: string | null;
}

const PasswordFormField: React.FC<PasswordFormFieldProps> = ({
	label,
	placeholder,
	value,
	onChange,
	required,
	styles,
}) => {
	const [passwordShown, setPasswordShown] = useState(false);
	const togglePasswordVisibility = () => {
		setPasswordShown(passwordShown ? false : true);
	};
	return (
		<div className={`pt-4 ${styles ? styles : ''} flex-col items-center`}>
			<label htmlFor='password' className='form-field-label'>
				{label}
			</label>
			<div className='relative'>
				<input
					id={'password'}
					name='password'
					type={passwordShown ? 'text' : 'password'}
					value={value}
					placeholder={placeholder}
					required={required}
					onChange={onChange}
					className='mt-1 form-field'
				/>
				<button
					onClick={togglePasswordVisibility}
					type='button'
					className='mt-3 mr-2 absolute right-0 rounded-md text-gray-400 focus:outline-none focus:shadow-outline'
				>
					{passwordShown ? (
						<EyeClosed className='mt-1 h-4' />
					) : (
						<EyeOpen className='mt-1 h-4' />
					)}
				</button>
			</div>
		</div>
	);
};

export default PasswordFormField;
