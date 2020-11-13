import React from 'react';

const DropdownRow = ({ title, value }) => {
	return (
		<div className='flex justify-between'>
			<div>{title}</div>
			<div>{value}</div>
		</div>
	);
};

export default DropdownRow;
