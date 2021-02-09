import React from 'react';

const FormField = ({
	padding,
	label,
	labelSize,
	type,
	name,
	placeholder,
	required,
	onChange,
	disabled,
}) => {
	return (
		<div className={`${padding || 'pt-4'} flex-col items-center`}>
			<label
				htmlFor={name}
				className={`block ${labelSize || 'text-sm'} font-medium text-gray-700`}
			>
				{label}
			</label>
			<div className='mt-1'>
				<input
					name={name}
					type={type}
					placeholder={placeholder}
					required={required}
					onChange={onChange}
					disabled={disabled}
					className={`${
						disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'
					} p-2 w-full rounded-md  text-sm border border-gray-200 shadow-xs placeholder-gray-300 focus:outline-none focus:shadow-outline`}
				/>
			</div>
		</div>
	);
};

export default FormField;
