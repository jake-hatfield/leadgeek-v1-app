import React, { useState } from 'react';

import { ReactComponent as EyeOpen } from '@assets/images/svgs/eye-open.svg';
import { ReactComponent as EyeClosed } from '@assets/images/svgs/eye-closed.svg';

interface PasswordFormFieldProps {
	label: string;
	placeholder: string;
	name: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required: boolean;
	styles: string | null;
	lightOnly?: boolean;
}

const PasswordFormField: React.FC<PasswordFormFieldProps> = ({
	label,
	placeholder,
	name,
	value,
	onChange,
	required,
	styles,
	lightOnly,
}) => {
	const [passwordShown, setPasswordShown] = useState(false);
	const togglePasswordVisibility = () => {
		setPasswordShown(passwordShown ? false : true);
	};
	return (
		<div className={`pt-4 ${styles ? styles : ''} flex-col items-center`}>
			<label
				htmlFor={name}
				className={lightOnly ? 'form-field-label-light' : 'form-field-label'}
			>
				{label}
			</label>
			<div className='relative'>
				<input
					id={name}
					name={name}
					type={passwordShown ? 'text' : 'password'}
					value={value}
					placeholder={placeholder}
					required={required}
					onChange={onChange}
					className={`mt-1 ${lightOnly ? 'form-field-light' : 'form-field'}`}
				/>
				<button
					onClick={togglePasswordVisibility}
					type='button'
					className='mt-3 mr-4 absolute right-0 rounded-md text-gray-400 focus:outline-none focus:shadow-outline'
				>
					{passwordShown ? (
						<EyeClosed className='mt-2 h-4' />
					) : (
						<EyeOpen className='mt-2 h-4' />
					)}
				</button>
			</div>
		</div>
	);
};

export default PasswordFormField;
