import React from 'react';

import PropTypes from 'prop-types';

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
					} p-2 w-full rounded-md text-sm border border-gray-200 hover:shadow-sm placeholder-gray-300 ring-purple`}
				/>
			</div>
		</div>
	);
};

FormField.propTypes = {
	padding: PropTypes.string,
	label: PropTypes.string,
	labelSize: PropTypes.string,
	type: PropTypes.string.isRequired,
	name: PropTypes.string,
	placeholder: PropTypes.string,
	required: PropTypes.bool,
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
};

export default FormField;
