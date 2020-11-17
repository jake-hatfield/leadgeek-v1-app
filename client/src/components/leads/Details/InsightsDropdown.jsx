import React, { useState } from 'react';

import DropdownRow from './DropdownRow';

const TrendsDropdown = ({ header, obj, defaultOpen }) => {
	const [dropdown, toggleDropdown] = useState(defaultOpen || false);
	return (
		<div className='mb-8'>
			<button
				onClick={() => toggleDropdown(!dropdown)}
				className='w-full flex items-end justify-between rounded-md focus:outline-none'
			>
				<h4 className='text-2xl leading-none font-semibold text-gray-700'>
					{header}
				</h4>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='currentColor'
					className='h-5 w-5 text-gray-300'
				>
					{dropdown ? (
						<path
							fillRule='evenodd'
							d='M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z'
							clipRule='evenodd'
						/>
					) : (
						<path
							fillRule='evenodd'
							d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
							d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
							clipRule='evenodd'
						/>
					)}
				</svg>
			</button>
			<div className='mt-2 border-t-2 border-gray-100' />
			{dropdown && (
				<div className='mt-4'>
					{obj.source && obj.sourceLink && (
						<DropdownRow
							title='Source link'
							link={obj.sourceLink}
							source={obj.source}
						/>
					)}
					{obj.amzLink && <DropdownRow title='Sell link' link={obj.amzLink} />}
					{obj.category && (
						<DropdownRow
							title='Category'
							pill={obj.category}
							pillColor='green'
						/>
					)}
					{obj.asin && <DropdownRow title='ASIN' pill={obj.asin} />}
					{obj.brand && <DropdownRow title='Brand' pill={obj.brand} />}
				</div>
			)}
		</div>
	);
};

export default TrendsDropdown;
