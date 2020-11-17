import React from 'react';

const Pill = ({ pill, pillColor }) => {
	return (
		<div
			className={`${
				pillColor === 'green'
					? 'bg-teal-200 text-teal-600'
					: 'bg-gray-100 text-gray-600'
			} p-1 rounded-md font-medium text-sm`}
		>
			{pill}
		</div>
	);
};

export default Pill;
