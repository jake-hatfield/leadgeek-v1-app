import React, { useState } from 'react';
import DropdownRow from './DropdownRow';

const Dropdown = ({ header, obj, arrayItems, defaultOpen }) => {
	const [dropdown, toggleDropdown] = useState(defaultOpen || false);
	let type;
	if (header.toLowerCase() === 'core stats') {
		type = 'coreStats';
	}
	return (
		<div className='mb-8 lg:w-1/3'>
			<button
				onClick={() => toggleDropdown(!dropdown)}
				className='w-full flex items-end justify-between rounded-md focus:outline-none focus:shadow-outline'
			>
				<div className='flex items-end'>
					{type === 'coreStats' && (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							className='p-2 h-8 w-8 flex-shrink-0 rounded-md bg-purple-600 text-white'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
							/>
						</svg>
					)}
					<h4 className='ml-2 text-xl font-semibold text-gray-700'>{header}</h4>
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
			{type === 'coreStats' && dropdown && (
				<div className='mt-4'>
					<div>
						{obj.netProfit && (
							<DropdownRow title={'Net profit'} value={obj.netProfit} />
						)}
						{obj.roi && <DropdownRow title={'Net ROI'} value={obj.roi} />}
						{obj.currentBSR && (
							<DropdownRow title={'Current BSR'} value={obj.currentBSR} />
						)}
						{obj.monthlySales && (
							<DropdownRow title={'Monthly sales'} value={obj.monthlySales} />
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Dropdown;
