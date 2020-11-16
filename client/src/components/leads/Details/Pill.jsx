import React from 'react';

const Pill = ({ pill }) => {
	return (
		<div className='p-1 rounded-md bg-gray-100 font-medium text-gray-600 text-sm'>
			{pill}
		</div>
	);
};

export default Pill;
