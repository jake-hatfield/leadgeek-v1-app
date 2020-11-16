import React from 'react';

const Percentage = ({ percentage }) => {
	return (
		<div className='font-semibold text-gray-600'>
			{percentage}
			<span className='ml-1 text-gray-400 font-semibold'>%</span>
		</div>
	);
};

export default Percentage;
