import React, { useState } from 'react';

interface ToggleProps {
	itemLeft: JSX.Element | null;
	itemRight: JSX.Element | null;
	onChange: () => void;
	defaultChecked: boolean;
}

const Toggle: React.FC<ToggleProps> = ({
	itemLeft,
	itemRight,
	onChange,
	defaultChecked,
}) => {
	// local state
	const [checked, setChecked] = useState(defaultChecked);

	return (
		<label
			htmlFor='colorTheme'
			className='flex items-center cursor-pointer text-sm font-semibold text-100'
		>
			{itemLeft && itemLeft}
			<div
				className={`${
					itemLeft && itemRight
						? 'mx-2'
						: itemLeft
						? 'm-2'
						: itemRight
						? 'mr-2'
						: ''
				} relative`}
			>
				<input
					type='checkbox'
					defaultChecked={defaultChecked}
					onChange={() => {
						setChecked((prev) => !prev);
						onChange();
					}}
					id='colorTheme'
					className='sr-only'
				/>
				<div className='block bg-gray-300 dark:bg-darkGray-200 w-12 h-6 rounded-full border border-300' />
				<div
					className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full transition transform ${
						!checked
							? 'bg-white dark:bg-gray-200'
							: 'bg-gray-600 dark:bg-purple-300 translate-x-6'
					} shadow-md`}
				/>
			</div>
			{itemRight && itemRight}
		</label>
	);
};

export default Toggle;
