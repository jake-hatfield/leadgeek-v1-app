import React from 'react';

const DefaultFooter = () => {
	return (
		<div className='mt-6 xl:mt-0 mb-6 container'>
			&copy; 2020 - {new Date().getFullYear()} LeadGeek, Inc. All rights
			reserved.
		</div>
	);
};

export default DefaultFooter;
