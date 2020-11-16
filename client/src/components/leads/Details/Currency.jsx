import React from 'react';

const Currency = ({ currency }) => {
	return (
		<div className='font-semibold text-gray-600'>${currency.toFixed(2)}</div>
	);
};

export default Currency;
