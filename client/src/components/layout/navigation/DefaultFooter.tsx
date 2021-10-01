import React from 'react';

const DefaultFooter = () => {
	return (
		<footer className='mt-6 xl:mt-0 mb-6 container'>
			<span className='bg-white'>
				&copy; 2020 - {new Date().getFullYear()} LeadGeek, Inc. All rights
				reserved.
			</span>
		</footer>
	);
};

export default DefaultFooter;
