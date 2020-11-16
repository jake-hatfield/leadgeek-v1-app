import React, { useState } from 'react';

import DropdownRow from './DropdownRow';

const CoreStatsDropdown = ({ header, obj, defaultOpen }) => {
	const [dropdown, toggleDropdown] = useState(defaultOpen || false);
	return (
		<div className='mb-8 lg:w-2/5'>
			<button
				onClick={() => toggleDropdown(!dropdown)}
				className='w-full flex items-end justify-between rounded-md focus:outline-none'
			>
				<div className='flex items-end'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						className='p-2 h-10 w-10 flex-shrink-0 rounded-md bg-purple-600 text-white'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z'
						/>
					</svg>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<path d='M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z' />
					</svg>
					<h4 className='ml-4 text-2xl leading-none font-semibold text-gray-700'>
						{header}
					</h4>
				</div>
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
					{obj.category && <DropdownRow title='Category' pill={obj.category} />}
					{obj.asin && <DropdownRow title='ASIN' pill={obj.asin} />}
					{obj.brand && <DropdownRow title='Brand' pill={obj.brand} />}
				</div>
			)}
		</div>
	);
};

export default CoreStatsDropdown;
