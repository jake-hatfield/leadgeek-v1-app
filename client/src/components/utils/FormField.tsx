import React from 'react';

interface FormFieldProps {
	label: string;
	type: string;
	name: string;
	placeholder: string;
	value?: string | number;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required: boolean;
	styles: string | null;
	lightOnly?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
	label,
	type,
	name,
	placeholder,
	value,
	onChange,
	required,
	styles,
	lightOnly,
}) => {
	return (
		<div className={`pt-4 ${styles ? styles : ''} flex-col items-center`}>
			<label
				htmlFor={name}
				className={lightOnly ? 'form-field-label-light' : 'form-field-label'}
			>
				{label}
			</label>
			<input
				id={name}
				name={name}
				type={type}
				value={value}
				placeholder={placeholder}
				required={required}
				onChange={onChange}
				className={`mt-1 ${lightOnly ? 'form-field-light' : 'form-field'}`}
			/>
		</div>
	);
};

export default FormField;
