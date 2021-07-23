import React from 'react';

import PropTypes from 'prop-types';

const FormField = ({
	padding,
	label,
	type,
	name,
	placeholder,
	required,
	onChange,
	disabled,
}) => {
	return (
		<div className={`${padding || 'pt-4 mt-1'} flex-col items-center`}>
			<label htmlFor={name} className='form-field-label'>
				{label}
			</label>
			<div>
				<input
					name={name}
					type={type}
					placeholder={placeholder}
					required={required}
					onChange={onChange}
					disabled={disabled}
					className={`${
						disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent'
					} form-field`}
				/>
			</div>
		</div>
	);
};

FormField.propTypes = {
	padding: PropTypes.string,
	label: PropTypes.string,
	type: PropTypes.string.isRequired,
	name: PropTypes.string,
	placeholder: PropTypes.string,
	required: PropTypes.bool,
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
};

export default FormField;
